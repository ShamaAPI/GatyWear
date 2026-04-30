import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code: string; items: { productId: number; quantity: number; unitPrice: number }[] };
    const code = body.code?.trim().toUpperCase();

    if (!code) return NextResponse.json({ ok: false, message: "كود غير صحيح" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: { products: true },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ ok: false, message: "كود غير صحيح" }, { status: 400 });
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json({ ok: false, message: "الكوبون غير متاح بعد" }, { status: 400 });
    }
    if (coupon.endsAt && coupon.endsAt < now) {
      return NextResponse.json({ ok: false, message: "الكوبون منتهي" }, { status: 400 });
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ ok: false, message: "تم استهلاك الكوبون بالكامل" }, { status: 400 });
    }

    const eligibleProducts = coupon.products.map((item) => item.productId);
    const eligibleSubtotal = body.items.reduce((sum, item) => {
      if (!eligibleProducts.length || eligibleProducts.includes(item.productId)) {
        return sum + item.unitPrice * item.quantity;
      }
      return sum;
    }, 0);

    if (eligibleSubtotal <= 0) {
      return NextResponse.json({ ok: false, message: "لا ينطبق على المنتجات" }, { status: 400 });
    }

    const discount =
      coupon.type === "percentage"
        ? Math.round(eligibleSubtotal * (Number(coupon.value) / 100))
        : Math.min(Number(coupon.value), eligibleSubtotal);

    return NextResponse.json({
      ok: true,
      data: {
        couponId: coupon.id,
        code: coupon.code,
        discount,
      },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to validate coupon", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
