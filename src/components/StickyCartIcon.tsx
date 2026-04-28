"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function StickyCartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="السلة"
      className="fixed bottom-24 left-4 z-40 rounded-full bg-primary p-4 text-white shadow-lg md:hidden"
    >
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
        {itemCount}
      </span>
      <span className="text-lg">🛒</span>
    </Link>
  );
}
