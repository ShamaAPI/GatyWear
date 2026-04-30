import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber")?.trim();

    if (!orderNumber) {
      return NextResponse.json({ ok: false, message: "orderNumber is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        governorate: true,
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ ok: false, message: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        addressText: order.addressText,
        governorate: {
          id: order.governorate.id,
          name: order.governorate.name,
        },
        subtotal: Number(order.subtotal),
        discount: Number(order.discountTotal),
        shipping: Number(order.shippingFeeSnapshot),
        total: Number(order.total),
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          slug: item.product.slug,
          name: item.productNameSnapshot,
          color: item.colorSnapshot,
          size: item.sizeSnapshot,
          qty: item.qty,
          unitPrice: Number(item.unitPriceSnapshot),
          lineTotal: Number(item.lineTotal),
          image:
            item.product.images.sort((first, second) => first.sortOrder - second.sortOrder)[0]?.imageUrl ??
            "/images/products/placeholder.svg",
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
