"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "التصنيفات", href: "/category/tshirts" },
  { label: "السلة", href: "/cart" },
  { label: "الدفع", href: "/checkout" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid w-full max-w-md grid-cols-4 gap-1 px-3 py-2.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-lg px-2 py-2 text-center text-xs font-bold ${
                isActive ? "bg-primary text-white" : "text-black/60"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
