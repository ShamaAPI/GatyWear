import { notFound } from "next/navigation";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { type Product } from "@/data/homeMock";
import { getApiBaseUrl } from "@/lib/serverApi";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const baseUrl = await getApiBaseUrl();
  let apiFailed = false;
  let product: Product | null = null;
  let suggestedProducts: Product[] = [];

  try {
    const [productRes, categoryProductsRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?slug=${slug}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/products`, { cache: "no-store" }),
    ]);

    const productJson = await productRes.json();
    const allProductsJson = await categoryProductsRes.json();

    const productRaw = (productJson.data ?? [])[0] as ApiProduct | undefined;
    if (!productRaw) {
      notFound();
    }

    const currentProduct = toFrontendProduct(productRaw);
    product = currentProduct;

    suggestedProducts = ((allProductsJson.data ?? []) as ApiProduct[])
      .filter(
        (item) =>
          item.category.slug === currentProduct.categorySlug && item.slug !== currentProduct.slug,
      )
      .slice(0, 4)
      .map(toFrontendProduct);
  } catch {
    apiFailed = true;
  }

  if (apiFailed) {
    return (
      <div className="px-4 py-8">
        <section className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/60">
          تعذر تحميل بيانات المنتج حاليًا
        </section>
      </div>
    );
  }

  if (!product) notFound();

  return <ProductDetailsClient product={product} suggestedProducts={suggestedProducts} />;
}

