import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import OrderShippingActions from "@/components/admin/OrderShippingActions";
import { adminOrders, getOrderTotals } from "@/data/adminMock";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = adminOrders.find((entry) => entry.id === id);

  if (!order) notFound();

  const totals = getOrderTotals(order);

  return (
    <AdminShell title={`Order #${order.id}`} subtitle="تفاصيل الطلب">
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h3 className="text-sm font-semibold text-primary">Customer Info</h3>
          <div className="mt-3 space-y-1 text-sm">
            <p>{order.customerName}</p>
            <p>{order.customerPhone}</p>
            <p>{order.address}</p>
            <p>{order.governorate}</p>
            <p className="font-semibold">Status: {order.status}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h3 className="text-sm font-semibold text-primary">Totals</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{totals.subtotal} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-{order.discount} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shippingFee} EGP</span>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-2 font-bold">
              <span>Total</span>
              <span>{totals.total} EGP</span>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-primary">Products</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Product</th>
                <th className="pb-2">Variant</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.productId}-${index}`} className="border-t border-black/5">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">
                    {item.color} / {item.size}
                  </td>
                  <td className="py-2">{item.qty}</td>
                  <td className="py-2">{item.unitPrice} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h3 className="text-sm font-semibold text-primary">Internal Notes</h3>
          {order.notes.length ? (
            <ul className="mt-3 list-disc space-y-1 ps-5 text-sm">
              {order.notes.map((note, index) => (
                <li key={`${note}-${index}`}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-black/55">No notes</p>
          )}
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h3 className="text-sm font-semibold text-primary">Order Timeline</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {order.timeline.map((entry) => (
              <li key={entry.key + entry.at} className="rounded-lg bg-zinc-100 px-3 py-2">
                <p className="font-medium">{entry.label}</p>
                <p className="text-xs text-black/60">{entry.at}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <OrderShippingActions status={order.status} />
    </AdminShell>
  );
}
