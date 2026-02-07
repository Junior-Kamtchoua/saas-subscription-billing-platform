import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0b1220] via-[#121a2f] to-[#1b2550]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="SaaS Subscription Billing Platform"
            width={36}
            height={36}
          />
          <span className="text-lg font-semibold text-white tracking-tight">
            SaaS Platform
          </span>
        </Link>

        <Link
          href="/"
          className="text-sm text-gray-300 hover:text-white transition"
        >
          ← Back to home
        </Link>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SaaS Subscription Billing Platform
      </footer>
    </div>
  );
}
