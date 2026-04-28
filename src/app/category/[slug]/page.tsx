import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, homeCategories } from "@/data/homeMock";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    color?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: "latest" | "price_asc" | "price_desc";
  }>;
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const filters = await searchParams;
  const category = homeCategories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const colorFilter = filters.color;
  const sizeFilter = filters.size;
  const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;
  const sort = filters.sort ?? "latest";

  let products = getProductsByCategory(slug).filter((item) => {
    const matchesColor = colorFilter
      ? item.variants.some((variant) => variant.color === colorFilter)
      : true;
    const matchesSize = sizeFilter
      ? item.variants.some((variant) => variant.size === sizeFilter)
      : true;
    const matchesMinPrice = minPrice ? item.price >= minPrice : true;
    const matchesMaxPrice = maxPrice ? item.price <= maxPrice : true;
    return matchesColor && matchesSize && matchesMinPrice && matchesMaxPrice;
  });

  if (sort === "price_asc") {
    products = products.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    products = products.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: category.name }]} />

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-primary">{category.name}</h1>
        <p className="text-sm text-black/60">{products.length} منتج</p>
      </div>

      <section className="rounded-2xl border border-black/10 bg-white p-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Link
            href={`?sort=${sort}`}
            className="rounded-lg border border-black/10 px-2 py-2 text-center text-xs"
          >
            كل الألوان
          </Link>
          <Link
            href={`?color=أسود&sort=${sort}`}
            className="rounded-lg border border-black/10 px-2 py-2 text-center text-xs"
          >
            أسود
          </Link>
          <Link
            href={`?size=M&sort=${sort}`}
            className="rounded-lg border border-black/10 px-2 py-2 text-center text-xs"
          >
            مقاس M
          </Link>
          <Link
            href={`?minPrice=500&maxPrice=1000&sort=${sort}`}
            className="rounded-lg border border-black/10 px-2 py-2 text-center text-xs"
          >
            500 - 1000 EGP
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="?sort=latest"
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-primary"
          >
            الأحدث
          </Link>
          <Link
            href="?sort=price_asc"
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-primary"
          >
            السعر: الأقل
          </Link>
          <Link
            href="?sort=price_desc"
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-primary"
          >
            السعر: الأعلى
          </Link>
        </div>
      </section>

      {products.length > 0 ? (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/60">
          لا يوجد منتجات في هذه الفئة
        </section>
      )}
    </div>
  );
}
