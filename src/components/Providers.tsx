"use client";

import MiniCartPopup from "@/components/MiniCartPopup";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <MiniCartPopup />
    </CartProvider>
  );
}
