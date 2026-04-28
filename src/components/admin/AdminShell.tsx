import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/shipping", label: "Shipping" },
  { href: "/admin/banners", label: "Banners" },
];

export default function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:gap-6">
      <aside className="rounded-2xl border border-black/10 bg-white p-4 md:sticky md:top-24 md:h-fit">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-amber-600">ADMIN</p>
        <nav className="grid gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-black/75 hover:bg-zinc-100 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="space-y-4">
        <header className="rounded-2xl border border-black/10 bg-white p-4">
          <h1 className="text-xl font-bold text-primary">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-black/60">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
