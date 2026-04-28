import StaticContentPage from "@/components/StaticContentPage";

export default function ReturnPolicyPage() {
  return (
    <StaticContentPage
      title="سياسة الاسترجاع والاستبدال"
      paragraphs={[
        "يمكن طلب الاستبدال أو الاسترجاع خلال المدة الموضحة عند الاستلام بشرط الحفاظ على حالة المنتج.",
        "يجب أن يكون المنتج غير مستخدم وبكامل التغليف الأصلي وبحالة تسمح بإعادة البيع.",
        "في حالة وجود عيب تصنيع يتم التواصل مع الدعم لاتخاذ الإجراء المناسب بسرعة.",
      ]}
    />
  );
}
