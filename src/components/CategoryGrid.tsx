import type { Category } from "@/data/homeMock";
import SmartImage from "@/components/SmartImage";

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">الفئات</h3>
        <button type="button" className="text-sm font-medium text-amber-600">
          عرض الكل
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <article key={category.id} className="overflow-hidden rounded-2xl border border-black/10">
            <div className="aspect-square">
              <SmartImage
                src={category.image}
                fallbackSrc={category.imageFallback}
                alt={category.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="bg-white p-3">
              <h4 className="text-sm font-semibold text-primary">{category.name}</h4>
              <p className="mt-1 text-xs text-black/60">{category.itemCount} منتج</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
