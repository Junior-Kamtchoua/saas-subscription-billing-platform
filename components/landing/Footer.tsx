import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* LEFT — BRAND */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="text-lg">⬢</span>
            SaaS Platform
          </div>

          {/* CENTER — LINKS */}
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/login" className="hover:text-slate-900">
              Login
            </Link>
            <Link href="/register" className="hover:text-slate-900">
              Sign Up
            </Link>
            <a href="#pricing" className="hover:text-slate-900">
              Pricing
            </a>
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
          </nav>

          {/* RIGHT — COPYRIGHT */}
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} SaaS Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
