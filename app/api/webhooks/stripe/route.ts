import { NextResponse } from "next/server";
import Stripe from "stripe";
import { pool } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, message: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error";

    console.error("❌ Stripe signature verification failed:", message);

    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      /* SUBSCRIPTION CREATED (Checkout) */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const stripeSubscriptionId = session.subscription as string | null;
        const stripeCustomerId = session.customer as string | null;

        if (!userId || !planId || !stripeSubscriptionId || !stripeCustomerId) {
          break;
        }

        await pool.query(
          `
          INSERT INTO subscriptions (
            user_id,
            plan_id,
            status,
            stripe_subscription_id,
            stripe_customer_id,
            started_at
          )
          VALUES ($1, $2, 'ACTIVE', $3, $4, NOW())
          ON CONFLICT (stripe_subscription_id) DO NOTHING
          `,
          [userId, planId, stripeSubscriptionId, stripeCustomerId],
        );

        break;
      }

      /*SUBSCRIPTION UPDATED*/
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await pool.query(
          `
          UPDATE subscriptions
          SET status = $1
          WHERE stripe_subscription_id = $2
          `,
          [subscription.status.toUpperCase(), subscription.id],
        );

        break;
      }

      /*SUBSCRIPTION CANCELED*/
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await pool.query(
          `
          UPDATE subscriptions
          SET status = 'CANCELED',
              ended_at = NOW()
          WHERE stripe_subscription_id = $1
          `,
          [subscription.id],
        );

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown webhook error";

    console.error("❌ Webhook processing error:", message);

    return NextResponse.json(
      { success: false, message: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
