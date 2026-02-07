import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        price_cents,
        interval
      FROM plans
      WHERE is_active = TRUE
      ORDER BY price_cents ASC
      `,
    );

    return NextResponse.json({
      success: true,
      plans: result.rows,
    });
  } catch (error: unknown) {
    console.error("LIST PLANS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
