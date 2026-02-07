import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/getSession";
import { pool } from "@/lib/db";
import { ROLES } from "@/lib/roles";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// Mapping DB
const INTERVAL_MAP: Record<string, Stripe.Price.Recurring.Interval> = {
  MONTHLY: "month",
  YEARLY: "year",
  monthly: "month",
  yearly: "year",
  month: "month",
  year: "year",
};

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== ROLES.CUSTOMER) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { success: false, message: "Missing planId" },
        { status: 400 },
      );
    }

    const planResult = await pool.query(
      `SELECT id, name, price_cents, interval FROM plans WHERE id = $1`,
      [planId],
    );

    if (planResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Plan not found" },
        { status: 404 },
      );
    }

    const plan = planResult.rows[0];

    const stripeInterval = INTERVAL_MAP[plan.interval] ?? "month"; // fallback safe

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
            },
            unit_amount: Number(plan.price_cents),
            recurring: {
              interval: stripeInterval,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.userId,
        planId: plan.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/customer/plans?canceled=1`,
    });

    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
