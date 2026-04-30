import { headers } from "next/headers";

export async function getApiBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}
