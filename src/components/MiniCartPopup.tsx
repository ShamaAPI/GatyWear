"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function MiniCartPopup() {
  const { miniCart, closeMiniCart } = useCart();

  if (!miniCart.open) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 rounded-2xl border border-black/10 bg-white p-4 shadow-xl md:left-auto md:w-96">
      <p className="text-sm font-semibold text-primary">تم إضافة المنتج إلى السلة</p>
      <p className="mt-1 text-sm text-black/70">{miniCart.productName}</p>
      <p className="mt-1 text-xs text-black/60">الكمية: {miniCart.quantity}</p>
      <p className="mt-1 text-xs text-black/60">الإجمالي الحالي: {miniCart.subtotal} EGP</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/checkout" className="rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-white">
          إتمام الشراء
        </Link>
        <button
          type="button"
          onClick={closeMiniCart}
          className="rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary"
        >
          متابعة التسوق
        </button>
      </div>
    </div>
  );
}
