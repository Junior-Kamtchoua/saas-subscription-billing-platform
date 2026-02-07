import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import { ROLES } from "@/lib/roles";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email et mot de passe requis" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase();

    const result = await pool.query(
      "SELECT id, password, role FROM users WHERE email = $1",
      [normalizedEmail],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Identifiants invalides" },
        { status: 401 },
      );
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Identifiants invalides" },
        { status: 401 },
      );
    }

    const role = user.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.CUSTOMER;

    // ✅ Réponse HTTP
    const response = NextResponse.json({
      success: true,
      role,
      userId: user.id,
    });

    // 🔒 Cookie httpOnly (CORRECT)
    response.cookies.set(
      "session",
      JSON.stringify({
        userId: user.id,
        role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    );

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
