import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const q = searchParams.get("q") ?? "";

  const limit = 10;
  const offset = (page - 1) * limit;

  const subsResult = await pool.query(
    `
    SELECT
      s.id,
      s.status,
      s.started_at,
      s.ended_at,
      u.email,
      p.name AS plan_name,
      p.price_cents,
      p.interval
    FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    JOIN plans p ON p.id = s.plan_id
    WHERE u.email ILIKE $1
    ORDER BY s.started_at DESC
    LIMIT $2 OFFSET $3
    `,
    [`%${q}%`, limit, offset],
  );

  const countResult = await pool.query(
    `
    SELECT COUNT(*)
    FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    WHERE u.email ILIKE $1
    `,
    [`%${q}%`],
  );

  const total = Number(countResult.rows[0].count);

  return NextResponse.json({
    success: true,
    subscriptions: subsResult.rows,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
