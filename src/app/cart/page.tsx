"use client";

import Link from "next/link";
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SmartImage from "@/components/SmartImage";
import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/homeMock";

export default function CartPage() {
  const { items, subtotal, discount, appliedCoupon, updateQuantity, removeItem, applyCoupon, clearCoupon } =
    useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const cartItems = items
    .map((item) => {
      const product = allProducts.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter(Boolean) as { item: (typeof items)[number]; product: (typeof allProducts)[number] }[];

  async function handleApplyCoupon() {
    setCouponLoading(true);
    setCouponError("");
    const result = await applyCoupon(couponCode);
    if (!result.ok) setCouponError(result.message ?? "كود غير صحيح");
    setCouponLoading(false);
  }

  const total = subtotal - discount;

  return (
    <div className="space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "السلة" }]} />

      <h1 className="text-xl font-bold text-primary">سلة المشتريات</h1>

      {cartItems.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center">
          <p className="text-sm text-black/70">السلة فارغة</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            ابدأ التسوق
          </Link>
        </section>
      ) : (
        <>
          <section className="space-y-3">
            {cartItems.map(({ item, product }) => (
              <article key={item.productId} className="rounded-2xl border border-black/10 bg-white p-3">
                <div className="flex gap-3">
                  <div className="h-20 w-16 overflow-hidden rounded-lg bg-zinc-100">
                    <SmartImage
                      src={product.image}
                      fallbackSrc={product.imageFallback}
                      alt={product.name}
                      width={160}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h2 className="text-sm font-semibold text-primary">{product.name}</h2>
                    <p className="text-xs text-black/60">
                      {item.color} / {item.size}
                    </p>
                    <p className="text-sm font-bold text-primary">{product.price} EGP</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-7 w-7 rounded-md border border-black/15 text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-7 w-7 rounded-md border border-black/15 text-sm"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ms-auto text-xs font-medium text-red-600"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-primary">كوبون الخصم</p>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="أدخل الكوبون"
                className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                disabled={couponLoading}
                onClick={handleApplyCoupon}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {couponLoading ? "جاري التطبيق..." : "تطبيق"}
              </button>
            </div>
            {couponError ? <p className="mt-2 text-xs text-red-600">{couponError}</p> : null}
            {appliedCoupon ? (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <span>تم تطبيق: {appliedCoupon.code}</span>
                <button type="button" onClick={clearCoupon} className="font-semibold">
                  إزالة
                </button>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{discount} EGP</span>
              </div>
              <div className="flex justify-between border-t border-black/10 pt-2 font-bold text-primary">
                <span>Total</span>
                <span>{total} EGP</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-4 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
            >
              المتابعة للدفع
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
