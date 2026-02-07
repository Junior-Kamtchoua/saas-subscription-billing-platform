import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== ROLES.ADMIN) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    const activityResult = await pool.query(
      `
      SELECT
        u.email,
        a.type,
        a.metadata,
        a.created_at AS occurred_at
      FROM activity_events a
      JOIN users u ON u.id = a.user_id
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM activity_events`,
    );

    return NextResponse.json({
      success: true,
      activities: activityResult.rows,
      page,
      totalPages: Math.ceil(Number(countResult.rows[0].count) / limit),
    });
  } catch (error) {
    console.error("ADMIN ACTIVITY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load activity" },
      { status: 500 },
    );
  }
}
