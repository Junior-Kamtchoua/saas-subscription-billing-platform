"use client";

import { useEffect, useState } from "react";

/* Types */
type Plan = {
  id: string;
  name: string;
  price_cents: number;
  interval: string;
};

type Subscription = {
  plan_name: string;
};

/*Component*/
export default function CustomerPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [plansRes, subRes] = await Promise.all([
          fetch("/api/plans/list"),
          fetch("/api/subscriptions/current", { method: "POST" }),
        ]);

        const plansData = await plansRes.json();
        const subData = await subRes.json();

        if (plansData.success) setPlans(plansData.plans);
        if (subData.success) setSubscription(subData.subscription);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSubscribe(planId: string) {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  }

  async function handleChangePlan(planId: string) {
    await fetch("/api/subscriptions/change-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPlanId: planId }),
    });

    window.location.reload();
  }

  if (loading) {
    return <p className="text-gray-600">Loading plans…</p>;
  }

  return (
    <div className="max-w-6xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Plans</h1>
        <p className="mt-1 text-sm text-gray-600">
          Choose or change your subscription plan
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent =
            subscription && subscription.plan_name === plan.name;

          return (
            <div
              key={plan.id}
              className={`rounded-lg bg-white p-6 shadow space-y-3
                ${plan.name === "Pro" ? "ring-2 ring-blue-500" : "border"}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{plan.name}</p>

                {plan.name === "Pro" && (
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    Recommended
                  </span>
                )}
              </div>

              <p className="text-gray-600">
                ${plan.price_cents / 100} / {plan.interval}
              </p>

              {isCurrent ? (
                <span className="inline-block rounded bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  Current plan
                </span>
              ) : subscription ? (
                <button
                  onClick={() => handleChangePlan(plan.id)}
                  className="rounded bg-blue-600 px-4 py-2 text-white
                             hover:bg-blue-700 transition cursor-pointer"
                >
                  Change plan
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="rounded bg-black px-4 py-2 text-white
                             hover:bg-gray-800 transition cursor-pointer"
                >
                  Subscribe
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
