import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

const tabs = [
  { key: "pending", label: "جديد" },
  { key: "processing", label: "قيد التجهيز" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التسليم" },
  { key: "canceled", label: "ملغي" },
] as const;

type StatusKey = (typeof tabs)[number]["key"];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: StatusKey }> }) {
  const { status = "pending" } = await searchParams;
  const filtered = await prisma.order.findMany({ where: { status }, orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="الطلبات" subtitle="إدارة ومتابعة جميع الطلبات">
      <section className="rounded-2xl border border-black/10 bg-white p-4"><div className="flex flex-wrap gap-2">{tabs.map((tab) => <Link key={tab.key} href={`/admin/orders?status=${tab.key}`} className={`rounded-lg px-3 py-2 text-sm font-medium ${status === tab.key ? "bg-primary text-white" : "bg-zinc-100 text-primary"}`}>{tab.label}</Link>)}</div></section>
      <section className="rounded-2xl border border-black/10 bg-white p-4"><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">رقم الطلب</th><th className="pb-2">العميل</th><th className="pb-2">الحالة</th><th className="pb-2">الإجمالي</th><th className="pb-2">الإجراء</th></tr></thead><tbody>{filtered.map((order) => <tr key={order.id} className="border-t border-black/5"><td className="py-2 font-medium">#{order.id}</td><td className="py-2">{order.customerName}</td><td className="py-2">{order.status}</td><td className="py-2">{Number(order.total)} جنيه</td><td className="py-2"><Link href={`/admin/orders/${order.id}`} className="text-primary underline">عرض</Link></td></tr>)}</tbody></table></div></section>
    </AdminShell>
  );
}
