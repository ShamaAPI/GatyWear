import AdminShell from "@/components/admin/AdminShell";
import {
  getAovDelivered,
  getBestSellers,
  getDeliveredSales,
  getLowStockItems,
  getOrdersByStatus,
} from "@/data/adminMock";

export default function AdminDashboardPage() {
  const deliveredSales = getDeliveredSales();
  const aov = getAovDelivered();
  const ordersByStatus = getOrdersByStatus();
  const bestSellers = getBestSellers();
  const lowStock = getLowStockItems();

  return (
    <AdminShell title="Dashboard" subtitle="نظرة عامة على الأداء التشغيلي">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-xs text-black/60">Delivered Sales</p>
          <p className="mt-1 text-lg font-bold text-primary">{deliveredSales} EGP</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-xs text-black/60">AOV</p>
          <p className="mt-1 text-lg font-bold text-primary">{aov} EGP</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-xs text-black/60">Orders Delivered</p>
          <p className="mt-1 text-lg font-bold text-primary">{ordersByStatus.delivered}</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-xs text-black/60">Orders Pending</p>
          <p className="mt-1 text-lg font-bold text-primary">{ordersByStatus.pending}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold text-primary">Orders by Status</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <p className="rounded-lg bg-zinc-100 px-3 py-2">Pending: {ordersByStatus.pending}</p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2">Processing: {ordersByStatus.processing}</p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2">Shipped: {ordersByStatus.shipped}</p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2">Canceled: {ordersByStatus.canceled}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold text-primary">Best Sellers</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {bestSellers.map((item) => (
              <li key={item.name} className="flex justify-between rounded-lg bg-zinc-100 px-3 py-2">
                <span>{item.name}</span>
                <span className="font-semibold">{item.qty}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h2 className="text-sm font-semibold text-primary">Low Stock</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Product</th>
                <th className="pb-2">Color</th>
                <th className="pb-2">Size</th>
                <th className="pb-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((item) => (
                <tr key={`${item.productName}-${item.color}-${item.size}`} className="border-t border-black/5">
                  <td className="py-2">{item.productName}</td>
                  <td className="py-2">{item.color}</td>
                  <td className="py-2">{item.size}</td>
                  <td className="py-2 font-semibold text-amber-700">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
