import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { type Product } from "@/data/homeMock";
import { getApiBaseUrl } from "@/lib/serverApi";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageFallback?: string;
  gallery: string[];
  galleryFallbacks?: string[];
  variants: { id: number; color: string; size: string; stock: number }[];
  category: { slug: string; name: string };
};

function toFrontendProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    categorySlug: product.category.slug,
    categoryName: product.category.name,
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    imageFallback: product.imageFallback,
    gallery: product.gallery,
    galleryFallbacks: product.galleryFallbacks,
    variants: product.variants,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const keyword = q.trim();

  let results: Product[] = [];
  let apiFailed = false;

  if (keyword) {
    try {
      const baseUrl = await getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/products?q=${encodeURIComponent(keyword)}`, {
        cache: "no-store",
      });
      const json = await response.json();
      results = ((json.data ?? []) as ApiProduct[]).map(toFrontendProduct);
    } catch {
      apiFailed = true;
    }
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "البحث" }]} />

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <h1 className="text-lg font-bold text-primary">نتائج البحث</h1>
        <p className="mt-1 text-sm text-black/60">
          {q ? `البحث عن: ${q}` : "اكتب كلمة للبحث عن المنتجات"}
        </p>
      </section>

      {apiFailed ? (
        <section className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/60">
          تعذر تحميل نتائج البحث
        </section>
      ) : results.length > 0 ? (
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

