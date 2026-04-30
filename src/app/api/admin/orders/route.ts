import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminGuard";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status") as OrderStatus | null;

    if (id) {
      const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { governorate: true, items: true, internalNotes: { orderBy: { createdAt: "desc" } }, statusLogs: { orderBy: { createdAt: "asc" } } } });
      if (!order) return NextResponse.json({ ok: false, message: "Order not found" }, { status: 404 });

      return NextResponse.json({ ok: true, data: { ...order, subtotal: Number(order.subtotal), discountTotal: Number(order.discountTotal), shippingFeeSnapshot: Number(order.shippingFeeSnapshot), total: Number(order.total), items: order.items.map((item) => ({ ...item, unitPriceSnapshot: Number(item.unitPriceSnapshot), lineTotal: Number(item.lineTotal) })) } });
    }

    const orders = await prisma.order.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ ok: true, data: orders.map((order) => ({ ...order, subtotal: Number(order.subtotal), discountTotal: Number(order.discountTotal), shippingFeeSnapshot: Number(order.shippingFeeSnapshot), total: Number(order.total) })) });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to fetch orders", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as { id: number; status: OrderStatus; shippingCompany?: string; trackingNumber?: string; note?: string };
    if (!body.id || !body.status) return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({ where: { id: body.id } });
      if (!current) throw new Error("ORDER_NOT_FOUND");
      if (current.status === "pending" && body.status === "shipped") throw new Error("INVALID_FLOW");
      if (current.status === "shipped" && body.status === "processing") throw new Error("INVALID_FLOW");

      const updated = await tx.order.update({ where: { id: body.id }, data: { status: body.status, ...(body.shippingCompany !== undefined ? { shippingCompany: body.shippingCompany } : {}), ...(body.trackingNumber !== undefined ? { trackingNumber: body.trackingNumber } : {}), ...(body.status === "shipped" ? { shippedAt: new Date() } : {}), ...(body.status === "delivered" ? { deliveredAt: new Date() } : {}) } });

      await tx.orderStatusLog.create({ data: { orderId: body.id, fromStatus: current.status, toStatus: body.status, note: body.note ?? null, createdBy: auth.session.userId } });
      return updated;
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown";
    if (message === "ORDER_NOT_FOUND") return NextResponse.json({ ok: false, message: "Order not found" }, { status: 404 });
    if (message === "INVALID_FLOW") return NextResponse.json({ ok: false, message: "Invalid status transition" }, { status: 400 });
    return NextResponse.json({ ok: false, message: "Failed to update order", error: message }, { status: 500 });
  }
}
