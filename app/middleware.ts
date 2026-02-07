import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer");

  if ((isAdminRoute || isCustomerRoute) && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);

      if (isAdminRoute && session.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/customer/dashboard", request.url),
        );
      }

      if (isCustomerRoute && session.role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      if (isAuthRoute) {
        return NextResponse.redirect(
          new URL(
            session.role === "ADMIN"
              ? "/admin/dashboard"
              : "/customer/dashboard",
            request.url,
          ),
        );
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/login", "/register"],
};
