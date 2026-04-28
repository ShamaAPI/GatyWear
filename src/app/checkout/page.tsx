"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import { governorates } from "@/data/checkoutMock";

function isValidEgyptPhone(phone: string) {
  return /^01\d{9}$/.test(phone);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shippingFee = useMemo(() => {
    const selected = governorates.find((item) => item.id === Number(governorateId));
    return selected?.fee ?? 0;
  }, [governorateId]);

  const subtotalAfterDiscount = subtotal - discount;
  const total = subtotalAfterDiscount + shippingFee;

  async function handleConfirmOrder() {
    setError("");

    if (!name.trim() || !address.trim() || !governorateId) {
      setError("يرجى استكمال بيانات الطلب");
      return;
    }
    if (!isValidEgyptPhone(phone)) {
      setError("رقم الهاتف غير صحيح");
      return;
    }
    if (items.length === 0) {
      setError("السلة فارغة");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const orderNumber = `GW-${Date.now().toString().slice(-8)}`;
    clearCart();
    router.push(`/order/success/${orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <div className="space-y-5 px-4 py-5">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الدفع" }]} />
        <section className="rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center">
          <p className="text-sm text-black/70">السلة فارغة</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            العودة للتسوق
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "إتمام الطلب" }]} />
      <h1 className="text-xl font-bold text-primary">إتمام الطلب</h1>

      <section className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="الاسم"
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
        />
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="رقم الهاتف"
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
        />
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="العنوان"
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
        />
        <select
          value={governorateId}
          onChange={(event) => setGovernorateId(event.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
        >
          <option value="">اختر المحافظة</option>
          {governorates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="ملاحظات اختيارية"
          className="min-h-20 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
        />
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
          <div className="flex justify-between">
            <span>Subtotal After Discount</span>
            <span>{subtotalAfterDiscount} EGP</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingFee} EGP</span>
          </div>
          <div className="flex justify-between border-t border-black/10 pt-2 font-bold text-primary">
            <span>Total</span>
            <span>{total} EGP</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <p className="text-sm text-black/70">طريقة الدفع</p>
        <p className="mt-1 text-sm font-semibold text-primary">الدفع عند الاستلام (Cash on Delivery)</p>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleConfirmOrder}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}
      </button>
    </div>
  );
}
