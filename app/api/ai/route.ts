/**
 * POST /api/ai
 *
 * Body: {
 *   model:       "claude-sonnet-4-5" | "claude-haiku-4-5",
 *   messages:    Anthropic Messages format,
 *   max_tokens:  number  // upper bound for output
 * }
 *
 * Flow:
 *   1. Auth (middleware already gated; double-check here)
 *   2. Estimate input tokens via anthropic.messages.countTokens
 *   3. Pre-charge with charged_micro = computeCharge(model, estIn, max_tokens)
 *      → debit_wallet (atomic, fails if insufficient)
 *   4. Call anthropic.messages.create
 *   5. Reconcile: compute real charge from usage; refund (est - real) if positive,
 *      debit additional if negative (shouldn't happen since est uses max_tokens).
 *   6. logAiCall(status='ok')
 *
 * On Anthropic failure: refund the full pre-charge, log status='error'.
 *
 * Returns: { content, usage, cost_micro, charged_micro, balance_micro }
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  computeCharge,
  DEFAULT_MODEL,
  MODEL_PRICING,
  type ModelKey
} from "@/lib/pricing";
import {
  debitWallet,
  creditWallet,
  logAiCall,
  getWalletBalance,
  InsufficientBalanceError
} from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const modelKeys = Object.keys(MODEL_PRICING) as [ModelKey, ...ModelKey[]];

const Body = z.object({
  model: z.enum(modelKeys).default(DEFAULT_MODEL),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1)
      })
    )
    .min(1)
    .max(40),
  max_tokens: z.number().int().min(1).max(4096).default(1024),
  system: z.string().optional()
});

export async function POST(req: NextRequest) {
  // 1. Auth
  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (e) {
    return NextResponse.json(
      { error: "service_misconfigured", detail: (e as Error).message },
      { status: 503 }
    );
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Validate
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "invalid_body", detail: (e as Error).message },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "anthropic_not_configured" },
      { status: 500 }
    );
  }
  const anthropic = new Anthropic({ apiKey });

  // 3. Estimate input tokens (rough char-based heuristic).
  //    We deliberately over-estimate so the pre-charge covers worst case;
  //    real usage is reconciled and excess refunded after the Anthropic call.
  //    Switch to anthropic.beta.messages.countTokens() later for tighter quotes.
  const totalChars =
    body.messages.reduce((n, m) => n + m.content.length, 0) +
    (body.system?.length ?? 0);
  const estIn = Math.ceil(totalChars / 3) + 100; // ~3 chars/token, +100 safety

  // 4. Pre-charge assuming worst case = max_tokens output
  const preEst = computeCharge(body.model, estIn, body.max_tokens);
  const preRef = `pre_${crypto.randomUUID()}`;

  try {
    await debitWallet(user.id, preEst.charged_micro, preRef, {
      stage: "pre_estimate",
      model: body.model,
      est_input_tokens: estIn,
      est_output_tokens: body.max_tokens
    });
  } catch (e) {
    if (e instanceof InsufficientBalanceError) {
      const bal = await getWalletBalance(user.id);
      return NextResponse.json(
        {
          error: "insufficient_balance",
          required_micro: preEst.charged_micro,
          balance_micro: bal,
          topup_url: "/account"
        },
        { status: 402 }
      );
    }
    return NextResponse.json(
      { error: "wallet_error", detail: (e as Error).message },
      { status: 500 }
    );
  }

  // 5. Call Anthropic
  let resp;
  try {
    resp = await anthropic.messages.create({
      model: body.model,
      messages: body.messages,
      max_tokens: body.max_tokens,
      ...(body.system ? { system: body.system } : {})
    });
  } catch (e) {
    // Full refund
    await creditWallet(
      user.id,
      preEst.charged_micro,
      "refund",
      `refund_${preRef}`,
      { reason: "anthropic_error", error: (e as Error).message }
    );
    await logAiCall(user.id, {
      model: body.model,
      input_tokens: estIn,
      output_tokens: 0,
      cost_micro: 0,
      charged_micro: 0,
      status: "error",
      error_message: (e as Error).message
    });
    return NextResponse.json(
      { error: "anthropic_error", detail: (e as Error).message },
      { status: 502 }
    );
  }

  // 6. Reconcile against real usage
  const realIn = resp.usage.input_tokens;
  const realOut = resp.usage.output_tokens;
  const real = computeCharge(body.model, realIn, realOut);
  const delta = preEst.charged_micro - real.charged_micro; // >0 = refund some
  let finalBalance: number | null = null;

  if (delta > 0) {
    finalBalance = await creditWallet(
      user.id,
      delta,
      "refund",
      `reconcile_${preRef}`,
      { reason: "overestimate_refund", real_charge: real.charged_micro }
    );
  } else if (delta < 0) {
    // Charged less than actual — rare (only if estIn underestimated).
    try {
      finalBalance = await debitWallet(
        user.id,
        -delta,
        `topup_reconcile_${preRef}`,
        { reason: "underestimate_topup", real_charge: real.charged_micro }
      );
    } catch {
      // best-effort: service already rendered, accept the small loss
      finalBalance = await getWalletBalance(user.id);
    }
  } else {
    finalBalance = await getWalletBalance(user.id);
  }

  await logAiCall(user.id, {
    model: body.model,
    input_tokens: realIn,
    output_tokens: realOut,
    cost_micro: real.cost_micro,
    charged_micro: real.charged_micro,
    status: "ok"
  });

  return NextResponse.json({
    id: resp.id,
    model: resp.model,
    content: resp.content,
    usage: { input_tokens: realIn, output_tokens: realOut },
    cost_micro: real.cost_micro,
    charged_micro: real.charged_micro,
    balance_micro: finalBalance ?? (await getWalletBalance(user.id))
  });
}
