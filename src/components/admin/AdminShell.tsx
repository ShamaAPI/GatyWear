import Link from "next/link";

const links = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/categories", label: "الفئات" },
  { href: "/admin/inventory", label: "المخزون" },
  { href: "/admin/coupons", label: "الكوبونات" },
  { href: "/admin/shipping", label: "الشحن" },
  { href: "/admin/banners", label: "البنرات" },
  { href: "/admin/integrations", label: "Integrations" },
];

export default function AdminShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 bg-[#f8f8f8] px-4 py-5 md:grid-cols-[250px_1fr] md:gap-6">
      <aside className="rounded-xl border border-black/10 bg-white p-4 md:sticky md:top-24 md:h-fit">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-accent">الإدارة</p>
        <nav className="grid gap-1">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2.5 text-sm font-bold text-black/80 hover:bg-zinc-100 hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="space-y-4">
        <header className="rounded-xl border border-black/10 bg-white p-5">
          <h1 className="text-2xl font-extrabold text-primary">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-black/60">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
