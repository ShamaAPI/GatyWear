"use client";

import { useEffect, useState } from "react";
import type { Banner } from "@/data/homeMock";

type HeroBannerCarouselProps = {
  banners: Banner[];
};

export default function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="gw-card relative overflow-hidden">
      {banners.map((banner, index) => (
        <article
          key={banner.id}
          className={`${
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
          } absolute inset-0 bg-gradient-to-l ${banner.background} p-7 text-white transition-opacity duration-500`}
        >
          <p className="text-xs font-medium tracking-[0.2em] text-amber-200">GATY WEAR</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight">{banner.title}</h2>
          <p className="mt-2 text-sm text-zinc-100/90">{banner.subtitle}</p>
          <button
            type="button"
            className="mt-5 rounded-lg bg-accent px-5 py-2.5 text-sm font-extrabold text-black"
          >
            {banner.cta}
          </button>
        </article>
      ))}

      <div className="relative h-64" />

      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`banner-${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full ${
              index === activeIndex ? "bg-white" : "bg-white/45"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
