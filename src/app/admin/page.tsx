import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const deliveredAgg = await prisma.order.aggregate({ where: { status: "delivered" }, _sum: { total: true }, _count: { id: true } });
  const ordersByStatusRows = await prisma.order.groupBy({ by: ["status"], _count: { id: true } });
  const lowStock = await prisma.productVariant.findMany({ where: { stockQty: { lte: 5 }, isActive: true }, include: { product: true }, orderBy: { stockQty: "asc" }, take: 10 });
  const bestSellers = await prisma.orderItem.groupBy({ by: ["productId", "productNameSnapshot"], _sum: { qty: true }, orderBy: { _sum: { qty: "desc" } }, take: 5 });

  const ordersByStatus = { pending: 0, processing: 0, shipped: 0, delivered: 0, canceled: 0 };
  for (const row of ordersByStatusRows) ordersByStatus[row.status] = row._count.id;

  const deliveredSales = Number(deliveredAgg._sum.total ?? 0);
  const deliveredCount = deliveredAgg._count.id;
  const aov = deliveredCount ? Math.round(deliveredSales / deliveredCount) : 0;

  return (
    <AdminShell title="لوحة التحكم" subtitle="ملخص الأداء والمبيعات">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-black/10 bg-white p-4"><p className="text-xs text-black/60">مبيعات الطلبات المسلّمة</p><p className="mt-1 text-lg font-bold text-primary">{deliveredSales} جنيه</p></article>
        <article className="rounded-2xl border border-black/10 bg-white p-4"><p className="text-xs text-black/60">متوسط قيمة الطلب</p><p className="mt-1 text-lg font-bold text-primary">{aov} جنيه</p></article>
        <article className="rounded-2xl border border-black/10 bg-white p-4"><p className="text-xs text-black/60">طلبات مكتملة</p><p className="mt-1 text-lg font-bold text-primary">{ordersByStatus.delivered}</p></article>
        <article className="rounded-2xl border border-black/10 bg-white p-4"><p className="text-xs text-black/60">طلبات جديدة</p><p className="mt-1 text-lg font-bold text-primary">{ordersByStatus.pending}</p></article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold text-primary">حالات الطلبات</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <p className="rounded-lg bg-zinc-100 px-3 py-2">جديد: {ordersByStatus.pending}</p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2">قيد التجهيز: {ordersByStatus.processing}</p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2">تم الشحن: {ordersByStatus.shipped}</p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2">ملغي: {ordersByStatus.canceled}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold text-primary">الأكثر مبيعًا</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {bestSellers.map((item) => (
              <li key={`${item.productId}-${item.productNameSnapshot}`} className="flex justify-between rounded-lg bg-zinc-100 px-3 py-2"><span>{item.productNameSnapshot}</span><span className="font-semibold">{item._sum.qty ?? 0}</span></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h2 className="text-sm font-semibold text-primary">تنبيهات المخزون المنخفض</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">المنتج</th><th className="pb-2">اللون</th><th className="pb-2">المقاس</th><th className="pb-2">المتبقي</th></tr></thead><tbody>{lowStock.map((item) => <tr key={item.id} className="border-t border-black/5"><td className="py-2">{item.product.name}</td><td className="py-2">{item.color}</td><td className="py-2">{item.size}</td><td className="py-2 font-semibold text-amber-700">{item.stockQty}</td></tr>)}</tbody></table>
        </div>
      </section>
    </AdminShell>
  );
}
