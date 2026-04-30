"use client";

import Link from "next/link";
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SmartImage from "@/components/SmartImage";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    subtotal,
    discount,
    appliedCoupon,
    updateQuantity,
    removeItem,
    applyCoupon,
    clearCoupon,
    isCartLoading,
    cartError,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  async function handleApplyCoupon() {
    setCouponLoading(true);
    setCouponError("");
    const result = await applyCoupon(couponCode);
    if (!result.ok) setCouponError(result.message ?? "كود غير صحيح");
    setCouponLoading(false);
  }

  async function handleUpdateQuantity(itemId: number, quantity: number) {
    setActionError("");
    const result = await updateQuantity(itemId, quantity);
    if (!result.ok) setActionError(result.message ?? "تعذر تحديث السلة");
  }

  async function handleRemoveItem(itemId: number) {
    setActionError("");
    const result = await removeItem(itemId);
    if (!result.ok) setActionError(result.message ?? "تعذر حذف المنتج");
  }

  const total = subtotal - discount;

  return (
    <div className="space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "السلة" }]} />

      <h1 className="text-xl font-bold text-primary">سلة المشتريات</h1>

      {isCartLoading ? (
        <section className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-black/60">
          جاري تحميل السلة...
        </section>
      ) : items.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center">
          <p className="text-sm text-black/70">السلة فارغة</p>
          <Link href="/" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">ابدأ التسوق</Link>
        </section>
      ) : (
        <>
          <section className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-black/10 bg-white p-3">
                <div className="flex gap-3">
                  <div className="h-20 w-16 overflow-hidden rounded-lg bg-zinc-100">
                    <SmartImage src={item.product.image} fallbackSrc={item.product.imageFallback} alt={item.product.name} width={160} height={200} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h2 className="text-sm font-semibold text-primary">{item.product.name}</h2>
                    <p className="text-xs text-black/60">{item.variant.color} / {item.variant.size}</p>
                    <p className="text-sm font-bold text-primary">{item.unitPrice} جنيه</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded-md border border-black/15 text-sm">-</button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button type="button" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded-md border border-black/15 text-sm">+</button>
                      <button type="button" onClick={() => handleRemoveItem(item.id)} className="ms-auto text-xs font-medium text-red-600">حذف</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-primary">كوبون الخصم</p>
            <div className="flex gap-2">
              <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="أدخل الكوبون" className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" />
              <button type="button" disabled={couponLoading} onClick={handleApplyCoupon} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">{couponLoading ? "جاري التطبيق..." : "تطبيق"}</button>
            </div>
            {couponError ? <p className="mt-2 text-xs text-red-600">{couponError}</p> : null}
            {appliedCoupon ? <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700"><span>تم تطبيق: {appliedCoupon.code}</span><button type="button" onClick={clearCoupon} className="font-semibold">إزالة</button></div> : null}
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>المجموع الفرعي</span><span>{subtotal} جنيه</span></div>
              <div className="flex justify-between"><span>الخصم</span><span>-{discount} جنيه</span></div>
              <div className="flex justify-between border-t border-black/10 pt-2 font-bold text-primary"><span>الإجمالي</span><span>{total} جنيه</span></div>
            </div>
            <Link href="/checkout" className="mt-4 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white">المتابعة للدفع</Link>
          </section>
        </>
      )}

      {cartError ? <p className="text-sm text-red-600">{cartError}</p> : null}
      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
    </div>
  );
}
