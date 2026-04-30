import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminGuard";

type CategoryPayload = { id?: number; name: string; slug: string; description?: string; imageUrl?: string; isActive?: boolean; sortOrder?: number };

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ ok: true, data: categories.map((category) => ({ ...category, productsCount: category._count.products })) });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as CategoryPayload;
    if (!body.name?.trim() || !body.slug?.trim()) return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });

    const created = await prisma.category.create({ data: { name: body.name.trim(), slug: body.slug.trim(), description: body.description ?? null, imageUrl: body.imageUrl ?? null, isActive: body.isActive ?? true, sortOrder: body.sortOrder ?? 0 } });
    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to create category", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as CategoryPayload;
    if (!body.id) return NextResponse.json({ ok: false, message: "Category id is required" }, { status: 400 });

    const updated = await prisma.category.update({ where: { id: body.id }, data: { ...(body.name !== undefined ? { name: body.name.trim() } : {}), ...(body.slug !== undefined ? { slug: body.slug.trim() } : {}), ...(body.description !== undefined ? { description: body.description || null } : {}), ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl || null } : {}), ...(body.isActive !== undefined ? { isActive: body.isActive } : {}), ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}) } });
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to update category", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, message: "Category id is required" }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to delete category", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
