import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== ROLES.ADMIN) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  // MONTH
  const revenueResult = await pool.query(`
    SELECT
      DATE_TRUNC('month', s.started_at) AS month,
      SUM(p.price_cents) AS revenue
    FROM subscriptions s
    JOIN plans p ON p.id = s.plan_id
    WHERE s.status = 'ACTIVE'
    GROUP BY month
    ORDER BY month
  `);

  // SUBSCRIPTION
  const plansResult = await pool.query(`
    SELECT
      p.name,
      COUNT(*) AS count
    FROM subscriptions s
    JOIN plans p ON p.id = s.plan_id
    WHERE s.status = 'ACTIVE'
    GROUP BY p.name
  `);

  // MONTHLY USERS
  const usersByMonthResult = await pool.query(`
    SELECT
      DATE_TRUNC('month', created_at) AS month,
      COUNT(*) AS count
    FROM users
    GROUP BY month
    ORDER BY month
  `);

  // STATUS
  const subscriptionsByStatusResult = await pool.query(`
    SELECT
      status,
      COUNT(*) AS count
    FROM subscriptions
    GROUP BY status
  `);

  return NextResponse.json({
    success: true,
    revenueByMonth: revenueResult.rows.map((r) => ({
      month: r.month.toISOString().slice(0, 7),
      revenue: Number(r.revenue) / 100,
    })),
    subscriptionsByPlan: plansResult.rows.map((r) => ({
      name: r.name,
      count: Number(r.count),
    })),
    usersByMonth: usersByMonthResult.rows.map((r) => ({
      month: r.month.toISOString().slice(0, 7),
      count: Number(r.count),
    })),
    subscriptionsByStatus: subscriptionsByStatusResult.rows.map((r) => ({
      status: r.status,
      count: Number(r.count),
    })),
  });
}
