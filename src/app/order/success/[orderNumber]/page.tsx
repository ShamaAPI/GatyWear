import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import PurchaseTracker from "@/components/PurchaseTracker";
import { bestSellerProducts } from "@/data/homeMock";
import { getApiBaseUrl } from "@/lib/serverApi";

type SuccessPageProps = {
  params: Promise<{ orderNumber: string }>;
};

type OrderData = {
  orderNumber: string;
  total: number;
};

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { orderNumber } = await params;
  const baseUrl = await getApiBaseUrl();

  let order: OrderData | null = null;

  try {
    const response = await fetch(`${baseUrl}/api/orders?orderNumber=${orderNumber}`, { cache: "no-store" });
    const json = await response.json();
    if (json.ok) {
      order = json.data as OrderData;
    }
  } catch {
    order = null;
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <PurchaseTracker orderNumber={order?.orderNumber ?? orderNumber} value={order?.total} />
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "نجاح الطلب" }]} />

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-sm text-emerald-700">تم تأكيد طلبك بنجاح</p>
        <h1 className="mt-2 text-xl font-bold text-primary">رقم الطلب: {order?.orderNumber ?? orderNumber}</h1>
        {order ? <p className="mt-2 text-sm text-black/70">إجمالي الطلب: {order.total} EGP</p> : null}
        <p className="mt-2 text-sm text-black/70">سنتواصل معك قريبًا لتأكيد تفاصيل الشحن.</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">
          العودة للتسوق
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-primary">منتجات مقترحة</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {bestSellerProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
