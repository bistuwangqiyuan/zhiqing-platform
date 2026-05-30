/**
 * GET /api/health
 *
 * Lightweight health probe used by deploy-watchers and the e2e test harness.
 * Returns deployment metadata (provided by Netlify build env) and a *boolean*
 * snapshot of which third-party env vars are present — never leaks values.
 *
 * Public endpoint: no auth, no DB calls; safe to hit on every test cycle.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    supabase: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    supabase_admin: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
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

  return NextResponse.json({
    ok: true,
    service: "zhiqing-platform",
    // Netlify injects these at build time; absent in local dev.
    commit_sha: process.env.COMMIT_REF ?? null,
    branch: process.env.BRANCH ?? null,
    deploy_url: process.env.DEPLOY_PRIME_URL ?? null,
    build_time: process.env.BUILD_TIME ?? null,
    served_at: new Date().toISOString(),
    env
  });
}
