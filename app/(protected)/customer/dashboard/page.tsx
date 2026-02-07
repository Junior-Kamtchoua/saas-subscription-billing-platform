"use client";

import { useEffect, useState } from "react";

/* ======================
   Types
====================== */

type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE";

type Subscription = {
  subscription_id: string;
  status: SubscriptionStatus;
  started_at: string;
  ended_at: string | null;
  plan_name: string;
  price_cents: number;
  interval: string;
};

/* ======================
   Component
====================== */

export default function CustomerDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/subscriptions/current", {
          method: "POST",
        });
        const data = await res.json();

        if (data.success) setSubscription(data.subscription);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading dashboard…</p>;
  }

  const price = subscription
    ? `$${(subscription.price_cents / 100).toFixed(2)}`
    : "$0.00";

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your subscription
        </p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Kpi title="Current Plan" value={subscription?.plan_name ?? "None"} />
        <Kpi title="Status" value={subscription?.status ?? "—"} />
        <Kpi title="Monthly Price" value={price} />
      </section>

      {/* CURRENT SUBSCRIPTION */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">My Subscription</h2>

        {subscription ? (
          <div className="rounded-lg bg-white p-6 shadow space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{subscription.plan_name}</p>

              <StatusBadge status={subscription.status} />
            </div>

            <p className="text-gray-600">
              {price} / {subscription.interval}
            </p>

            <p className="text-sm text-gray-500">
              Started on{" "}
              {new Date(subscription.started_at).toLocaleDateString()}
            </p>

            <div className="flex gap-3 pt-2">
              <a
                href="/customer/plans"
                className="rounded bg-blue-600 px-4 py-2 text-white
                           hover:bg-blue-700 transition cursor-pointer"
              >
                Change plan
              </a>

              <a
                href="/api/stripe/portal"
                className="rounded border px-4 py-2 text-sm font-medium
                           hover:bg-gray-100 transition cursor-pointer"
              >
                Manage billing
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center">
            <p className="font-medium">No active subscription</p>
            <p className="mt-1 text-sm text-gray-600">
              Go to Plans to subscribe.
            </p>

            <a
              href="/customer/plans"
              className="mt-3 inline-block rounded bg-black px-4 py-2 text-white
                         hover:bg-gray-800 transition cursor-pointer"
            >
              View plans
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

/* ======================
   UI
====================== */

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const styles =
    status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : status === "PAST_DUE"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <span className={`rounded px-3 py-1 text-sm font-medium ${styles}`}>
      {status}
    </span>
  );
}
