"use client";

type ProductStickyCtaProps = {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disableActions?: boolean;
};

export default function ProductStickyCta({ onAddToCart, onBuyNow, disableActions }: ProductStickyCtaProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white p-3 md:hidden">
      <div className="mx-auto flex w-full max-w-5xl gap-2">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={disableActions}
          className="flex-1 rounded-lg border border-primary px-3 py-3 text-sm font-semibold text-primary disabled:opacity-50"
        >
          أضف للسلة
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={disableActions}
          className="flex-1 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          شراء الآن
        </button>
      </div>
    </div>
  );
}
