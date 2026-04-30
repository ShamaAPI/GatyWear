import type { Category } from "@/data/homeMock";
import SmartImage from "@/components/SmartImage";

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-primary">الفئات</h3>
        <button type="button" className="text-sm font-bold text-primary underline underline-offset-4">
          عرض الكل
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <article key={category.id} className="gw-card overflow-hidden">
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
            <div className="bg-white p-3.5">
              <h4 className="text-sm font-bold text-primary">{category.name}</h4>
              <p className="mt-1 text-xs text-black/60">{category.itemCount} منتج</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
