/**
 * Wallet operations — server-only.
 *
 * All amounts are positive integers in micro_cny. Negative deltas (refunds)
 * are expressed as positive credits with kind='refund'. Atomic guarantees
 * are enforced by the SQL functions `debit_wallet` / `credit_wallet`
 * provisioned by `lib/db/migrate.sql`.
 */
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { wallets, transactions, aiCalls } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class InsufficientBalanceError extends Error {
  constructor() {
    super("insufficient_balance");
    this.name = "InsufficientBalanceError";
  }
}

export type TxKind = "signup_grant" | "topup" | "debit" | "refund" | "adjust";

const SIGNUP_GRANT_MICRO = 1_000_000; // ¥1

/** Atomic debit. Throws InsufficientBalanceError on insufficient balance. */
export async function debitWallet(
  userId: string,
  amountMicro: number,
  ref: string,
  meta: Record<string, unknown> = {}
): Promise<number> {
  const db = getDb();
  try {
    const rows = (await db.execute(
      sql`select debit_wallet(${userId}::text, ${amountMicro}::bigint, ${ref}::text, ${JSON.stringify(meta)}::jsonb) as balance`
    )) as unknown as { balance: number | string }[];
    const balance = rows[0]?.balance;
    return Number(balance ?? 0);
  } catch (e) {
    const msg = (e as Error).message ?? "";
    if (/insufficient_balance/i.test(msg) || (e as any)?.code === "P0001") {
      throw new InsufficientBalanceError();
    }
    throw new Error(`debit_failed: ${msg}`);
  }
}

/**
 * Idempotent credit. Same `ref` returns null (already credited) — used to
 * make Stripe webhook retries safe and to make the signup grant exactly-once.
 */
export async function creditWallet(
  userId: string,
  amountMicro: number,
  kind: Exclude<TxKind, "debit">,
  ref: string,
  meta: Record<string, unknown> = {}
): Promise<number | null> {
  const db = getDb();
  try {
    const rows = (await db.execute(
      sql`select credit_wallet(${userId}::text, ${amountMicro}::bigint, ${kind}::tx_kind, ${ref}::text, ${JSON.stringify(meta)}::jsonb) as balance`
    )) as unknown as { balance: number | string | null }[];
    const balance = rows[0]?.balance;
    return balance == null ? null : Number(balance);
  } catch (e) {
    const msg = (e as Error).message ?? "";
    if (/duplicate key|unique constraint/i.test(msg)) return null;
    throw new Error(`credit_failed: ${msg}`);
  }
}

/**
 * Idempotent signup grant: ¥1 trial credit on first successful login.
 * Called from the Auth.js signIn callback. Safe to call repeatedly.
 */
export async function grantSignupBonusIfMissing(userId: string): Promise<void> {
  await creditWallet(
    userId,
    SIGNUP_GRANT_MICRO,
    "signup_grant",
    `welcome-${userId}`,
    { reason: "signup_free_credit_cny_1" }
  );
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
  const db = getDb();
  try {
    const inserted = await db
      .insert(aiCalls)
      .values({
        userId,
        model: fields.model,
        inputTokens: fields.input_tokens,
        outputTokens: fields.output_tokens,
        costMicro: fields.cost_micro,
        chargedMicro: fields.charged_micro,
        status: fields.status,
        errorMessage: fields.error_message ?? null
      })
      .returning({ id: aiCalls.id });
    return inserted[0]?.id ?? null;
  } catch (e) {
    console.error("logAiCall failed:", (e as Error).message);
    return null;
  }
}

export async function getWalletBalance(userId: string): Promise<number> {
  const db = getDb();
  const row = await db
    .select({ balance: wallets.balanceMicro })
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .limit(1);
  return Number(row[0]?.balance ?? 0);
}

export async function listRecentTransactions(userId: string, limit = 50) {
  const db = getDb();
  const rows = await db
    .select({
      id: transactions.id,
      kind: transactions.kind,
      amount_micro: transactions.amountMicro,
      balance_after: transactions.balanceAfter,
      ref: transactions.ref,
      created_at: transactions.createdAt
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(sql`${transactions.createdAt} desc`)
    .limit(limit);
  return rows.map((r) => ({
    id: r.id as string,
    kind: r.kind as TxKind,
    amount_micro: Number(r.amount_micro),
    balance_after: Number(r.balance_after),
    ref: (r.ref as string | null) ?? null,
    created_at:
      r.created_at instanceof Date
        ? r.created_at.toISOString()
        : String(r.created_at)
  }));
}

/** Lightweight liveness probe for /api/health. */
export async function pingDb(): Promise<{ ok: boolean; error?: string }> {
  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
