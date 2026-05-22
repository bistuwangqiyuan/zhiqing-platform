/**
 * Token billing config.
 *
 * Wallet balance and all amounts are stored as **micro_cny**:
 *   1 CNY = 1,000,000 micro_cny.
 *
 * Claude prices (USD per Mtok) are pre-converted to micro_cny per Mtok using
 * USD_TO_CNY below, baked into the table. When Anthropic prices change or
 * the FX rate drifts materially, edit MODEL_PRICING directly.
 *
 * Stripe smallest CNY unit = 1 fen = 0.01 CNY = 10,000 micro_cny.
 */

// FX rate baked at edit time. Single source of truth for conversion math.
const USD_TO_CNY = 7.2;

// Helper to derive a micro_cny-per-Mtok integer from a USD-per-Mtok integer.
const mtok = (usdPerMtok: number) =>
  Math.round(usdPerMtok * USD_TO_CNY * 1_000_000);

export const MODEL_PRICING = {
  // Sonnet 4.5: $3 input / $15 output per Mtok
  "claude-sonnet-4-5": {
    in_micro_per_mtok: mtok(3),
    out_micro_per_mtok: mtok(15),
    label: "Claude Sonnet 4.5"
  },
  // Haiku 4.5: $1 input / $5 output per Mtok
  "claude-haiku-4-5": {
    in_micro_per_mtok: mtok(1),
    out_micro_per_mtok: mtok(5),
    label: "Claude Haiku 4.5"
  }
} as const;

export type ModelKey = keyof typeof MODEL_PRICING;
export const DEFAULT_MODEL: ModelKey = "claude-haiku-4-5";

/** 平台加价倍率 — token 成本 × 1.1 */
export const MARKUP = 1.1;

/**
 * Compute cost (true Anthropic cost) and charged (cost × markup) in micro_cny.
 * Both are integers, rounded UP so the platform never under-charges by fractions.
 */
export function computeCharge(
  model: string,
  inputTokens: number,
  outputTokens: number
): { cost_micro: number; charged_micro: number } {
  const p = MODEL_PRICING[model as ModelKey];
  if (!p) throw new Error(`unknown_model:${model}`);
  const raw =
    inputTokens * p.in_micro_per_mtok + outputTokens * p.out_micro_per_mtok;
  const cost_micro = Math.ceil(raw / 1_000_000);
  const charged_micro = Math.ceil(cost_micro * MARKUP);
  return { cost_micro, charged_micro };
}

/**
 * Top-up packages. Stripe Price IDs come from env so the same code works
 * in dev/test/prod Stripe accounts. `fen` is what Stripe charges (smallest CNY unit).
 */
export const TOPUP_PACKAGES = [
  {
    id: "topup_10",
    label: "¥10",
    fen: 1000,
    micro_cny: 10_000_000,
    envPriceKey: "STRIPE_PRICE_TOPUP_10"
  },
  {
    id: "topup_50",
    label: "¥50",
    fen: 5000,
    micro_cny: 50_000_000,
    envPriceKey: "STRIPE_PRICE_TOPUP_50"
  },
  {
    id: "topup_200",
    label: "¥200",
    fen: 20000,
    micro_cny: 200_000_000,
    envPriceKey: "STRIPE_PRICE_TOPUP_200"
  }
] as const;

export type TopupId = (typeof TOPUP_PACKAGES)[number]["id"];

export function getTopupPackage(id: string) {
  return TOPUP_PACKAGES.find((p) => p.id === id);
}

/** micro_cny → "¥X.XX" for UI display. */
export function formatMicroCny(micro: number): string {
  const sign = micro < 0 ? "-" : "";
  return sign + "¥" + (Math.abs(micro) / 1_000_000).toFixed(2);
}
