import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ProductQuery = {
  slug?: string;
  categorySlug?: string;
  q?: string;
};

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: true;
  };
}>;

function toFrontendProduct(product: ProductWithRelations) {
  const imageUrls = product.images
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((image) => image.imageUrl);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    category: {
      id: product.category.id,
      slug: product.category.slug,
      name: product.category.name,
    },
    images: imageUrls,
    image: imageUrls[0] ?? "/images/products/placeholder.svg",
    imageFallback: "/images/products/placeholder.svg",
    gallery: imageUrls.length ? imageUrls : ["/images/products/placeholder.svg"],
    galleryFallbacks: imageUrls.length
      ? imageUrls.map(() => "/images/products/placeholder.svg")
      : ["/images/products/placeholder.svg"],
    variants: product.variants.map((variant) => ({
      id: variant.id,
      color: variant.color,
      size: variant.size,
      stock: variant.stockQty,
      reserved: variant.reservedQty,
      sku: variant.sku,
    })),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query: ProductQuery = {
    slug: searchParams.get("slug") ?? undefined,
    categorySlug: searchParams.get("categorySlug") ?? undefined,
    q: searchParams.get("q")?.trim() || undefined,
  };

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { isActive: true },
        ...(query.slug ? { slug: query.slug } : {}),
        ...(query.categorySlug ? { category: { isActive: true, slug: query.categorySlug } } : {}),
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q } },
                { category: { name: { contains: query.q } } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        images: true,
        variants: { where: { isActive: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      data: products.map(toFrontendProduct),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
      },
      { status: 500 },
    );
  }
}
