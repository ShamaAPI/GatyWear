import StaticContentPage from "@/components/StaticContentPage";

export default function ShippingPolicyPage() {
  return (
    <StaticContentPage
      title="سياسة الشحن"
      paragraphs={[
        "يتم تجهيز الطلبات خلال 24 إلى 48 ساعة عمل من وقت التأكيد.",
        "مدة التوصيل تختلف حسب المحافظة وعادة تكون بين 2 إلى 5 أيام عمل.",
        "رسوم الشحن تظهر بوضوح في صفحة الدفع قبل تأكيد الطلب.",
      ]}
    />
  );
}
