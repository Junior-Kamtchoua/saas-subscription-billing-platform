import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { ROLES } from "@/lib/roles";

export async function POST(req: Request) {
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

    // 🔒 Seuls les customers peuvent changer de plan
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

    // 🔍 Récupérer l’abonnement actif actuel
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

    // 🚫 Même plan → inutile
    if (activeSub.plan_id === newPlanId) {
      return NextResponse.json(
        { success: false, message: "Already on this plan" },
        { status: 409 },
      );
    }

    // 1️⃣ Annuler l’abonnement actif
    await pool.query(
      `
      UPDATE subscriptions
      SET status = 'CANCELED',
          ended_at = NOW()
      WHERE id = $1
      `,
      [activeSub.id],
    );

    // 2️⃣ Créer le nouvel abonnement actif (IMPORTANT : started_at)
    await pool.query(
      `
      INSERT INTO subscriptions (user_id, plan_id, status, started_at)
      VALUES ($1, $2, 'ACTIVE', NOW())
      `,
      [userId, newPlanId],
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // ⚠️ Sécurité DB : index unique (1 abonnement actif max)
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
