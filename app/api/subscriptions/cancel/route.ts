import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function POST() {
  try {
    // 🔒 Session depuis cookie httpOnly
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { userId, role } = session;

    // 🔒 Seuls les customers peuvent annuler
    if (role !== ROLES.CUSTOMER) {
      return NextResponse.json(
        { success: false, message: "Only customers can cancel" },
        { status: 403 },
      );
    }

    // 🔍 Récupérer l’abonnement actif
    const subResult = await pool.query(
      `
      SELECT id, plan_id
      FROM subscriptions
      WHERE user_id = $1 AND status = 'ACTIVE'
      `,
      [userId],
    );

    if (subResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "No active subscription found" },
        { status: 404 },
      );
    }

    const subscription = subResult.rows[0];

    // ❌ Annuler l’abonnement
    await pool.query(
      `
      UPDATE subscriptions
      SET status = 'CANCELED',
          ended_at = NOW()
      WHERE id = $1
      `,
      [subscription.id],
    );

    // 📝 Activity event (ADMIN → Activity)
    await pool.query(
      `
      INSERT INTO activity_events (user_id, type, metadata)
      VALUES ($1, 'SUBSCRIPTION_CANCELED', $2)
      `,
      [userId, JSON.stringify({ planId: subscription.plan_id })],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CANCEL SUBSCRIPTION ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
