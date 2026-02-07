"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    section: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/customer/dashboard",
        icon: "🏠",
      },
    ],
  },
  {
    section: "BILLING",
    items: [
      {
        label: "Subscription",
        href: "/customer/subscription",
        icon: "💳",
      },
      {
        label: "Plans",
        href: "/customer/plans",
        icon: "📦",
      },
    ],
  },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* =====================
          SIDEBAR
      ===================== */}
      <aside className="w-64 bg-white border-r flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-5 border-b">
          <p className="text-xs font-medium text-gray-500 uppercase">
            My Account
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Customer</p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-6 space-y-6">
          {navItems.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
                {group.section}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm
                        cursor-pointer transition
                        ${
                          isActive
                            ? "bg-gray-100 font-semibold text-gray-900"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="px-3 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm
                       text-red-600 cursor-pointer transition
                       hover:bg-red-50 hover:text-red-700"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================
          CONTENT
      ===================== */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
