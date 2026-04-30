import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminGuard";

type ShippingPayload = { id?: number; name: string; fee: number; isActive?: boolean };

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const rows = await prisma.shippingGovernorate.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ ok: true, data: rows.map((item) => ({ ...item, fee: Number(item.fee) })) });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as ShippingPayload;
    if (!body.name?.trim() || Number(body.fee) < 0) return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });

    const created = await prisma.shippingGovernorate.create({ data: { name: body.name.trim(), fee: body.fee, isActive: body.isActive ?? true } });
    return NextResponse.json({ ok: true, data: { ...created, fee: Number(created.fee) } });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to create governorate", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as ShippingPayload;
    if (!body.id) return NextResponse.json({ ok: false, message: "Governorate id is required" }, { status: 400 });

    const updated = await prisma.shippingGovernorate.update({ where: { id: body.id }, data: { ...(body.name !== undefined ? { name: body.name.trim() } : {}), ...(body.fee !== undefined ? { fee: body.fee } : {}), ...(body.isActive !== undefined ? { isActive: body.isActive } : {}) } });
    return NextResponse.json({ ok: true, data: { ...updated, fee: Number(updated.fee) } });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to update governorate", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, message: "Governorate id is required" }, { status: 400 });

    await prisma.shippingGovernorate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to delete governorate", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
