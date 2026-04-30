import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCartToken } from "@/lib/cartService";

type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  addressText: string;
  governorateId: number;
  notes?: string;
  paymentMethod?: string;
  couponCode?: string;
};

function isValidEgyptPhone(phone: string) {
  return /^01\d{9}$/.test(phone);
}

export async function GET() {
  try {
    const governorates = await prisma.shippingGovernorate.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      ok: true,
      data: governorates.map((item) => ({
        id: item.id,
        name: item.name,
        fee: Number(item.fee),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to load governorates",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;

    if (!body.customerName?.trim() || !body.addressText?.trim() || !body.governorateId) {
      return NextResponse.json({ ok: false, message: "يرجى استكمال بيانات الطلب" }, { status: 400 });
    }

    if (!isValidEgyptPhone(body.customerPhone ?? "")) {
      return NextResponse.json({ ok: false, message: "رقم الهاتف غير صحيح" }, { status: 400 });
    }

    const cartToken = await getCartToken();
    if (!cartToken) {
      return NextResponse.json({ ok: false, message: "السلة فارغة" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { cartToken },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (!cart || !cart.items.length) {
        throw new Error("EMPTY_CART");
      }

      if (cart.expiresAt < new Date()) {
        for (const item of cart.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              reservedQty: { decrement: item.qty },
            },
          });
        }
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        await tx.cart.delete({ where: { id: cart.id } });
        throw new Error("CART_EXPIRED");
      }

      const governorate = await tx.shippingGovernorate.findUnique({
        where: { id: Number(body.governorateId) },
      });

      if (!governorate || !governorate.isActive) {
        throw new Error("GOVERNORATE_NOT_AVAILABLE");
      }

      for (const item of cart.items) {
        const variant = item.variant;
        if (!variant.isActive) throw new Error("VARIANT_UNAVAILABLE");
        if (variant.reservedQty < item.qty) throw new Error("RESERVATION_MISMATCH");
        if (variant.stockQty < item.qty) throw new Error("OUT_OF_STOCK");
      }

      const subtotal = cart.items.reduce((sum, item) => sum + Number(item.unitPriceSnapshot) * item.qty, 0);

      let discount = 0;
      let couponId: number | null = null;

      if (body.couponCode?.trim()) {
        const couponCode = body.couponCode.trim().toUpperCase();
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode },
          include: { products: true },
        });

        if (!coupon || !coupon.isActive) throw new Error("INVALID_COUPON");

        const now = new Date();
        if (coupon.startsAt && coupon.startsAt > now) throw new Error("INVALID_COUPON");
        if (coupon.endsAt && coupon.endsAt < now) throw new Error("EXPIRED_COUPON");
        if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) throw new Error("COUPON_EXHAUSTED");

        const eligibleProductIds = coupon.products.map((item) => item.productId);
        const eligibleSubtotal = cart.items.reduce((sum, item) => {
          if (!eligibleProductIds.length || eligibleProductIds.includes(item.productId)) {
            return sum + Number(item.unitPriceSnapshot) * item.qty;
          }
          return sum;
        }, 0);

        if (eligibleSubtotal <= 0) throw new Error("COUPON_NOT_APPLICABLE");

        discount =
          coupon.type === "percentage"
            ? Math.round(eligibleSubtotal * (Number(coupon.value) / 100))
            : Math.min(Number(coupon.value), eligibleSubtotal);

        couponId = coupon.id;
      }

      const total = subtotal - discount + Number(governorate.fee);

      const orderNumber = `GW-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: body.customerName.trim(),
          customerPhone: body.customerPhone.trim(),
          addressText: body.addressText.trim(),
          governorateId: governorate.id,
          shippingFeeSnapshot: governorate.fee,
          status: "pending",
          subtotal,
          discountTotal: discount,
          total,
          couponId,
          shippingProvider: body.paymentMethod ?? "cod",
        },
      });

      await tx.orderStatusLog.create({
        data: {
          orderId: order.id,
          toStatus: "pending",
          note: "تم إنشاء الطلب",
        },
      });

      if (body.notes?.trim()) {
        await tx.orderStatusLog.create({
          data: {
            orderId: order.id,
            toStatus: "pending",
            note: `ملاحظة العميل: ${body.notes.trim()}`,
          },
        });
      }

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            productNameSnapshot: item.product.name,
            colorSnapshot: item.variant.color,
            sizeSnapshot: item.variant.size,
            unitPriceSnapshot: item.unitPriceSnapshot,
            qty: item.qty,
            lineTotal: Number(item.unitPriceSnapshot) * item.qty,
          },
        });

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            reservedQty: { decrement: item.qty },
            stockQty: { decrement: item.qty },
          },
        });
      }

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });

      return { orderNumber, orderId: order.id, total };
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "EMPTY_CART") {
      return NextResponse.json({ ok: false, message: "السلة فارغة" }, { status: 400 });
    }

    if (message === "CART_EXPIRED") {
      return NextResponse.json(
        { ok: false, message: "تم تفريغ السلة لانتهاء مدة الحجز" },
        { status: 400 },
      );
    }

    if (message === "GOVERNORATE_NOT_AVAILABLE") {
      return NextResponse.json({ ok: false, message: "المحافظة غير متاحة" }, { status: 400 });
    }

    if (["OUT_OF_STOCK", "VARIANT_UNAVAILABLE", "RESERVATION_MISMATCH"].includes(message)) {
      return NextResponse.json(
        { ok: false, message: "تعذر إتمام الطلب بسبب تغير المخزون" },
        { status: 400 },
      );
    }

    if (message === "INVALID_COUPON") {
      return NextResponse.json({ ok: false, message: "كود غير صحيح" }, { status: 400 });
    }
    if (message === "EXPIRED_COUPON") {
      return NextResponse.json({ ok: false, message: "الكوبون منتهي" }, { status: 400 });
    }
    if (message === "COUPON_NOT_APPLICABLE") {
      return NextResponse.json({ ok: false, message: "لا ينطبق على المنتجات" }, { status: 400 });
    }
    if (message === "COUPON_EXHAUSTED") {
      return NextResponse.json({ ok: false, message: "تم استهلاك الكوبون بالكامل" }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: false,
        message: "حدث خطأ، حاول مرة أخرى",
        error: message,
      },
      { status: 500 },
    );
  }
}
