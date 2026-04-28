import AdminShell from "@/components/admin/AdminShell";
import { allProducts } from "@/data/homeMock";

export default function AdminProductsPage() {
  return (
    <AdminShell title="Products" subtitle="نظرة عامة على المنتجات والـ variants">
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Product</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Variants</th>
                <th className="pb-2">Stock Total</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => {
                const stockTotal = product.variants.reduce((sum, item) => sum + item.stock, 0);
                return (
                  <tr key={product.id} className="border-t border-black/5">
                    <td className="py-2 font-medium">{product.name}</td>
                    <td className="py-2">{product.categoryName}</td>
                    <td className="py-2">{product.price} EGP</td>
                    <td className="py-2">{product.variants.length}</td>
                    <td className="py-2">{stockTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
