/**
 * GET /api/health
 *
 * Lightweight health probe used by deploy-watchers and the e2e test harness.
 * Returns deployment metadata (Netlify build env), a *boolean* snapshot of
 * which third-party env vars are present (never leaks values), and a live
 * Neon DB ping.
 *
 * Public endpoint: no auth.
 */
import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { pingDb } from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    neon: isDbConfigured(),
    auth: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    stripe: Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET
    ),
    stripe_prices: Boolean(
      process.env.STRIPE_PRICE_TOPUP_10 &&
        process.env.STRIPE_PRICE_TOPUP_50 &&
        process.env.STRIPE_PRICE_TOPUP_200
    ),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    site_url: Boolean(process.env.NEXT_PUBLIC_SITE_URL)
  };

  // Live DB probe — only attempted when env says it should work, so a
  // missing-env deployment doesn't burn a few hundred ms on an obvious fail.
  let db: { ok: boolean; error?: string } = { ok: false };
  if (env.neon) {
    db = await pingDb();
  }

  return NextResponse.json({
    ok: true,
    service: "zhiqing-platform",
    commit_sha: process.env.COMMIT_REF ?? null,
    branch: process.env.BRANCH ?? null,
    deploy_url: process.env.DEPLOY_PRIME_URL ?? null,
    build_time: process.env.BUILD_TIME ?? null,
    served_at: new Date().toISOString(),
    env,
    db
  });
}
