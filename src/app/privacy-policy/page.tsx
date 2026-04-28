import StaticContentPage from "@/components/StaticContentPage";

export default function PrivacyPolicyPage() {
  return (
    <StaticContentPage
      title="سياسة الخصوصية"
      paragraphs={[
        "نلتزم بحماية بيانات العملاء واستخدامها فقط لأغراض تنفيذ الطلب وتحسين الخدمة.",
        "لا يتم بيع أو مشاركة البيانات الشخصية مع أطراف خارجية إلا عند الحاجة التشغيلية للشحن.",
        "باستخدامك للموقع فإنك توافق على سياسة الخصوصية وطريقة معالجة البيانات الموضحة هنا.",
      ]}
    />
  );
}
