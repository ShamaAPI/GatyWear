import type { Product } from "@/data/homeMock";
import ProductCard from "@/components/ProductCard";

type ProductSectionProps = {
  title: string;
  products: Product[];
};

export default function ProductSection({ title, products }: ProductSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <button type="button" className="text-sm font-medium text-amber-600">
          عرض الكل
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
