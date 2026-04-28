import CategoryGrid from "@/components/CategoryGrid";
import HeroBannerCarousel from "@/components/HeroBannerCarousel";
import ProductSection from "@/components/ProductSection";
import StickyCartIcon from "@/components/StickyCartIcon";
import {
  bestSellerProducts,
  featuredProducts,
  homeBanners,
  homeCategories,
} from "@/data/homeMock";

export default function Home() {
  return (
    <>
      <div className="space-y-6 bg-background px-4 py-5">
        <HeroBannerCarousel banners={homeBanners} />
        <CategoryGrid categories={homeCategories} />
        <ProductSection title="منتجات مميزة" products={featuredProducts} />
        <ProductSection title="الأكثر مبيعًا" products={bestSellerProducts} />
      </div>
      <StickyCartIcon />
    </>
  );
}
