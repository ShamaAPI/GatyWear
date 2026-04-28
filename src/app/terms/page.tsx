import StaticContentPage from "@/components/StaticContentPage";

export default function TermsPage() {
  return (
    <StaticContentPage
      title="الشروط والأحكام"
      paragraphs={[
        "استخدامك لموقع Gaty Wear يعني موافقتك على الشروط والأحكام المنظمة لعملية الشراء.",
        "الأسعار والمخزون قابلة للتحديث في أي وقت قبل تأكيد الطلب بشكل نهائي.",
        "تحتفظ الإدارة بحق إلغاء أي طلب في حال وجود بيانات غير صحيحة أو مشكلة تشغيلية واضحة.",
      ]}
    />
  );
}
