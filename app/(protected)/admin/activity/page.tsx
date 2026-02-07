"use client";

import { useEffect, useState } from "react";

/* =========================
   Types
========================= */
type ActivityType =
  | "USER_REGISTERED"
  | "SUBSCRIPTION_STARTED"
  | "SUBSCRIPTION_CANCELED"
  | "SUBSCRIPTION_CHANGED";

type ActivityRow = {
  email: string;
  type: ActivityType;
  details?: string | null;
  occurred_at: string;
};

/* =========================
   Badge helper (APRÈS imports)
========================= */
function ActivityBadge({ type }: { type: ActivityType }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

  switch (type) {
    case "USER_REGISTERED":
      return (
        <span className={`${base} bg-blue-100 text-blue-800`}>Registered</span>
      );

    case "SUBSCRIPTION_STARTED":
      return (
        <span className={`${base} bg-green-100 text-green-800`}>Subscribe</span>
      );

    case "SUBSCRIPTION_CANCELED":
      return <span className={`${base} bg-red-100 text-red-800`}>Cancel</span>;

    case "SUBSCRIPTION_CHANGED":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800`}>
          Change plan
        </span>
      );

    default:
      return (
        <span className={`${base} bg-gray-100 text-gray-700`}>{type}</span>
      );
  }
}

/* =========================
   Page
========================= */
export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      setLoading(true);

      const res = await fetch(`/api/admin/activity?page=${page}`);
      const data = await res.json();

      if (data.success) {
        setActivities(data.activities ?? []);
        setTotalPages(data.totalPages ?? 1);
      }

      setLoading(false);
    }

    loadActivity();
  }, [page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Activity</h1>
        <p className="mt-1 text-sm text-gray-600">
          Recent events across the platform.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-sm text-gray-500">Loading activity…</p>
      )}

      {/* Empty state */}
      {!loading && activities.length === 0 && (
        <div className="rounded-lg border border-dashed bg-white p-10 text-center">
          <p className="text-lg font-medium">No activity yet</p>
          <p className="mt-2 text-sm text-gray-600">
            User and subscription events will appear here.
          </p>
        </div>
      )}

      {/* Activity list */}
      {!loading && activities.length > 0 && (
        <>
          <div className="space-y-3">
            {activities.map((a, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{a.email}</p>

                  <div className="flex items-center gap-2">
                    <ActivityBadge type={a.type} />

                    {a.details && (
                      <span className="text-sm text-gray-600">{a.details}</span>
                    )}
                  </div>
                </div>

                <span className="text-sm text-gray-500">
                  {new Date(a.occurred_at).toLocaleString()}
                </span>
              </div>
            ))}
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
