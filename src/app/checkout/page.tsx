"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import { trackGa, trackMeta } from "@/lib/analytics";

type Governorate = { id: number; name: string; fee: number };

function isValidEgyptPhone(phone: string) {
  return /^01\d{9}$/.test(phone);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart, isCartLoading, appliedCoupon } = useCart();
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGovs, setIsLoadingGovs] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch("/api/checkout", { cache: "no-store" });
          const json = await response.json();
          if (json.ok) setGovernorates(json.data ?? []);
        } finally {
          setIsLoadingGovs(false);
        }
      })();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!items.length) return;
    trackMeta("InitiateCheckout", { value: subtotal - discount, currency: "EGP", num_items: items.length });
    trackGa("begin_checkout", { currency: "EGP", value: subtotal - discount, items: items.map((item) => ({ item_id: item.productId, item_name: item.product.name, quantity: item.quantity })) });
  }, [discount, items, subtotal]);

  const shippingFee = useMemo(() => {
    const selected = governorates.find((item) => item.id === Number(governorateId));
    return selected?.fee ?? 0;
  }, [governorateId, governorates]);

  const subtotalAfterDiscount = subtotal - discount;
  const total = subtotalAfterDiscount + shippingFee;

  async function handleConfirmOrder() {
    setError("");
    if (!name.trim() || !address.trim() || !governorateId) return setError("يرجى استكمال بيانات الطلب");
    if (!isValidEgyptPhone(phone)) return setError("رقم الهاتف غير صحيح");
    if (!items.length) return setError("السلة فارغة");

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, customerPhone: phone, addressText: address, governorateId: Number(governorateId), notes, couponCode: appliedCoupon?.code, paymentMethod: "cod" }),
      });

      const result = await response.json();
      if (!result.ok) {
        setError(result.message ?? "حدث خطأ، حاول مرة أخرى");
        setIsSubmitting(false);
        return;
      }

      await clearCart();
      router.push(`/order/success/${result.data.orderNumber}`);
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
      setIsSubmitting(false);
    }
  }

  if (isCartLoading) return <div className="space-y-5 px-4 py-5"><Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الدفع" }]} /><section className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-black/60">جاري تحميل السلة...</section></div>;
  if (!items.length) return <div className="space-y-5 px-4 py-5"><Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الدفع" }]} /><section className="rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center"><p className="text-sm text-black/70">السلة فارغة</p><Link href="/" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">العودة للتسوق</Link></section></div>;

  return (
    <div className="space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "إتمام الطلب" }]} />
      <h1 className="text-xl font-bold text-primary">إتمام الطلب</h1>
      <section className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" />
        <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="رقم الهاتف" className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="العنوان" className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" />
        <select value={governorateId} onChange={(e) => setGovernorateId(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" disabled={isLoadingGovs}><option value="">{isLoadingGovs ? "جاري تحميل المحافظات..." : "اختر المحافظة"}</option>{governorates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات اختيارية" className="min-h-20 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none" />
      </section>
      <section className="rounded-2xl border border-black/10 bg-white p-4"><div className="space-y-2 text-sm"><div className="flex justify-between"><span>المجموع الفرعي</span><span>{subtotal} جنيه</span></div><div className="flex justify-between"><span>الخصم</span><span>-{discount} جنيه</span></div><div className="flex justify-between"><span>الإجمالي بعد الخصم</span><span>{subtotalAfterDiscount} جنيه</span></div><div className="flex justify-between"><span>الشحن</span><span>{shippingFee} جنيه</span></div><div className="flex justify-between border-t border-black/10 pt-2 font-bold text-primary"><span>الإجمالي</span><span>{total} جنيه</span></div></div></section>
      <section className="rounded-2xl border border-black/10 bg-white p-4"><p className="text-sm text-black/70">طريقة الدفع</p><p className="mt-1 text-sm font-semibold text-primary">الدفع عند الاستلام</p></section>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="button" disabled={isSubmitting} onClick={handleConfirmOrder} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}</button>
    </div>
  );
}
