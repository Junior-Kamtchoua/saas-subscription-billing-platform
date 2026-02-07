"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import DemoModal from "../ui/DemoModal";

export default function HeroSection() {
  const [openDemo, setOpenDemo] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#1f2a44] to-[#2b1f47]">
      {/* ===== BACKGROUND BLOBS ===== */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 h-[700px] w-[700px] rounded-full bg-[#3b82f6]/20 blur-[160px]" />
      <div className="pointer-events-none absolute top-0 -right-1/4 h-[600px] w-[600px] rounded-full bg-[#6366f1]/20 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-1/3 left-1/4 h-[800px] w-[800px] rounded-full bg-[#8b5cf6]/15 blur-[180px]" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-40 animate-fade-in">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          {/* LEFT — TEXT */}
          <div>
            <h1 className="text-6xl font-extrabold leading-tight text-white">
              Manage your SaaS
              <span className="block text-slate-300">
                subscriptions effortlessly
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-200">
              A production-ready subscription management platform with secure
              authentication, admin analytics, and a seamless customer
              experience.
            </p>

            {/* CTA */}
            <div className="mt-12 flex items-center gap-6">
              {/* Get Started → REGISTER (REAL ROUTE) */}
              <Link
                href="/register"
                className="rounded-xl bg-white px-8 py-4 font-semibold text-indigo-600 shadow-lg transition-transform hover:scale-105"
              >
                Get Started
              </Link>

              {/* Watch Demo */}
              <button
                type="button"
                onClick={() => setOpenDemo(true)}
                className="
                  group inline-flex items-center gap-3
                  rounded-full
                  border border-white/25
                  bg-white/5
                  px-6 py-3
                  text-slate-200
                  backdrop-blur-md
                  transition-all duration-200
                  hover:border-white/50
                  hover:bg-white/10
                  hover:text-white
                  cursor-pointer
                "
              >
                <span
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-full
                    bg-white/20
                    text-white
                    transition
                    group-hover:bg-white/30
                  "
                >
                  <Play className="h-4 w-4 fill-white" />
                </span>

                <span className="font-medium">Watch Demo</span>
              </button>
            </div>
          </div>

          {/* RIGHT — MOCKUP */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
              <Image
                src="/mockups/01-dashboard.png"
                alt="Admin and User Dashboard preview"
                width={900}
                height={600}
                priority
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM WAVE ===== */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 120"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,80 C240,120 480,0 720,20 960,40 1200,120 1440,80 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* ===== DEMO MODAL ===== */}
      <DemoModal open={openDemo} onClose={() => setOpenDemo(false)} />
    </section>
  );
}
