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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTopupPackage, TOPUP_PACKAGES } from "@/lib/pricing";

const ids = TOPUP_PACKAGES.map((p) => p.id) as [string, ...string[]];
const Body = z.object({ topup_id: z.enum(ids) });

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

  // 2. Validate body
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

  // 3. Resolve Stripe Price ID from env
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
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  // 4. Create one-time Checkout Session with Alipay + WeChat Pay + Card
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "alipay", "wechat_pay"],
      payment_method_options: {
        wechat_pay: { client: "web" }
      },
      line_items: [{ price: priceId, quantity: 1 }],
      currency: "cny",
      customer_email: user.email ?? undefined,
      // metadata travels with the session and surfaces in the webhook
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

  if (!session.url) {
    return NextResponse.json({ error: "stripe_no_url" }, { status: 502 });
  }
  return NextResponse.json({ url: session.url });
}
