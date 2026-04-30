"use client";

import { useEffect } from "react";
import { trackGa, trackMeta } from "@/lib/analytics";

export default function PurchaseTracker({
  orderNumber,
  value,
}: {
  orderNumber: string;
  value?: number;
}) {
  useEffect(() => {
    const total = value ?? 0;
    trackMeta("Purchase", {
      value: total,
      currency: "EGP",
      content_name: orderNumber,
    });
    trackGa("purchase", {
      transaction_id: orderNumber,
      value: total,
      currency: "EGP",
    });
  }, [orderNumber, value]);

  return null;
}

