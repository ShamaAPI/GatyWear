"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type ShippingRow = {
  id: number;
  name: string;
  fee: number;
  isActive: boolean;
};

export default function AdminShippingPage() {
  const [rows, setRows] = useState<ShippingRow[]>([]);
  const [name, setName] = useState("");
  const [fee, setFee] = useState(0);

  async function load() {
    const res = await fetch("/api/admin/shipping");
    const json = await res.json();
    setRows((json.data ?? []) as ShippingRow[]);
  }

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, []);

  async function createGovernorate() {
    await fetch("/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, fee, isActive: true }),
    });
    setName("");
    setFee(0);
    await load();
  }

  async function deleteRow(id: number) {
    await fetch(`/api/admin/shipping?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell title="الشحن" subtitle="إعدادات المحافظات وأسعار الشحن">
      <section className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
        <h3 className="text-sm font-semibold">إضافة محافظة</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" type="number" placeholder="رسوم الشحن" value={fee || ""} onChange={(e) => setFee(Number(e.target.value))} />
          <button className="rounded-lg bg-primary px-3 py-2 text-sm text-white" onClick={createGovernorate}>حفظ</button>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">المحافظة</th><th className="pb-2">رسوم الشحن</th><th className="pb-2">الحالة</th><th className="pb-2">إجراء</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-black/5"><td className="py-2">{item.name}</td><td className="py-2">{item.fee} جنيه</td><td className="py-2">{item.isActive ? "نشطة" : "معطلة"}</td><td className="py-2"><button onClick={() => deleteRow(item.id)} className="text-red-600">حذف</button></td></tr>)}</tbody></table></div>
      </section>
    </AdminShell>
  );
}
