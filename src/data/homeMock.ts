export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  background: string;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  itemCount: number;
  image: string;
  imageFallback?: string;
};

export type ProductVariant = {
  id?: number;
  color: string;
  size: string;
  stock: number;
};

export type Product = {
  id: number;
  slug: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  price: number;
  description: string;
  image: string;
  imageFallback?: string;
  gallery: string[];
  galleryFallbacks?: string[];
  variants: ProductVariant[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
};

const PRODUCT_PLACEHOLDER = "/images/products/placeholder.svg";
const CATEGORY_PLACEHOLDER = "/images/categories/placeholder.svg";

export const homeBanners: Banner[] = [
  {
    id: 1,
    title: "مجموعة الشارع الجديدة",
    subtitle: "ستايل جريء بتفاصيل نظيفة لطلعاتك اليومية",
    cta: "تسوق الآن",
    background: "from-black via-zinc-900 to-amber-500",
  },
  {
    id: 2,
    title: "خصم أسبوع الإطلاق",
    subtitle: "خصومات محدودة على منتجات مختارة لفترة قصيرة",
    cta: "اكتشف العروض",
    background: "from-zinc-950 via-zinc-700 to-zinc-950",
  },
  {
    id: 3,
    title: "ستايل مريح طوال اليوم",
    subtitle: "خامات عالية الجودة بتصميم streetwear عصري",
    cta: "شاهد التشكيلة",
    background: "from-amber-600 via-amber-500 to-zinc-900",
  },
];

export const homeCategories: Category[] = [
  {
    id: 1,
    slug: "tshirts",
    name: "تيشيرتات",
    itemCount: 24,
    image: CATEGORY_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    id: 2,
    slug: "hoodies",
    name: "هوديز",
    itemCount: 16,
    image: CATEGORY_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
  },
  {
    id: 3,
    slug: "pants",
    name: "بناطيل",
    itemCount: 19,
    image: CATEGORY_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
  },
  {
    id: 4,
    slug: "jackets",
    name: "جاكيتات",
    itemCount: 11,
    image: CATEGORY_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800",
  },
];

export const allProducts: Product[] = [
  {
    id: 1,
    slug: "oversized-black-tee",
    categorySlug: "tshirts",
    categoryName: "تيشيرتات",
    name: "تيشيرت أوفر سايز أسود",
    price: 799,
    description: "تيشيرت قطن 100% بقصة أوفر سايز مريحة ولمسة streetwear عصرية.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1503341338985-95b7dca8f1c8?w=800",
    ],
    variants: [
      { color: "أسود", size: "M", stock: 4 },
      { color: "أسود", size: "L", stock: 7 },
      { color: "أبيض", size: "M", stock: 6 },
    ],
    isFeatured: true,
  },
  {
    id: 2,
    slug: "heavy-cotton-hoodie",
    categorySlug: "hoodies",
    categoryName: "هوديز",
    name: "هودي قطن ثقيل",
    price: 1299,
    description: "هودي بخامة ثقيلة وملمس ناعم مناسب للأجواء الباردة واللوك اليومي.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    ],
    variants: [
      { color: "رمادي", size: "M", stock: 3 },
      { color: "رمادي", size: "L", stock: 8 },
      { color: "أسود", size: "XL", stock: 5 },
    ],
    isFeatured: true,
  },
  {
    id: 3,
    slug: "cargo-street-pants",
    categorySlug: "pants",
    categoryName: "بناطيل",
    name: "بنطال كارغو ستريت",
    price: 999,
    description: "بنطال كارغو عملي بقصة مستقيمة وجيوب متعددة بتفاصيل مميزة.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
      "https://images.unsplash.com/photo-1506629905607-58b3b2d70db5?w=800",
    ],
    variants: [
      { color: "زيتي", size: "32", stock: 9 },
      { color: "زيتي", size: "34", stock: 2 },
      { color: "أسود", size: "32", stock: 6 },
    ],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: 4,
    slug: "gray-denim-jacket",
    categorySlug: "jackets",
    categoryName: "جاكيتات",
    name: "جاكيت دينم رمادي",
    price: 1499,
    description: "جاكيت دينم بخياطة متينة ولمسة كلاسيكية قابلة للتنسيق بسهولة.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800",
    ],
    variants: [
      { color: "رمادي", size: "M", stock: 4 },
      { color: "رمادي", size: "L", stock: 5 },
      { color: "أزرق", size: "M", stock: 2 },
    ],
    isFeatured: true,
  },
  {
    id: 5,
    slug: "white-graphic-tee",
    categorySlug: "tshirts",
    categoryName: "تيشيرتات",
    name: "تيشيرت جرافيك أبيض",
    price: 749,
    description: "تيشيرت بطباعة جرافيك أمامية وخامة قطنية خفيفة.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1484519332611-516457305ff6?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1484519332611-516457305ff6?w=800",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    ],
    variants: [
      { color: "أبيض", size: "S", stock: 12 },
      { color: "أبيض", size: "M", stock: 10 },
      { color: "أسود", size: "M", stock: 3 },
    ],
    isBestSeller: true,
  },
  {
    id: 6,
    slug: "classic-zip-hoodie",
    categorySlug: "hoodies",
    categoryName: "هوديز",
    name: "هودي سحاب كلاسيك",
    price: 1199,
    description: "هودي بسحاب أمامي كامل وتفاصيل بسيطة مناسبة للارتداء اليومي.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    ],
    variants: [
      { color: "أسود", size: "M", stock: 7 },
      { color: "أسود", size: "L", stock: 6 },
      { color: "بيج", size: "L", stock: 2 },
    ],
    isBestSeller: true,
  },
  {
    id: 7,
    slug: "black-jogger-pants",
    categorySlug: "pants",
    categoryName: "بناطيل",
    name: "بنطال جوجر أسود",
    price: 899,
    description: "بنطال جوجر مرن بتفصيل مريح يناسب الحركة اليومية.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1506629905607-58b3b2d70db5?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1506629905607-58b3b2d70db5?w=800",
      "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800",
    ],
    variants: [
      { color: "أسود", size: "30", stock: 9 },
      { color: "أسود", size: "32", stock: 6 },
      { color: "رمادي", size: "32", stock: 3 },
    ],
    isBestSeller: true,
  },
  {
    id: 8,
    slug: "streetwear-cap",
    categorySlug: "jackets",
    categoryName: "إكسسوارات",
    name: "كاب ستريتوير",
    price: 399,
    description: "كاب بخامة متينة وشعار بسيط يكمل اللوك.",
    image: PRODUCT_PLACEHOLDER,
    imageFallback: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800",
    gallery: [PRODUCT_PLACEHOLDER, PRODUCT_PLACEHOLDER],
    galleryFallbacks: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800",
      "https://images.unsplash.com/photo-1484519332611-516457305ff6?w=800",
    ],
    variants: [
      { color: "أسود", size: "One Size", stock: 11 },
      { color: "بيج", size: "One Size", stock: 5 },
    ],
    isBestSeller: true,
  },
];

export const featuredProducts = allProducts.filter((item) => item.isFeatured);
export const bestSellerProducts = allProducts.filter((item) => item.isBestSeller);

export function getProductBySlug(slug: string) {
  return allProducts.find((item) => item.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return allProducts.filter((item) => item.categorySlug === slug);
}
