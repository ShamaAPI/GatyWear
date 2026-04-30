"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductStickyCta from "@/components/ProductStickyCta";
import SmartImage from "@/components/SmartImage";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/homeMock";
import { trackGa, trackMeta } from "@/lib/analytics";

type ProductDetailsClientProps = {
  product: Product;
  suggestedProducts: Product[];
};

export default function ProductDetailsClient({
  product,
  suggestedProducts,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const colors = Array.from(new Set(product.variants.map((variant) => variant.color)));
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState("");

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          product.variants
            .filter((variant) => variant.color === selectedColor)
            .map((variant) => variant.size),
        ),
      ),
    [product.variants, selectedColor],
  );

  const selectedVariant = product.variants.find(
    (variant) => variant.color === selectedColor && variant.size === selectedSize,
  );

  const stock = selectedVariant?.stock ?? 0;
  const hasValidSelection = Boolean(selectedColor && selectedSize);
  const isOutOfStock = hasValidSelection ? stock <= 0 : false;

  useEffect(() => {
    trackMeta("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "EGP",
    });
  }, [product.id, product.name, product.price]);

  async function handleAddToCart() {
    if (!hasValidSelection) {
      setError("اختر اللون والمقاس أولًا");
      return;
    }
    if (isOutOfStock) {
      setError("غير متاح حاليًا");
      return;
    }

    setError("");
    setIsAdding(true);
    const result = await addToCart(product, quantity, selectedColor, selectedSize);
    if (!result.ok) {
      setError(result.message ?? "تعذر إضافة المنتج");
    } else {
      trackMeta("AddToCart", {
        content_name: product.name,
        content_ids: [product.id],
        value: product.price * quantity,
        currency: "EGP",
      });
      trackGa("add_to_cart", {
        currency: "EGP",
        value: product.price * quantity,
        items: [{ item_id: product.id, item_name: product.name, quantity }],
      });
    }
    setIsAdding(false);
  }

  async function handleBuyNow() {
    if (!hasValidSelection) {
      setError("اختر اللون والمقاس أولًا");
      return;
    }
    if (isOutOfStock) {
      setError("غير متاح حاليًا");
      return;
    }

    setError("");
    setIsBuying(true);
    const result = await addToCart(product, quantity, selectedColor, selectedSize);
    if (!result.ok) {
      setError(result.message ?? "تعذر إضافة المنتج");
      setIsBuying(false);
      return;
    }
    trackMeta("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      value: product.price * quantity,
      currency: "EGP",
    });
    router.push("/checkout");
  }

  return (
    <>
      <div className="space-y-5 px-4 py-5 pb-24 md:pb-5">
        <Breadcrumbs
          items={[
            { label: "الرئيسية", href: "/" },
            { label: product.categoryName, href: `/category/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-zinc-100">
              <SmartImage
                src={product.gallery[0]}
                fallbackSrc={product.galleryFallbacks?.[0] ?? product.imageFallback}
                alt={product.name}
                width={900}
                height={1100}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.gallery.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-lg border border-black/10">
                  <SmartImage
                    src={image}
                    fallbackSrc={product.galleryFallbacks?.[index] ?? product.imageFallback}
                    alt={`${product.name}-${index + 1}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
            <p className="text-xl font-bold text-primary">{product.price} EGP</p>

            {!hasValidSelection ? (
              <p className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-black/70">اختر اللون والمقاس لمعرفة المخزون</p>
            ) : isOutOfStock ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">غير متاح حاليًا</p>
            ) : (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">متبقي {stock} قطع فقط</p>
            )}

            <p className="text-sm leading-7 text-black/75">{product.description}</p>

            <div>
              <p className="mb-2 text-sm font-semibold text-primary">اللون</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize("");
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                      selectedColor === color
                        ? "border-primary bg-primary text-white"
                        : "border-black/15 text-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-primary">المقاس</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-black/15 text-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-primary">الكمية</p>
              <input
                type="number"
                min={1}
                max={stock || 1}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                className="w-24 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!hasValidSelection || isOutOfStock || isAdding}
                className="flex-1 rounded-lg border border-primary px-3 py-3 text-sm font-semibold text-primary disabled:opacity-50"
              >
                {isAdding ? "جاري الإضافة..." : "أضف للسلة"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!hasValidSelection || isOutOfStock || isBuying}
                className="flex-1 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isBuying ? "جاري التحويل..." : "شراء الآن"}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-primary">منتجات مقترحة</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {suggestedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>

      <ProductStickyCta
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        disableActions={!hasValidSelection || isOutOfStock || isAdding || isBuying}
      />
    </>
  );
}
