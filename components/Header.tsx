"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-4 z-50 w-full">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="
            flex h-16 items-center justify-between
            rounded-2xl
            bg-[#0f172a]/70
            backdrop-blur-lg
            ring-1 ring-white/10
          "
        >
          {/* LEFT — LOGO */}
          <div className="flex items-center gap-2 px-5 text-lg font-semibold text-white">
            <span className="text-xl">⬢</span>
            SaaS Platform
          </div>

          {/* CENTER — NAV */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#testimonials" className="transition hover:text-white">
              Testimonials
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>

          {/* RIGHT — ACTIONS */}
          <div className="flex items-center gap-3 px-5">
            {/* Login */}
            <Link
              href="/login"
              className="
                text-sm font-medium text-slate-300
                transition hover:text-white
              "
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              href="/register"
              className="
                rounded-lg
                bg-white
                px-4 py-2
                text-sm font-semibold text-indigo-600
                shadow
                transition hover:bg-indigo-50
              "
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
