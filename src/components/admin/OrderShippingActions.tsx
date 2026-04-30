"use client";

import { useState } from "react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "canceled";

export default function OrderShippingActions({ orderId, status, onUpdated }: { orderId: number; status: OrderStatus; onUpdated?: () => void }) {
  const [provider, setProvider] = useState("");
  const [tracking, setTracking] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  async function updateOrder(nextStatus: OrderStatus) {
    setLoading(true);
    setDone("");
    const response = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: orderId, status: nextStatus, shippingCompany: provider || undefined, trackingNumber: tracking || undefined }) });
    const result = await response.json();
    if (!result.ok) { setDone(result.message ?? "فشل التحديث"); setLoading(false); return; }
    setDone(nextStatus === "shipped" ? "تم تحديث الحالة إلى تم الشحن" : "تم تحديث الحالة إلى تم التسليم");
    onUpdated?.();
    setLoading(false);
  }

  if (status === "processing") {
    return (
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-primary">إجراءات الشحن</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input value={provider} onChange={(event) => setProvider(event.target.value)} placeholder="شركة الشحن" className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" />
          <input value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="رقم التتبع" className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" />
        </div>
        <button type="button" onClick={() => updateOrder("shipped")} disabled={!provider || !tracking || loading} className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "جاري التحديث..." : "تأكيد الشحن"}
        </button>
        {done ? <p className="mt-2 text-xs text-emerald-700">{done}</p> : null}
      </section>
    );
  }

  if (status === "shipped") {
    return (
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-primary">إجراءات الشحن</h3>
        <button type="button" onClick={() => updateOrder("delivered")} disabled={loading} className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          {loading ? "جاري التحديث..." : "تأكيد التسليم"}
        </button>
        {done ? <p className="mt-2 text-xs text-emerald-700">{done}</p> : null}
      </section>
    );
  }

  return null;
}
