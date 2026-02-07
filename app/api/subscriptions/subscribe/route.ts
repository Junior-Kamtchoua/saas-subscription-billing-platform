import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function POST(req: Request) {
  try {
    // 🔒 Session (cookie httpOnly)
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { userId, role } = session;

    // 🔒 Only customers
    if (role !== ROLES.CUSTOMER) {
      return NextResponse.json(
        { success: false, message: "Only customers can subscribe" },
        { status: 403 },
      );
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { success: false, message: "Missing planId" },
        { status: 400 },
      );
    }

    // 🚫 Sécurité : déjà un abonnement actif ?
    const existing = await pool.query(
      `
      SELECT id
      FROM subscriptions
      WHERE user_id = $1 AND status = 'ACTIVE'
      `,
      [userId],
    );

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { success: false, message: "Subscription already active" },
        { status: 409 },
      );
    }

    // ✅ Créer l’abonnement actif
    await pool.query(
      `
      INSERT INTO subscriptions (user_id, plan_id, status)
      VALUES ($1, $2, 'ACTIVE')
      `,
      [userId, planId],
    );

    // ✅ Activity event (source unique Admin dashboard)
    await pool.query(
      `
      INSERT INTO activity_events (user_id, type, metadata)
      VALUES ($1, 'SUBSCRIPTION_STARTED', $2)
      `,
      [userId, JSON.stringify({ planId })],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SUBSCRIBE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
