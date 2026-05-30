/**
 * POST /api/stripe/checkout
 * Body: { topup_id: "topup_10" | "topup_50" | "topup_200" }
 *
 * Returns: { url: string }  — redirect user to Stripe-hosted Checkout.
 *
 * Stripe collects the actual payment via Alipay / WeChat Pay / Card.
 * On success Stripe fires `checkout.session.completed` → /api/stripe/webhook
 * credits the wallet.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db";
import { getTopupPackage, TOPUP_PACKAGES } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ids = TOPUP_PACKAGES.map((p) => p.id) as [string, ...string[]];
const Body = z.object({ topup_id: z.enum(ids) });

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

  const pkg = getTopupPackage(body.topup_id);
  if (!pkg) {
    return NextResponse.json({ error: "unknown_topup" }, { status: 400 });
  }

  const priceId = process.env[pkg.envPriceKey];
  if (!priceId) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        detail: `Missing ${pkg.envPriceKey} in env. Create a one-time Price in Stripe Dashboard with currency=cny, unit_amount=${pkg.fen}.`
      },
      { status: 500 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "stripe_not_configured", detail: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  let checkoutSession: Stripe.Checkout.Session;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "alipay", "wechat_pay"],
      payment_method_options: {
        wechat_pay: { client: "web" }
      },
      line_items: [{ price: priceId, quantity: 1 }],
      currency: "cny",
      customer_email: user.email ?? undefined,
      metadata: {
        user_id: user.id,
        topup_id: pkg.id,
        micro_cny: String(pkg.micro_cny)
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
          topup_id: pkg.id,
          micro_cny: String(pkg.micro_cny)
        }
      },
      success_url: `${site}/account?topup=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/account?topup=cancelled`
    });
  } catch (e) {
    return NextResponse.json(
      { error: "stripe_create_failed", detail: (e as Error).message },
      { status: 502 }
    );
  }

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "stripe_no_url" }, { status: 502 });
  }
  return NextResponse.json({ url: checkoutSession.url });
}
