/**
 * Wallet operations — server-only.
 * All amounts are positive integers in micro_cny. Negative deltas (refunds)
 * are expressed as positive credits with kind='refund'.
 */
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export class InsufficientBalanceError extends Error {
  constructor() {
    super("insufficient_balance");
    this.name = "InsufficientBalanceError";
  }
}

export type TxKind = "signup_grant" | "topup" | "debit" | "refund" | "adjust";

/** Atomic deduction via SQL RPC. Throws InsufficientBalanceError if balance < amount. */
export async function debitWallet(
  userId: string,
  amountMicro: number,
  ref: string,
  meta: Record<string, unknown> = {}
): Promise<number> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("debit_wallet", {
    p_user: userId,
    p_amount: amountMicro,
    p_ref: ref,
    p_meta: meta
  });
  if (error) {
    if (error.code === "P0001" || /insufficient_balance/i.test(error.message)) {
      throw new InsufficientBalanceError();
    }
    throw new Error(`debit_failed: ${error.message}`);
  }
  return data as number;
}

/**
 * Credit wallet. Idempotent on `ref` — same `ref` returns null (already credited)
 * to safely handle Stripe webhook replays.
 */
export async function creditWallet(
  userId: string,
  amountMicro: number,
  kind: Exclude<TxKind, "debit">,
  ref: string,
  meta: Record<string, unknown> = {}
): Promise<number | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("credit_wallet", {
    p_user: userId,
    p_amount: amountMicro,
    p_kind: kind,
    p_ref: ref,
    p_meta: meta
  });
  if (error) {
    // Unique violation on transactions_ref_uniq => already credited, no-op.
    if (
      /duplicate key|unique constraint/i.test(error.message) ||
      error.code === "23505"
    ) {
      return null;
    }
    throw new Error(`credit_failed: ${error.message}`);
  }
  return data as number;
}

export async function logAiCall(
  userId: string,
  fields: {
    model: string;
    input_tokens: number;
    output_tokens: number;
    cost_micro: number;
    charged_micro: number;
    status: "ok" | "error";
    error_message?: string;
  }
): Promise<string | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_calls")
    .insert({ user_id: userId, ...fields })
    .select("id")
    .single();
  if (error) {
    console.error("logAiCall failed:", error.message);
    return null;
  }
  return data?.id ?? null;
}

export async function getWalletBalance(userId: string): Promise<number> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wallets")
    .select("balance_micro")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`wallet_read_failed: ${error.message}`);
  return Number(data?.balance_micro ?? 0);
}
