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
  const limit = 10;
  const offset = (page - 1) * limit;

  const q = searchParams.get("q") ?? "";

  const usersResult = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.role,
      u.created_at,
      s.status AS subscription_status,
      p.name AS plan_name
    FROM users u
    LEFT JOIN subscriptions s
      ON s.user_id = u.id AND s.status = 'ACTIVE'
    LEFT JOIN plans p
      ON p.id = s.plan_id
    WHERE u.email ILIKE $1
    ORDER BY u.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [`%${q}%`, limit, offset],
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM users WHERE email ILIKE $1`,
    [`%${q}%`],
  );

  const total = Number(countResult.rows[0].count);

  return NextResponse.json({
    success: true,
    users: usersResult.rows,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
