import Breadcrumbs from "@/components/Breadcrumbs";

export default function StaticContentPage({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: title }]} />
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h1 className="text-xl font-bold text-primary">{title}</h1>
        <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
          {paragraphs.map((paragraph, index) => (
            <p key={`${title}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
