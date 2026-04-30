import { NextResponse } from "next/server";
import { CouponType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminGuard";

type CouponPayload = { id?: number; code: string; type: CouponType; value: number; isActive?: boolean; startsAt?: string | null; endsAt?: string | null; maxUses?: number | null; eligibleProductIds?: number[] };

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const coupons = await prisma.coupon.findMany({ include: { products: { select: { productId: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, data: coupons.map((coupon) => ({ ...coupon, value: Number(coupon.value), eligibleProductIds: coupon.products.map((item) => item.productId) })) });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as CouponPayload;
    if (!body.code || !body.type || Number(body.value) <= 0) return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });

    const created = await prisma.coupon.create({
      data: {
        code: body.code.trim().toUpperCase(),
        type: body.type,
        value: body.value,
        isActive: body.isActive ?? true,
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        endsAt: body.endsAt ? new Date(body.endsAt) : null,
        maxUses: body.maxUses ?? null,
        products: body.eligibleProductIds?.length ? { createMany: { data: body.eligibleProductIds.map((productId) => ({ productId })), skipDuplicates: true } } : undefined,
      },
      include: { products: true },
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to create coupon", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as CouponPayload;
    if (!body.id) return NextResponse.json({ ok: false, message: "Coupon id is required" }, { status: 400 });

    const updated = await prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.update({ where: { id: body.id }, data: { ...(body.code !== undefined ? { code: body.code.trim().toUpperCase() } : {}), ...(body.type !== undefined ? { type: body.type } : {}), ...(body.value !== undefined ? { value: body.value } : {}), ...(body.isActive !== undefined ? { isActive: body.isActive } : {}), ...(body.startsAt !== undefined ? { startsAt: body.startsAt ? new Date(body.startsAt) : null } : {}), ...(body.endsAt !== undefined ? { endsAt: body.endsAt ? new Date(body.endsAt) : null } : {}), ...(body.maxUses !== undefined ? { maxUses: body.maxUses } : {}) } });

      if (body.eligibleProductIds) {
        await tx.couponProduct.deleteMany({ where: { couponId: body.id } });
        if (body.eligibleProductIds.length) {
          await tx.couponProduct.createMany({ data: body.eligibleProductIds.map((productId) => ({ couponId: body.id!, productId })), skipDuplicates: true });
        }
      }

      return coupon;
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to update coupon", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, message: "Coupon id is required" }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to delete coupon", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
