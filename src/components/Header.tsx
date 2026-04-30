"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-background/95 px-5 py-4 backdrop-blur">
      <div className="gw-container flex items-center justify-between px-0">
        <button
          type="button"
          aria-label="القائمة"
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-primary"
        >
          القائمة
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent">GATY WEAR</p>
          <h1 className="text-base font-extrabold text-primary">جاتي وير</h1>
        </div>
        <Link
          href="/cart"
          aria-label="السلة"
          className="relative rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-primary"
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
