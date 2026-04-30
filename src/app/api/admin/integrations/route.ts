import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminGuard";

type IntegrationPayload = {
  google_tag_manager_id?: string;
  google_analytics_id?: string;
  google_ads_id?: string;
  facebook_pixel_id?: string;
  shippo_api_key?: string;
  hotjar_tracking_code?: string;
  gtmId?: string;
  gaId?: string;
  googleAdsId?: string;
  facebookPixelId?: string;
  shippoApiKey?: string;
  hotjarTrackingCode?: string;
};

function normalize(value: unknown, maxLength = 255) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function validatePayload(payload: IntegrationPayload) {
  return {
    google_tag_manager_id: normalize(payload.google_tag_manager_id ?? payload.gtmId),
    google_analytics_id: normalize(payload.google_analytics_id ?? payload.gaId),
    google_ads_id: normalize(payload.google_ads_id ?? payload.googleAdsId),
    facebook_pixel_id: normalize(payload.facebook_pixel_id ?? payload.facebookPixelId),
    shippo_api_key: normalize(payload.shippo_api_key ?? payload.shippoApiKey, 512),
    hotjar_tracking_code: normalize(payload.hotjar_tracking_code ?? payload.hotjarTrackingCode, 255),
  };
}

export async function GET() {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  const rows = (await prisma.$queryRawUnsafe(
    `SELECT id, google_tag_manager_id, google_analytics_id, google_ads_id, facebook_pixel_id, shippo_api_key, hotjar_tracking_code
     FROM integrations
     ORDER BY id ASC
     LIMIT 1`
  )) as Array<{
    id: number;
    google_tag_manager_id: string | null;
    google_analytics_id: string | null;
    google_ads_id: string | null;
    facebook_pixel_id: string | null;
    shippo_api_key: string | null;
    hotjar_tracking_code: string | null;
  }>;

  const row = rows[0];
  return NextResponse.json({
    ok: true,
    data: row ?? {
      google_tag_manager_id: "",
      google_analytics_id: "",
      google_ads_id: "",
      facebook_pixel_id: "",
      shippo_api_key: "",
      hotjar_tracking_code: "",
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(["admin", "staff"]);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as IntegrationPayload;
    const data = validatePayload(body);

    const current = (await prisma.$queryRawUnsafe(
      "SELECT id FROM integrations ORDER BY id ASC LIMIT 1"
    )) as Array<{ id: number }>;

    if (current.length > 0) {
      await prisma.$executeRawUnsafe(
        `UPDATE integrations
         SET google_tag_manager_id = ?,
             google_analytics_id = ?,
             google_ads_id = ?,
             facebook_pixel_id = ?,
             shippo_api_key = ?,
             hotjar_tracking_code = ?,
             updated_at = NOW()
         WHERE id = ?`,
        data.google_tag_manager_id,
        data.google_analytics_id,
        data.google_ads_id,
        data.facebook_pixel_id,
        data.shippo_api_key,
        data.hotjar_tracking_code,
        current[0].id
      );
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO integrations
         (google_tag_manager_id, google_analytics_id, google_ads_id, facebook_pixel_id, shippo_api_key, hotjar_tracking_code, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        data.google_tag_manager_id,
        data.google_analytics_id,
        data.google_ads_id,
        data.facebook_pixel_id,
        data.shippo_api_key,
        data.hotjar_tracking_code
      );
    }

    return NextResponse.json({ ok: true, message: "Saved", data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Invalid payload", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
