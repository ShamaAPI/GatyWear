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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white md:hidden">
      <div className="mx-auto grid w-full max-w-md grid-cols-4 px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-md px-2 py-2 text-center text-xs font-medium ${
                isActive ? "text-primary" : "text-black/55"
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
