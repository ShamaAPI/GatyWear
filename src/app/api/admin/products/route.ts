import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminGuard";

type VariantPayload = {
  color: string;
  size: string;
  sku?: string | null;
  stockQty: number;
  reservedQty?: number;
  isActive?: boolean;
};

type ImagePayload = {
  imageUrl: string;
  sortOrder?: number;
};

type ProductPayload = {
  id?: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  isActive?: boolean;
  variants?: VariantPayload[];
  images?: ImagePayload[];
};

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const rows = await prisma.product.findMany({
    include: { category: true, variants: true, images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: rows.map((row) => ({ ...row, price: Number(row.price) })) });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as ProductPayload;
    if (!body.name?.trim() || !body.slug?.trim() || !body.categoryId || Number(body.price) <= 0) {
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    }

    const created = await prisma.product.create({
      data: {
        categoryId: body.categoryId,
        name: body.name.trim(),
        slug: body.slug.trim(),
        description: body.description ?? "",
        price: body.price,
        isActive: body.isActive ?? true,
        variants: body.variants?.length
          ? { create: body.variants.map((variant) => ({ color: variant.color, size: variant.size, sku: variant.sku ?? null, stockQty: Number(variant.stockQty ?? 0), reservedQty: Number(variant.reservedQty ?? 0), isActive: variant.isActive ?? true })) }
          : undefined,
        images: body.images?.length
          ? { create: body.images.map((image, index) => ({ imageUrl: image.imageUrl, sortOrder: image.sortOrder ?? index })) }
          : undefined,
      },
      include: { variants: true, images: true, category: true },
    });

    return NextResponse.json({ ok: true, data: { ...created, price: Number(created.price) } });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to create product", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as ProductPayload;
    if (!body.id) return NextResponse.json({ ok: false, message: "Product id is required" }, { status: 400 });

    const updated = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: body.id },
        data: {
          ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
          ...(body.name !== undefined ? { name: body.name.trim() } : {}),
          ...(body.slug !== undefined ? { slug: body.slug.trim() } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
          ...(body.price !== undefined ? { price: body.price } : {}),
          ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        },
      });

      if (body.images) {
        await tx.productImage.deleteMany({ where: { productId: body.id } });
        if (body.images.length) {
          await tx.productImage.createMany({ data: body.images.map((image, index) => ({ productId: body.id!, imageUrl: image.imageUrl, sortOrder: image.sortOrder ?? index })) });
        }
      }

      if (body.variants) {
        await tx.productVariant.deleteMany({ where: { productId: body.id } });
        if (body.variants.length) {
          await tx.productVariant.createMany({ data: body.variants.map((variant) => ({ productId: body.id!, color: variant.color, size: variant.size, sku: variant.sku ?? null, stockQty: Number(variant.stockQty ?? 0), reservedQty: Number(variant.reservedQty ?? 0), isActive: variant.isActive ?? true })) });
        }
      }

      return product;
    });

    return NextResponse.json({ ok: true, data: { ...updated, price: Number(updated.price) } });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to update product", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, message: "Product id is required" }, { status: 400 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to delete product", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
