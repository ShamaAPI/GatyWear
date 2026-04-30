import { prisma } from "@/lib/prisma";

export type IntegrationSettings = {
  googleTagManagerId: string;
  facebookPixelId: string;
  hotjarTrackingCode: string;
};

export async function getIntegrationSettings(): Promise<IntegrationSettings> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT google_tag_manager_id, facebook_pixel_id, hotjar_tracking_code
     FROM integrations
     ORDER BY id ASC
     LIMIT 1`
  )) as Array<{
    google_tag_manager_id: string | null;
    facebook_pixel_id: string | null;
    hotjar_tracking_code: string | null;
  }>;

  const row = rows[0];

  return {
    googleTagManagerId: row?.google_tag_manager_id?.trim() ?? "",
    facebookPixelId: row?.facebook_pixel_id?.trim() ?? "",
    hotjarTrackingCode: row?.hotjar_tracking_code?.trim() ?? "",
  };
}

