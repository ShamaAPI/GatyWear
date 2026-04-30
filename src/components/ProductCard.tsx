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
    <article className="gw-card overflow-hidden">
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
      <div className="space-y-2.5 p-3.5">
        <h4 className="line-clamp-2 text-sm font-bold text-primary">{product.name}</h4>
        <p className="text-base font-extrabold text-primary">{product.price} جنيه</p>
        {isOutOfStock ? <p className="text-xs text-red-600">غير متاح</p> : null}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding || isOutOfStock}
          className="block w-full rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-extrabold text-black disabled:opacity-50"
        >
          {isAdding ? "جاري الإضافة..." : "أضف للسلة"}
        </button>
      </div>
    </article>
  );
}

