import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== ROLES.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 },
    );
  }

  const [users, activeSubs, revenue] = await Promise.all([
    pool.query(`SELECT COUNT(*) FROM users`),
    pool.query(`SELECT COUNT(*) FROM subscriptions WHERE status = 'ACTIVE'`),
    pool.query(`
      SELECT COALESCE(SUM(p.price_cents), 0) AS total
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.status = 'ACTIVE'
    `),
  ]);

  return NextResponse.json({
    success: true,
    stats: {
      users: Number(users.rows[0].count),
      activeSubscriptions: Number(activeSubs.rows[0].count),
      revenueCents: Number(revenue.rows[0].total),
    },
  });
}
