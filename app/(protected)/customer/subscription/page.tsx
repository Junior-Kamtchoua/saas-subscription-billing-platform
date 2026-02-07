"use client";

import { useEffect, useState } from "react";

/* ======================
   Types
====================== */

type Subscription = {
  id: string;
  status: "ACTIVE" | "CANCELED";
  started_at: string;
  ended_at: string | null;
  plan_name: string;
  price_cents: number;
  interval: string;
};

/* ======================
   Component
====================== */

export default function CustomerSubscriptionPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/subscriptions/history", {
          method: "POST",
        });
        const data = await res.json();

        if (data.success) {
          setSubs(data.subscriptions);
        }
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  async function handleCancel() {
    await fetch("/api/subscriptions/cancel", { method: "POST" });
    window.location.reload();
  }

  if (loading) {
    return <p className="text-gray-600">Loading subscriptions…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold">My Subscription</h1>
        <p className="mt-1 text-sm text-gray-600">
          Subscription history and status
        </p>
      </header>

      {subs.length === 0 && (
        <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center">
          <p className="font-medium">No subscriptions yet</p>
        </div>
      )}

      <div className="space-y-4">
        {subs.map((s) => (
          <div key={s.id} className="rounded-lg bg-white p-6 shadow space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{s.plan_name}</p>

              <span
                className={`rounded px-3 py-1 text-sm font-medium
                  ${
                    s.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {s.status}
              </span>
            </div>

            <p className="text-gray-600">
              ${(s.price_cents / 100).toFixed(2)} / {s.interval}
            </p>

            <p className="text-sm text-gray-500">
              Started: {new Date(s.started_at).toLocaleDateString()}
              {s.ended_at && (
                <> • Ended: {new Date(s.ended_at).toLocaleDateString()}</>
              )}
            </p>

            {s.status === "ACTIVE" && (
              <button
                onClick={handleCancel}
                className="mt-2 rounded border border-red-300 px-4 py-2 text-red-600
                           hover:bg-red-50 transition cursor-pointer"
              >
                Cancel subscription
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
