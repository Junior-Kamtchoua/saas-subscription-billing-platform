"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/authClient";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔒 Bloquer l'accès à /register si déjà connecté
  useEffect(() => {
    const { logged, role } = getAuth();

    if (logged && role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    if (logged && role === "CUSTOMER") {
      router.replace("/customer/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setMessage(data.message || "Registration failed");
      return;
    }

    // 👉 Tu as déjà choisi de rediriger vers /login après register
    router.replace("/login");
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Create account
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-center text-red-600">{message}</p>
      )}
    </div>
  );
}
