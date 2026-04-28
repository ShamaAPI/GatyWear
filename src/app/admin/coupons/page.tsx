import AdminShell from "@/components/admin/AdminShell";
import { adminCoupons } from "@/data/adminMock";

export default function AdminCouponsPage() {
  return (
    <AdminShell title="Coupons" subtitle="إدارة الكوبونات وحالة الاستخدام">
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Code</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Value</th>
                <th className="pb-2">Used</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminCoupons.map((coupon) => (
                <tr key={coupon.code} className="border-t border-black/5">
                  <td className="py-2 font-medium">{coupon.code}</td>
                  <td className="py-2">{coupon.type}</td>
                  <td className="py-2">{coupon.value}</td>
                  <td className="py-2">
                    {coupon.used}/{coupon.max}
                  </td>
                  <td className="py-2">{coupon.active ? "Active" : "Disabled"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
