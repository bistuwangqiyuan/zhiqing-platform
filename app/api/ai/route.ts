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
 *   2. Estimate input tokens via simple char heuristic
 *   3. Pre-charge with charged_micro = computeCharge(model, estIn, max_tokens)
 *      → debit_wallet (atomic, fails if insufficient)
 *   4. Call anthropic.messages.create
 *   5. Reconcile: refund (est - real) if positive, debit additional if negative
 *   6. logAiCall(status='ok')
 *
 * On Anthropic failure: refund the full pre-charge, log status='error'.
 *
 * Returns: { content, usage, cost_micro, charged_micro, balance_micro }
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db";
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
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "service_misconfigured", detail: "NETLIFY_DATABASE_URL not set" },
      { status: 503 }
    );
  }

  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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

  // Pre-charge: deliberately over-estimate so the worst case is covered;
  // the excess is refunded after Anthropic responds with real usage.
  const totalChars =
    body.messages.reduce((n, m) => n + m.content.length, 0) +
    (body.system?.length ?? 0);
  const estIn = Math.ceil(totalChars / 3) + 100;

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

  let resp;
  try {
    resp = await anthropic.messages.create({
      model: body.model,
      messages: body.messages,
      max_tokens: body.max_tokens,
      ...(body.system ? { system: body.system } : {})
    });
  } catch (e) {
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

  const realIn = resp.usage.input_tokens;
  const realOut = resp.usage.output_tokens;
  const real = computeCharge(body.model, realIn, realOut);
  const delta = preEst.charged_micro - real.charged_micro;
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
    try {
      finalBalance = await debitWallet(
        user.id,
        -delta,
        `topup_reconcile_${preRef}`,
        { reason: "underestimate_topup", real_charge: real.charged_micro }
      );
    } catch {
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
