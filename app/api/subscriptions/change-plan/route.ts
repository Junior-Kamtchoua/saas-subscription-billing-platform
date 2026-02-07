import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function POST(req: Request) {
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
        { success: false, message: "Only customers can change plan" },
        { status: 403 },
      );
    }

    const { newPlanId } = await req.json();

    if (!newPlanId) {
      return NextResponse.json(
        { success: false, message: "Missing newPlanId" },
        { status: 400 },
      );
    }

    const activeSubResult = await pool.query(
      `
      SELECT id, plan_id
      FROM subscriptions
      WHERE user_id = $1
        AND status = 'ACTIVE'
      `,
      [userId],
    );

    if (activeSubResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "No active subscription found" },
        { status: 404 },
      );
    }

    const activeSub = activeSubResult.rows[0];

    if (activeSub.plan_id === newPlanId) {
      return NextResponse.json(
        { success: false, message: "Already on this plan" },
        { status: 409 },
      );
    }

    await pool.query(
      `
      UPDATE subscriptions
      SET status = 'CANCELED',
          ended_at = NOW()
      WHERE id = $1
      `,
      [activeSub.id],
    );

    await pool.query(
      `
      INSERT INTO subscriptions (user_id, plan_id, status, started_at)
      VALUES ($1, $2, 'ACTIVE', NOW())
      `,
      [userId, newPlanId],
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return NextResponse.json(
        { success: false, message: "Subscription conflict" },
        { status: 409 },
      );
    }

    console.error("CHANGE PLAN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
