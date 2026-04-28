"use client";

import Link from "next/link";
import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/homeMock";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const totalStock = product.variants.reduce((sum, item) => sum + item.stock, 0);
  const isOutOfStock = totalStock <= 0;

  async function handleAdd() {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    addToCart(product, 1);
    setIsAdding(false);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <Link href={`/product/${product.slug}`} className="block aspect-[4/5] bg-zinc-100">
        <SmartImage
          src={product.image}
          fallbackSrc={product.imageFallback}
          alt={product.name}
          width={600}
          height={750}
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="space-y-2 p-3">
        <h4 className="line-clamp-2 text-sm font-semibold text-primary">{product.name}</h4>
        <p className="text-sm font-bold text-primary">{product.price} EGP</p>
        {isOutOfStock ? <p className="text-xs text-red-600">غير متاح</p> : null}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding || isOutOfStock}
          className="block w-full rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-white disabled:opacity-50"
        >
          {isAdding ? "جاري الإضافة..." : "أضف للسلة"}
        </button>
      </div>
    </article>
  );
}
