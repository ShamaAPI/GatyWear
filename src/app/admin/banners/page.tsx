import AdminShell from "@/components/admin/AdminShell";
import { homeBannersAdmin } from "@/data/adminMock";

export default function AdminBannersPage() {
  return (
    <AdminShell title="Banners" subtitle="إدارة بنرات الصفحة الرئيسية">
      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">Title</th>
                <th className="pb-2">Target</th>
                <th className="pb-2">Sort</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {homeBannersAdmin.map((banner) => (
                <tr key={banner.id} className="border-t border-black/5">
                  <td className="py-2">{banner.title}</td>
                  <td className="py-2">{banner.target}</td>
                  <td className="py-2">{banner.order}</td>
                  <td className="py-2">{banner.active ? "Active" : "Hidden"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
