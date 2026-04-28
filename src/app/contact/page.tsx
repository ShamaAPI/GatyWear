import StaticContentPage from "@/components/StaticContentPage";

export default function ContactPage() {
  return (
    <StaticContentPage
      title="اتصل بنا"
      paragraphs={[
        "فريق Gaty Wear جاهز لمساعدتك في أي استفسار بخصوص المقاسات، الطلبات أو الشحن.",
        "يمكنك التواصل معنا عبر واتساب أو الهاتف يوميًا من 10 صباحًا حتى 10 مساءً.",
        "للاستفسارات التجارية والتعاون، يرجى إرسال بريد إلكتروني بعنوان واضح وسنرد خلال 24 ساعة عمل.",
      ]}
    />
  );
}
