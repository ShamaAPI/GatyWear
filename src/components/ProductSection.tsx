import type { Product } from "@/data/homeMock";
import ProductCard from "@/components/ProductCard";

type ProductSectionProps = {
  title: string;
  products: Product[];
};

export default function ProductSection({ title, products }: ProductSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-primary">{title}</h3>
        <button type="button" className="text-sm font-bold text-primary underline underline-offset-4">
          ??? ????
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
