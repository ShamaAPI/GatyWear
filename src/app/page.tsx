import CategoryGrid from "@/components/CategoryGrid";
import HeroBannerCarousel from "@/components/HeroBannerCarousel";
import ProductSection from "@/components/ProductSection";
import StickyCartIcon from "@/components/StickyCartIcon";
import { homeBanners, type Category, type Product } from "@/data/homeMock";
import { getApiBaseUrl } from "@/lib/serverApi";

type ApiCategory = {
  id: number;
  slug: string;
  name: string;
  image: string;
  imageFallback?: string;
  productsCount: number;
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
  variants: { color: string; size: string; stock: number }[];
  category: { slug: string; name: string };
};

export default async function Home() {
  const baseUrl = await getApiBaseUrl();

  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/products`, { cache: "no-store" }),
    ]);

    const categoriesJson = await categoriesRes.json();
    const productsJson = await productsRes.json();

    categories = (categoriesJson.data ?? []).map((category: ApiCategory) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      itemCount: category.productsCount,
      image: category.image,
      imageFallback: category.imageFallback,
    }));

    products = (productsJson.data ?? []).map((product: ApiProduct) => ({
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
      isFeatured: false,
      isBestSeller: false,
    }));
  } catch {
    categories = [];
    products = [];
  }

  const featuredProducts = products.slice(0, 4);
  const bestSellerProducts = products.length > 4 ? products.slice(4, 8) : products.slice(0, 4);

  return (
    <>
      <div className="gw-container space-y-8 bg-background py-5">
        <HeroBannerCarousel banners={homeBanners} />
        <CategoryGrid categories={categories} />
        <ProductSection title="منتجات مميزة" products={featuredProducts} />
        <ProductSection title="الأكثر مبيعًا" products={bestSellerProducts} />
      </div>
      <StickyCartIcon />
    </>
  );
}
