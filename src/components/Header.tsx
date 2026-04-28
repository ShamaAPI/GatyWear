"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="القائمة"
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-primary"
        >
          القائمة
        </button>
        <div className="text-center">
          <p className="text-xs tracking-[0.2em] text-amber-500">GATY WEAR</p>
          <h1 className="text-base font-semibold text-primary">جاتي وير</h1>
        </div>
        <Link
          href="/cart"
          aria-label="السلة"
          className="relative rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-primary"
        >
          السلة
          {itemCount > 0 ? (
            <span className="absolute -top-2 -left-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
              {itemCount}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
