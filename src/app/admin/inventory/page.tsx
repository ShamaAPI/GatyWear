import AdminShell from "@/components/admin/AdminShell";
import { allProducts } from "@/data/homeMock";

export default function AdminInventoryPage() {
  const rows = allProducts.flatMap((product) =>
    product.variants.map((variant) => ({
      productName: product.name,
      sku: `${product.slug}-${variant.color}-${variant.size}`,
      color: variant.color,
      size: variant.size,
      stock: variant.stock,
    })),
  );

  return (
    <AdminShell title="Inventory" subtitle="متابعة كميات المخزون لكل Variant">
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Product</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Color</th>
                <th className="pb-2">Size</th>
                <th className="pb-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.sku} className="border-t border-black/5">
                  <td className="py-2">{row.productName}</td>
                  <td className="py-2 text-xs text-black/60">{row.sku}</td>
                  <td className="py-2">{row.color}</td>
                  <td className="py-2">{row.size}</td>
                  <td className={`py-2 font-semibold ${row.stock <= 4 ? "text-amber-700" : "text-primary"}`}>
                    {row.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
