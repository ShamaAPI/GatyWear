import AdminShell from "@/components/admin/AdminShell";
import { shippingGovernorates } from "@/data/adminMock";

export default function AdminShippingPage() {
  return (
    <AdminShell title="Shipping" subtitle="إعدادات المحافظات وأسعار الشحن">
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Governorate</th>
                <th className="pb-2">Fee</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {shippingGovernorates.map((item) => (
                <tr key={item.name} className="border-t border-black/5">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.fee} EGP</td>
                  <td className="py-2">{item.active ? "Active" : "Disabled"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
