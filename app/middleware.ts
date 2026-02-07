import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/customer");

  // 🔒 Accès aux routes protégées sans session → login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔁 Accès aux routes auth alors qu’on est connecté → dashboard
  if (isAuthRoute && sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);

      if (session.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      return NextResponse.redirect(new URL("/customer/dashboard", request.url));
    } catch {
      // Cookie invalide → forcer login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/login", "/register"],
};
