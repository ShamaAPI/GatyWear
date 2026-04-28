import { notFound } from "next/navigation";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { allProducts, getProductBySlug } from "@/data/homeMock";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const suggestedProducts = allProducts
    .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
    .slice(0, 4);

  return <ProductDetailsClient product={product} suggestedProducts={suggestedProducts} />;
}
