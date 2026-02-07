"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: "💳" },
  { label: "Activity", href: "/admin/activity", icon: "🕒" },
  { label: "Revenue", href: "/admin/revenue", icon: "💰" },
];

/*NAV LINKS*/
function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1 px-3 py-6">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded px-4 py-2 transition
              ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/*ADMIN LAYOUT*/
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* MOBILE HEADER */}
      <header className="sm:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between bg-gray-900 px-4 py-3 text-white">
        <span className="font-bold">Admin Panel</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-2xl"
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
            <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
              Admin Panel
            </div>

            <NavLinks
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />

            <button
              onClick={handleLogout}
              className="mx-3 mt-auto mb-3 flex items-center gap-3 rounded px-4 py-2 text-sm
                         text-red-300 hover:bg-red-500/10 hover:text-red-400"
            >
              🚪 Logout
            </button>

            <div className="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">
              Admin • SaaS
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP */}
      <div className="flex min-h-screen">
        <aside className="hidden sm:flex w-64 bg-gray-900 text-white flex-col">
          <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
            Admin Panel
          </div>

          <NavLinks pathname={pathname} />

          <div className="mt-auto px-3 pb-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded px-4 py-2 text-sm
                         text-red-300 hover:bg-red-500/10 hover:text-red-400"
            >
              🚪 Logout
            </button>
          </div>

          <div className="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">
            Admin • SaaS
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8 pt-16 sm:pt-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
