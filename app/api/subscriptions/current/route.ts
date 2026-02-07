import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function POST() {
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
        { success: false, message: "Only customers allowed" },
        { status: 403 },
      );
    }

    const result = await pool.query(
      `
      SELECT
        s.id AS subscription_id,
        s.status,
        s.started_at,
        s.ended_at,
        p.id AS plan_id,
        p.name AS plan_name,
        p.price_cents,
        p.interval
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.user_id = $1
        AND s.status = 'ACTIVE'
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

    return NextResponse.json({
      success: true,
      subscription: result.rows[0],
    });
  } catch (error: unknown) {
    console.error("CURRENT SUBSCRIPTION ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
