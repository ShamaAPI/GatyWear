import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { adminOrders, getOrderTotals, type OrderStatus } from "@/data/adminMock";

const tabs: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "canceled", label: "Canceled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: OrderStatus }>;
}) {
  const { status = "pending" } = await searchParams;
  const filtered = adminOrders.filter((order) => order.status === status);

  return (
    <AdminShell title="Orders" subtitle="إدارة ومتابعة الطلبات">
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/admin/orders?status=${tab.key}`}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                status === tab.key ? "bg-primary text-white" : "bg-zinc-100 text-primary"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Order</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const totals = getOrderTotals(order);
                return (
                  <tr key={order.id} className="border-t border-black/5">
                    <td className="py-2 font-medium">#{order.id}</td>
                    <td className="py-2">{order.customerName}</td>
                    <td className="py-2">{order.status}</td>
                    <td className="py-2">{totals.total} EGP</td>
                    <td className="py-2">
                      <Link href={`/admin/orders/${order.id}`} className="text-primary underline">
                        View
                      </Link>
                    </td>
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
