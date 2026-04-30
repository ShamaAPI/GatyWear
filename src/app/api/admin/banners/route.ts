import { NextResponse } from "next/server";
import { BannerTargetType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminGuard";

type BannerPayload = { id?: number; title?: string; subtitle?: string; buttonText?: string; imageUrlDesktop: string; imageUrlMobile?: string; targetType: BannerTargetType; targetProductId?: number | null; targetCategoryId?: number | null; targetUrl?: string | null; sortOrder?: number; isActive?: boolean; startsAt?: string | null; endsAt?: string | null };

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const rows = await prisma.homeBanner.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "desc" }] });
  return NextResponse.json({ ok: true, data: rows });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as BannerPayload;
    if (!body.imageUrlDesktop || !body.targetType) return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });

    const created = await prisma.homeBanner.create({ data: { title: body.title, subtitle: body.subtitle, buttonText: body.buttonText, imageUrlDesktop: body.imageUrlDesktop, imageUrlMobile: body.imageUrlMobile, targetType: body.targetType, targetProductId: body.targetProductId ?? null, targetCategoryId: body.targetCategoryId ?? null, targetUrl: body.targetUrl ?? null, sortOrder: body.sortOrder ?? 0, isActive: body.isActive ?? true, startsAt: body.startsAt ? new Date(body.startsAt) : null, endsAt: body.endsAt ? new Date(body.endsAt) : null } });
    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to create banner", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as BannerPayload;
    if (!body.id) return NextResponse.json({ ok: false, message: "Banner id is required" }, { status: 400 });

    const updated = await prisma.homeBanner.update({ where: { id: Number(body.id) }, data: { ...(body.title !== undefined ? { title: body.title } : {}), ...(body.subtitle !== undefined ? { subtitle: body.subtitle } : {}), ...(body.buttonText !== undefined ? { buttonText: body.buttonText } : {}), ...(body.imageUrlDesktop !== undefined ? { imageUrlDesktop: body.imageUrlDesktop } : {}), ...(body.imageUrlMobile !== undefined ? { imageUrlMobile: body.imageUrlMobile } : {}), ...(body.targetType !== undefined ? { targetType: body.targetType } : {}), ...(body.targetProductId !== undefined ? { targetProductId: body.targetProductId } : {}), ...(body.targetCategoryId !== undefined ? { targetCategoryId: body.targetCategoryId } : {}), ...(body.targetUrl !== undefined ? { targetUrl: body.targetUrl } : {}), ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}), ...(body.isActive !== undefined ? { isActive: body.isActive } : {}), ...(body.startsAt !== undefined ? { startsAt: body.startsAt ? new Date(body.startsAt) : null } : {}), ...(body.endsAt !== undefined ? { endsAt: body.endsAt ? new Date(body.endsAt) : null } : {}) } });
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to update banner", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, message: "Banner id is required" }, { status: 400 });

    await prisma.homeBanner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Failed to delete banner", error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
