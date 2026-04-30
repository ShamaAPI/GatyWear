"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type CouponRow = {
  id: number;
  code: string;
  type: string;
  value: number;
  usedCount: number;
  maxUses: number | null;
  isActive: boolean;
};

export default function AdminCouponsPage() {
  const [rows, setRows] = useState<CouponRow[]>([]);
  const [code, setCode] = useState("");
  const [value, setValue] = useState(0);
  const [type, setType] = useState<"percentage" | "fixed">("percentage");

  async function load() {
    const res = await fetch("/api/admin/coupons");
    const json = await res.json();
    setRows((json.data ?? []) as CouponRow[]);
  }

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, []);

  async function createCoupon() {
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, type, value, isActive: true }),
    });
    setCode("");
    setValue(0);
    await load();
  }

  async function deleteCoupon(id: number) {
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell title="الكوبونات" subtitle="إدارة الكوبونات وحالة الاستخدام">
      <section className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
        <h3 className="text-sm font-semibold">إضافة كوبون</h3>
        <div className="grid gap-2 md:grid-cols-4">
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value)} />
          <select className="rounded-lg border border-black/15 px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value as "percentage" | "fixed")}>
            <option value="percentage">percentage</option>
            <option value="fixed">fixed</option>
          </select>
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" type="number" placeholder="القيمة" value={value || ""} onChange={(e) => setValue(Number(e.target.value))} />
          <button className="rounded-lg bg-primary px-3 py-2 text-sm text-white" onClick={createCoupon}>حفظ</button>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">Code</th><th className="pb-2">النوع</th><th className="pb-2">القيمة</th><th className="pb-2">الاستخدام</th><th className="pb-2">الحالة</th><th className="pb-2">إجراء</th></tr></thead><tbody>{rows.map((coupon) => <tr key={coupon.id} className="border-t border-black/5"><td className="py-2 font-medium">{coupon.code}</td><td className="py-2">{coupon.type}</td><td className="py-2">{Number(coupon.value)}</td><td className="py-2">{coupon.usedCount}/{coupon.maxUses ?? "∞"}</td><td className="py-2">{coupon.isActive ? "نشط" : "معطل"}</td><td className="py-2"><button onClick={() => deleteCoupon(coupon.id)} className="text-red-600">حذف</button></td></tr>)}</tbody></table></div>
      </section>
    </AdminShell>
  );
}
