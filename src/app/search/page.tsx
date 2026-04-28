import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/data/homeMock";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const keyword = q.trim().toLowerCase();

  const results = keyword
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword),
      )
    : [];

  return (
    <div className="space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "البحث" }]} />

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h1 className="text-lg font-bold text-primary">نتائج البحث</h1>
        <p className="mt-1 text-sm text-black/60">
          {q ? `البحث عن: ${q}` : "اكتب كلمة للبحث عن المنتجات"}
        </p>
      </section>

      {results.length > 0 ? (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/60">
          لا توجد نتائج
        </section>
      )}
    </div>
  );
}
