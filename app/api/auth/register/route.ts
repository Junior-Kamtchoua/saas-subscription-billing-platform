import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email et mot de passe requis" },
      { status: 400 },
    );
  }

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    return NextResponse.json(
      { success: false, message: "Utilisateur déjà existant" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userResult = await pool.query(
    `
    INSERT INTO users (email, password, role)
    VALUES ($1, $2, 'CUSTOMER')
    RETURNING id
    `,
    [email, hashedPassword],
  );

  const userId = userResult.rows[0].id;

  // Activity event
  await pool.query(
    `
    INSERT INTO activity_events (user_id, type)
    VALUES ($1, 'USER_REGISTERED')
    `,
    [userId],
  );

  return NextResponse.json({ success: true });
}
