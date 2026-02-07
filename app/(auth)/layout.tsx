import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 hover:opacity-80"
        >
          SaaS Platform
        </Link>

        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </header>

      {/* Auth card */}
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SaaS Platform
      </footer>
    </div>
  );
}
