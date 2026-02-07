import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { userId, role } = session;

    if (role !== ROLES.CUSTOMER) {
      return NextResponse.json(
        { success: false, message: "Only customers have subscriptions" },
        { status: 403 },
      );
    }

    const result = await pool.query(
      `
      SELECT
        s.status,
        s.started_at,
        p.id AS plan_id,
        p.name AS plan_name,
        p.price_cents
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.user_id = $1
        AND s.status = 'ACTIVE'
      ORDER BY s.started_at DESC
      LIMIT 1
      `,
      [userId],
    );

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: true,
        subscription: null,
      });
    }

    const row = result.rows[0];

    return NextResponse.json({
      success: true,
      subscription: {
        status: row.status,
        startedAt: row.started_at,
        plan: {
          id: row.plan_id,
          name: row.plan_name,
          priceCents: row.price_cents,
        },
      },
    });
  } catch (error) {
    console.error("GET SUBSCRIPTION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
