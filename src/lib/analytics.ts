"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackMeta(event: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, payload ?? {});
}

export function trackGa(event: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, payload ?? {});
}

export function trackPageView(url: string) {
  trackMeta("PageView");

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId && typeof window !== "undefined" && window.gtag) {
    window.gtag("config", gaId, { page_path: url });
  }
}

