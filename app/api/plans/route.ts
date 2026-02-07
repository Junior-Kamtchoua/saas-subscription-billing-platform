import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "basic",
      name: "Basic",
      price: 9,
      interval: "month",
      features: ["Access to core features", "Email support", "Single user"],
      active: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      interval: "month",
      features: ["Everything in Basic", "Priority support", "Unlimited users"],
      active: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      interval: "month",
      features: [
        "Custom integrations",
        "Dedicated support",
        "Advanced security",
      ],
      active: true,
    },
  ]);
}
