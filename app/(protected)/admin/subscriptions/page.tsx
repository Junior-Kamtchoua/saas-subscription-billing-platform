"use client";

import { useEffect, useState } from "react";

type SubscriptionRow = {
  id: string;
  email: string;
  plan_name: string;
  price_cents: number;
  interval: string;
  status: "ACTIVE" | "CANCELED" | "EXPIRED";
  started_at: string;
  ended_at: string | null;
};

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔍 Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // 📡 Fetch subscriptions
  useEffect(() => {
    async function loadSubs() {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        q: debouncedSearch,
      });

      const res = await fetch(`/api/admin/subscriptions?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setSubs(data.subscriptions ?? []);
        setTotalPages(data.totalPages ?? 1);
      }

      setLoading(false);
    }

    loadSubs();
  }, [page, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and monitor all user subscriptions.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by user email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-sm text-gray-500">
          Loading subscriptions…
        </p>
      )}

      {/* Empty state */}
      {!loading && subs.length === 0 && (
        <div className="rounded-lg border border-dashed bg-white p-10 text-center">
          <p className="text-lg font-medium">No subscriptions found</p>
          <p className="mt-2 text-sm text-gray-600">
            {debouncedSearch
              ? `No subscriptions match “${debouncedSearch}”.`
              : "There are no subscriptions yet."}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && subs.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Started</th>
                  <th className="px-4 py-3">Ended</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">{s.plan_name}</td>
                    <td className="px-4 py-3">
                      ${(s.price_cents / 100).toFixed(2)} / {s.interval}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          s.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : s.status === "CANCELED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(s.started_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.ended_at
                        ? new Date(s.ended_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border px-4 py-2 text-sm font-medium
                         cursor-pointer transition hover:bg-gray-100
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border px-4 py-2 text-sm font-medium
                         cursor-pointer transition hover:bg-gray-100
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
