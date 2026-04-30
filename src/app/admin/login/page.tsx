"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("يرجى إدخال البريد وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!result.ok) {
        setError(result.message ?? "فشل تسجيل الدخول");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch {
      setError("تعذر تسجيل الدخول الآن");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h1 className="text-center text-xl font-bold text-primary">تسجيل دخول الإدارة</h1>
        <p className="mt-1 text-center text-sm text-black/60">استخدم حساب الأدمن أو الموظف</p>

        <form onSubmit={handleLogin} className="mt-5 space-y-3">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="كلمة المرور"
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "جاري تسجيل الدخول..." : "دخول"}
          </button>
        </form>
      </section>
    </div>
  );
}

