/**
 * POST /api/stripe/webhook
 *
 * Stripe → us. Verifies signature with STRIPE_WEBHOOK_SECRET.
 * On `checkout.session.completed` (one-time payment, mode='payment'), credits
 * the user's wallet by the micro_cny encoded in session metadata.
 *
 * IDEMPOTENT: `transactions.ref = session.id` has a unique index. A replayed
 * webhook silently no-ops (creditWallet returns null on the dup-key path).
 *
 * NOTE: middleware.ts is configured to skip /api/stripe/webhook so cookies
 * are not touched and the raw body is preserved for signature verification.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { creditWallet } from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!sig || !secret || !stripeKey) {
    return NextResponse.json(
      { error: "webhook_not_configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey);
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (e) {
    return NextResponse.json(
      { error: "bad_signature", detail: (e as Error).message },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only handle paid one-time top-ups
    if (session.mode !== "payment" || session.payment_status !== "paid") {
      return NextResponse.json({ received: true, skipped: "not_paid" });
    }

    const md = session.metadata ?? {};
    const userId = md.user_id;
    const microCny = Number(md.micro_cny ?? "0");

    if (!userId || !microCny) {
      console.error("checkout.session.completed missing metadata", {
        session_id: session.id,
        metadata: md
      });
      return NextResponse.json(
        { error: "missing_metadata" },
        { status: 400 }
      );
    }

    try {
      const newBalance = await creditWallet(
        userId,
        microCny,
        "topup",
        session.id,
        {
          topup_id: md.topup_id,
          stripe_payment_intent: session.payment_intent,
          amount_total: session.amount_total
        }
      );
      return NextResponse.json({
        received: true,
        credited: newBalance !== null,
        new_balance_micro: newBalance
      });
    } catch (e) {
      console.error("creditWallet failed", e);
      return NextResponse.json(
        { error: "credit_failed", detail: (e as Error).message },
        { status: 500 }
      );
    }
  }

  // All other events: ack
  return NextResponse.json({ received: true });
}
