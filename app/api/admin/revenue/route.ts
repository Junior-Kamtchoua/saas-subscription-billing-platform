import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== ROLES.ADMIN) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    // 💰 MRR (subscriptions actives)
    const mrrResult = await pool.query(`
      SELECT COALESCE(SUM(p.price_cents), 0) AS mrr
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.status = 'ACTIVE'
    `);

    // 📊 Revenue by month (UTILISE created_at, PLUS SÛR)
    // 📊 Revenue by month (basé sur started_at)
    const monthlyResult = await pool.query(`
  SELECT
    DATE_TRUNC('month', s.started_at) AS month,
    COALESCE(SUM(p.price_cents), 0) AS revenue
  FROM subscriptions s
  JOIN plans p ON p.id = s.plan_id
  WHERE s.status = 'ACTIVE'
  GROUP BY month
  ORDER BY month
`);

    // 📦 Revenue by plan
    const planResult = await pool.query(`
      SELECT
        p.name,
        COALESCE(SUM(p.price_cents), 0) AS revenue
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.status = 'ACTIVE'
      GROUP BY p.name
    `);

    return NextResponse.json({
      success: true,
      mrrCents: Number(mrrResult.rows[0]?.mrr ?? 0),
      revenueByMonth: monthlyResult.rows.map((r) => ({
        month: r.month ? r.month.toISOString().slice(0, 7) : "",
        revenue: Number(r.revenue),
      })),
      revenueByPlan: planResult.rows.map((r) => ({
        name: r.name,
        revenue: Number(r.revenue),
      })),
    });
  } catch (error) {
    console.error("ADMIN REVENUE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load revenue data",
      },
      { status: 500 },
    );
  }
}
