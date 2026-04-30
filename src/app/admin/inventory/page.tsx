import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({ include: { product: true }, orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell title="المخزون" subtitle="متابعة الكميات لكل متغير">
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">المنتج</th><th className="pb-2">SKU</th><th className="pb-2">اللون</th><th className="pb-2">المقاس</th><th className="pb-2">المخزون</th></tr></thead><tbody>{variants.map((row) => <tr key={row.id} className="border-t border-black/5"><td className="py-2">{row.product.name}</td><td className="py-2 text-xs text-black/60">{row.sku ?? `${row.product.slug}-${row.color}-${row.size}`}</td><td className="py-2">{row.color}</td><td className="py-2">{row.size}</td><td className={`py-2 font-semibold ${row.stockQty <= 4 ? "text-amber-700" : "text-primary"}`}>{row.stockQty}</td></tr>)}</tbody></table>
        </div>
      </section>
    </AdminShell>
  );
}
