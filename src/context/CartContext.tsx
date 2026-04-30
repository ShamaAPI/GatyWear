"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/homeMock";

export type CartApiItem = {
  id: number;
  productId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: {
    id: number;
    slug: string;
    name: string;
    image: string;
    imageFallback: string;
  };
  variant: {
    id: number;
    color: string;
    size: string;
    stock: number;
    reserved: number;
  };
};

type CouponState = {
  code: string;
  discount: number;
  couponId?: number;
};

type MiniCartState = {
  open: boolean;
  productName: string;
  quantity: number;
  subtotal: number;
};

type CartContextValue = {
  items: CartApiItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: CouponState | null;
  miniCart: MiniCartState;
  isCartLoading: boolean;
  cartError: string;
  refreshCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => Promise<{ ok: boolean; message?: string }>;
  updateQuantity: (itemId: number, quantity: number) => Promise<{ ok: boolean; message?: string }>;
  removeItem: (itemId: number) => Promise<{ ok: boolean; message?: string }>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message?: string }>;
  clearCoupon: () => void;
  closeMiniCart: () => void;
};

type CartApiResponse = {
  ok: boolean;
  message?: string;
  data?: {
    items: CartApiItem[];
    summary: {
      subtotal: number;
      itemCount: number;
    };
  };
};

const CartContext = createContext<CartContextValue | null>(null);

async function fetchCartState(): Promise<CartApiResponse> {
  const response = await fetch("/api/cart", { cache: "no-store" });
  return response.json();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartApiItem[]>([]);
  const [serverSubtotal, setServerSubtotal] = useState(0);
  const [serverItemCount, setServerItemCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);
  const [miniCart, setMiniCart] = useState<MiniCartState>({
    open: false,
    productName: "",
    quantity: 0,
    subtotal: 0,
  });

  const subtotal = useMemo(() => serverSubtotal, [serverSubtotal]);
  const itemCount = useMemo(() => serverItemCount, [serverItemCount]);
  const discount = appliedCoupon?.discount ?? 0;

  async function refreshCart() {
    try {
      setIsCartLoading(true);
      const result = await fetchCartState();
      if (!result.ok || !result.data) {
        setCartError(result.message ?? "تعذر تحميل السلة");
        return;
      }
      setItems(result.data.items);
      setServerSubtotal(result.data.summary.subtotal);
      setServerItemCount(result.data.summary.itemCount);
      setCartError("");
    } catch {
      setCartError("تعذر تحميل السلة");
    } finally {
      setIsCartLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshCart();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function addToCart(product: Product, quantity = 1, color?: string, size?: string) {
    const variant = product.variants.find((entry) => entry.color === color && entry.size === size);

    if (!variant?.id) {
      return { ok: false, message: "اختر اللون والمقاس أولًا" };
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: variant.id,
          quantity,
        }),
      });

      const result = (await response.json()) as CartApiResponse;
      if (!result.ok || !result.data) {
        return { ok: false, message: result.message ?? "تعذر إضافة المنتج" };
      }

      setItems(result.data.items);
      setServerSubtotal(result.data.summary.subtotal);
      setServerItemCount(result.data.summary.itemCount);
      setCartError("");
      setMiniCart({
        open: true,
        productName: product.name,
        quantity,
        subtotal: result.data.summary.subtotal,
      });

      return { ok: true };
    } catch {
      return { ok: false, message: "تعذر إضافة المنتج" };
    }
  }

  async function updateQuantity(itemId: number, quantity: number) {
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      const result = (await response.json()) as CartApiResponse;
      if (!result.ok || !result.data) {
        return { ok: false, message: result.message ?? "تعذر تحديث السلة" };
      }

      setItems(result.data.items);
      setServerSubtotal(result.data.summary.subtotal);
      setServerItemCount(result.data.summary.itemCount);
      return { ok: true };
    } catch {
      return { ok: false, message: "تعذر تحديث السلة" };
    }
  }

  async function removeItem(itemId: number) {
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
      const result = (await response.json()) as CartApiResponse;
      if (!result.ok || !result.data) {
        return { ok: false, message: result.message ?? "تعذر حذف المنتج" };
      }

      setItems(result.data.items);
      setServerSubtotal(result.data.summary.subtotal);
      setServerItemCount(result.data.summary.itemCount);
      return { ok: true };
    } catch {
      return { ok: false, message: "تعذر حذف المنتج" };
    }
  }

  async function clearCart() {
    await Promise.all(items.map((item) => removeItem(item.id)));
    setAppliedCoupon(null);
  }

  function clearCoupon() {
    setAppliedCoupon(null);
  }

  async function applyCoupon(code: string): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }),
      });

      const result = await response.json();
      if (!result.ok) {
        setAppliedCoupon(null);
        return { ok: false, message: result.message ?? "كود غير صحيح" };
      }

      setAppliedCoupon({
        code: result.data.code,
        discount: result.data.discount,
        couponId: result.data.couponId,
      });
      return { ok: true };
    } catch {
      setAppliedCoupon(null);
      return { ok: false, message: "تعذر تطبيق الكوبون" };
    }
  }

  function closeMiniCart() {
    setMiniCart((current) => ({ ...current, open: false }));
  }

  useEffect(() => {
    if (!miniCart.open) return;
    const timer = setTimeout(() => {
      setMiniCart((current) => ({ ...current, open: false }));
    }, 3000);
    return () => clearTimeout(timer);
  }, [miniCart.open]);

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    miniCart,
    isCartLoading,
    cartError,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    clearCoupon,
    closeMiniCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
