"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { allProducts, type Product } from "@/data/homeMock";

export type CartItem = {
  productId: number;
  quantity: number;
  color: string;
  size: string;
};

type CouponState = {
  code: string;
  discount: number;
};

type MiniCartState = {
  open: boolean;
  productName: string;
  quantity: number;
  subtotal: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: CouponState | null;
  miniCart: MiniCartState;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message?: string }>;
  clearCoupon: () => void;
  closeMiniCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "gaty_cart_v1";

const couponRules = {
  SAVE10: { type: "percentage" as const, value: 10, eligibleProductIds: [1, 2, 3, 4, 5, 6] },
  TSHIRT10: { type: "percentage" as const, value: 10, eligibleProductIds: [1, 5] },
};

function getProduct(productId: number) {
  return allProducts.find((item) => item.id === productId);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(CART_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);
  const [miniCart, setMiniCart] = useState<MiniCartState>({
    open: false,
    productName: "",
    quantity: 0,
    subtotal: 0,
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProduct(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [items],
  );

  const discount = appliedCoupon?.discount ?? 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: Product, quantity = 1, color?: string, size?: string) {
    const variant = product.variants[0];
    const nextColor = color ?? variant?.color ?? "Default";
    const nextSize = size ?? variant?.size ?? "One Size";

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...current, { productId: product.id, quantity, color: nextColor, size: nextSize }];
    });

    setMiniCart({
      open: true,
      productName: product.name,
      quantity,
      subtotal: subtotal + product.price * quantity,
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  }

  function removeItem(productId: number) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
    setAppliedCoupon(null);
  }

  function clearCoupon() {
    setAppliedCoupon(null);
  }

  async function applyCoupon(code: string): Promise<{ ok: boolean; message?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const normalized = code.trim().toUpperCase();

    if (!normalized || normalized === "WRONG") {
      setAppliedCoupon(null);
      return { ok: false, message: "كود غير صحيح" };
    }

    if (normalized === "EXPIRED") {
      setAppliedCoupon(null);
      return { ok: false, message: "الكوبون منتهي" };
    }

    const rule = couponRules[normalized as keyof typeof couponRules];
    if (!rule) {
      setAppliedCoupon(null);
      return { ok: false, message: "كود غير صحيح" };
    }

    const eligibleSubtotal = items.reduce((sum, item) => {
      if (!rule.eligibleProductIds.includes(item.productId)) return sum;
      const product = getProduct(item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);

    if (eligibleSubtotal <= 0) {
      setAppliedCoupon(null);
      return { ok: false, message: "لا ينطبق على المنتجات" };
    }

    const amount = rule.type === "percentage" ? Math.round(eligibleSubtotal * (rule.value / 100)) : rule.value;
    setAppliedCoupon({ code: normalized, discount: amount });
    return { ok: true };
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
