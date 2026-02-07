import { BarChart3, User, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Title */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Everything you need to run your SaaS
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Manage subscriptions, customers, and revenue with a secure and
            production-ready platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Card */}
          <div
            className="
              group rounded-2xl border border-slate-200
              bg-white p-10
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <BarChart3 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">For Admins</h3>

            <p className="mt-4 text-slate-600">
              Create and manage plans, monitor subscriptions, and track MRR
              through a powerful admin dashboard.
            </p>
          </div>

          {/* Card */}
          <div
            className="
              group rounded-2xl border border-slate-200
              bg-white p-10
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <User className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              For Customers
            </h3>

            <p className="mt-4 text-slate-600">
              Subscribe, manage plans, and access billing details with a smooth
              and intuitive customer experience.
            </p>
          </div>

          {/* Card */}
          <div
            className="
              group rounded-2xl border border-slate-200
              bg-white p-10
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Secure & Reliable
            </h3>

            <p className="mt-4 text-slate-600">
              Built with JWT authentication, refresh tokens, and secure cookies
              to meet production security standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
