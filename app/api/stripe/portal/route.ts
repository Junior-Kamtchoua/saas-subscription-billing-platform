import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/getSession";
import { pool } from "@/lib/db";
import { ROLES } from "@/lib/roles";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== ROLES.CUSTOMER) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const result = await pool.query(
    `
    SELECT stripe_customer_id
    FROM subscriptions
    WHERE user_id = $1
      AND status = 'ACTIVE'
    LIMIT 1
    `,
    [session.userId],
  );

  if (result.rowCount === 0) {
    return NextResponse.json(
      { success: false, message: "No active subscription" },
      { status: 400 },
    );
  }

  const stripeCustomerId = result.rows[0].stripe_customer_id;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`,
  });

  return NextResponse.redirect(portalSession.url);
}
