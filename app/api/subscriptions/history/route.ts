import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function POST() {
  const session = await getSession();

  if (!session || session.role !== ROLES.CUSTOMER) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  const result = await pool.query(
    `
    SELECT
      s.id,
      s.status,
      s.started_at,
      s.ended_at,
      p.name AS plan_name,
      p.price_cents,
      p.interval
    FROM subscriptions s
    JOIN plans p ON p.id = s.plan_id
    WHERE s.user_id = $1
    ORDER BY s.started_at DESC
    `,
    [session.userId],
  );

  return NextResponse.json({
    success: true,
    subscriptions: result.rows,
  });
}
