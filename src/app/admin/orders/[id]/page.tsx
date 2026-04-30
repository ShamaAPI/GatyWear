"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import OrderShippingActions from "@/components/admin/OrderShippingActions";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "canceled";

type OrderDetails = {
  id: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  addressText: string;
  subtotal: number;
  discountTotal: number;
  shippingFeeSnapshot: number;
  total: number;
  governorate?: { name: string };
  items: { id: number; productNameSnapshot: string; colorSnapshot: string; sizeSnapshot: string; qty: number; unitPriceSnapshot: number }[];
  internalNotes: { id: number; note: string }[];
  statusLogs: { id: number; toStatus: string; createdAt: string }[];
};

export default function AdminOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("pending");
  const [statusLoading, setStatusLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/orders?id=${params.id}`, { cache: "no-store" });
    const json = await res.json();
    if (json.ok) {
      setOrder(json.data as OrderDetails);
      setNextStatus((json.data as OrderDetails).status);
    }
  }, [params.id]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  if (!order) {
    return <AdminShell title="تفاصيل الطلب" subtitle="تحميل البيانات"><section className="rounded-2xl border border-black/10 bg-white p-4">جاري التحميل...</section></AdminShell>;
  }

  return (
    <AdminShell title={`الطلب #${order.id}`} subtitle="تفاصيل كاملة للطلب">
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="text-sm font-semibold text-primary">بيانات العميل</h3><div className="mt-3 space-y-1 text-sm"><p>{order.customerName}</p><p>{order.customerPhone}</p><p>{order.addressText}</p><p>{order.governorate?.name}</p><p className="font-semibold">الحالة: {order.status}</p></div></article>
        <article className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="text-sm font-semibold text-primary">ملخص الفاتورة</h3><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span>المجموع الفرعي</span><span>{order.subtotal} جنيه</span></div><div className="flex justify-between"><span>الخصم</span><span>-{order.discountTotal} جنيه</span></div><div className="flex justify-between"><span>الشحن</span><span>{order.shippingFeeSnapshot} جنيه</span></div><div className="flex justify-between border-t border-black/10 pt-2 font-bold"><span>الإجمالي</span><span>{order.total} جنيه</span></div></div></article>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="text-sm font-semibold text-primary">المنتجات</h3><div className="mt-3 overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">المنتج</th><th className="pb-2">المتغير</th><th className="pb-2">الكمية</th><th className="pb-2">السعر</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.id} className="border-t border-black/5"><td className="py-2">{item.productNameSnapshot}</td><td className="py-2">{item.colorSnapshot} / {item.sizeSnapshot}</td><td className="py-2">{item.qty}</td><td className="py-2">{item.unitPriceSnapshot} جنيه</td></tr>)}</tbody></table></div></section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="text-sm font-semibold text-primary">ملاحظات داخلية</h3>{order.internalNotes.length ? <ul className="mt-3 list-disc space-y-1 ps-5 text-sm">{order.internalNotes.map((note) => <li key={note.id}>{note.note}</li>)}</ul> : <p className="mt-3 text-sm text-black/55">لا توجد ملاحظات</p>}</article>
        <article className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="text-sm font-semibold text-primary">سجل الحالات</h3><ul className="mt-3 space-y-2 text-sm">{order.statusLogs.map((entry) => <li key={entry.id} className="rounded-lg bg-zinc-100 px-3 py-2"><p className="font-medium">{entry.toStatus}</p><p className="text-xs text-black/60">{new Date(entry.createdAt).toLocaleString("ar-EG")}</p></li>)}</ul></article>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-primary">تحديث حالة الطلب</h3>
        <div className="mt-3 flex gap-2">
          <select className="rounded-lg border border-black/15 px-3 py-2 text-sm" value={nextStatus} onChange={(e) => setNextStatus(e.target.value as OrderStatus)}>
            <option value="pending">جديد</option><option value="processing">قيد التجهيز</option><option value="shipped">تم الشحن</option><option value="delivered">تم التسليم</option><option value="canceled">ملغي</option>
          </select>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50" disabled={statusLoading || nextStatus === order.status} onClick={async () => { setStatusLoading(true); await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: order.id, status: nextStatus }) }); await load(); setStatusLoading(false); }}>
            {statusLoading ? "جاري التحديث..." : "حفظ"}
          </button>
        </div>
      </section>

      <OrderShippingActions orderId={order.id} status={order.status} onUpdated={load} />
    </AdminShell>
  );
}
