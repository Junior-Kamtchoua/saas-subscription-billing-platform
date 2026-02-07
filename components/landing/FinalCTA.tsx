import Link from "next/link";
import { Play } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="
            mx-auto max-w-4xl
            rounded-3xl
            border border-slate-200
            bg-white
            px-12 py-16
            text-center
            shadow-sm
          "
        >
          <h2 className="text-3xl font-extrabold text-slate-900">
            Ready to simplify your SaaS management?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Take full control of subscriptions, customers, and revenue with a
            secure, production-ready platform built for scale.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Primary */}
            <Link
              href="/register"
              className="
                rounded-xl
                bg-indigo-600
                px-8 py-4
                text-base font-semibold text-white
                shadow
                transition hover:bg-indigo-700
              "
            >
              Get Started
            </Link>

            {/* Secondary */}
            <button
              type="button"
              className="
                group inline-flex items-center gap-3
                rounded-xl
                border border-slate-300
                bg-white
                px-6 py-4
                text-slate-700
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <span
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-full
                  bg-slate-200
                  transition
                  group-hover:bg-slate-300
                "
              >
                <Play className="h-4 w-4 fill-slate-700" />
              </span>

              <span className="font-medium">Watch Demo</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
