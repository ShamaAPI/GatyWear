import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? undefined;

  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        ...(slug ? { slug } : {}),
      },
      include: {
        products: {
          where: { isActive: true },
          select: { id: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      ok: true,
      data: categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        image: category.imageUrl ?? "/images/categories/placeholder.svg",
        imageFallback: "/images/categories/placeholder.svg",
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        productsCount: category.products.length,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch categories",
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
      },
      { status: 500 },
    );
  }
}
