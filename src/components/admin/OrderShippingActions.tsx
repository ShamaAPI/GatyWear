"use client";

import { useState } from "react";
import type { OrderStatus } from "@/data/adminMock";

export default function OrderShippingActions({ status }: { status: OrderStatus }) {
  const [provider, setProvider] = useState("");
  const [tracking, setTracking] = useState("");
  const [done, setDone] = useState("");

  if (status === "processing") {
    return (
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-primary">Shipping Actions</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            placeholder="Shipping provider"
            className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
          />
          <input
            value={tracking}
            onChange={(event) => setTracking(event.target.value)}
            placeholder="Tracking number"
            className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setDone("تم تحديث الحالة إلى Shipped (Mock)")}
          disabled={!provider || !tracking}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Mark as Shipped
        </button>
        {done ? <p className="mt-2 text-xs text-emerald-700">{done}</p> : null}
      </section>
    );
  }

  if (status === "shipped") {
    return (
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-primary">Shipping Actions</h3>
        <button
          type="button"
          onClick={() => setDone("تم تحديث الحالة إلى Delivered (Mock)")}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Mark as Delivered
        </button>
        {done ? <p className="mt-2 text-xs text-emerald-700">{done}</p> : null}
      </section>
    );
  }

  return null;
}
