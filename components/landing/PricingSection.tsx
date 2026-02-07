"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

/**
 * Plan tel qu'il est renvoyé par l'API
 * (aligné avec ta base de données)
 */
type Plan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  active: boolean;
};

export default function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/plans");
        if (!res.ok) throw new Error("Failed to fetch plans");

        const data: Plan[] = await res.json();

        // On n'affiche que les plans actifs
        setPlans(data.filter((plan) => plan.active));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  return (
    <section id="pricing" className="bg-white py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* ===== TITLE ===== */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Choose the plan that fits your needs. Upgrade or cancel anytime.
          </p>
        </div>

        {/* ===== STATES ===== */}
        {loading && (
          <p className="text-center text-slate-500">Loading plans…</p>
        )}

        {error && (
          <p className="text-center text-red-600">
            Unable to load pricing plans.
          </p>
        )}

        {/* ===== PLANS ===== */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="
                  rounded-3xl
                  border border-slate-200
                  bg-white
                  p-10
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {plan.name}
                </h3>

                <p className="mt-4 text-4xl font-extrabold text-slate-900">
                  ${plan.price}
                  <span className="ml-1 text-base font-medium text-slate-500">
                    /{plan.interval}
                  </span>
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-600"
                    >
                      <Check className="h-5 w-5 text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className="
                    mt-10 inline-block w-full
                    rounded-xl
                    bg-indigo-600
                    px-6 py-4
                    text-center
                    font-semibold
                    text-white
                    transition hover:bg-indigo-700
                  "
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
