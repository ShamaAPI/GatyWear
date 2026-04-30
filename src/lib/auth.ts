import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type AdminSessionRole = "admin" | "staff";

type SessionPayload = {
  userId: number;
  role: AdminSessionRole;
  exp: number;
};

export const ADMIN_SESSION_COOKIE_NAME = "gw_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

function getAuthSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV !== "production") {
    return "gaty-wear-dev-insecure-secret";
  }

  if (!secret) {
    throw new Error("Missing AUTH_SESSION_SECRET");
  }
  return secret;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function createSessionToken(userId: number, role: AdminSessionRole) {
  const payload: SessionPayload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };

  const header = { alg: "HS256", typ: "JWT" as const };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const content = `${encodedHeader}.${encodedPayload}`;
  const signature = sign(content);
  return `${content}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`);

  const incoming = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");
  if (incoming.length !== expected.length) return null;
  if (!timingSafeEqual(incoming, expected)) return null;

  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader)) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!payload?.userId || !payload?.role || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const isHttpsSite = siteUrl.startsWith("https://");
  const useSecureCookie = process.env.NODE_ENV === "production" ? isHttpsSite : false;

  return {
    httpOnly: true,
    secure: useSecureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  } as const;
}

export async function setAdminSessionCookie(userId: number, role: AdminSessionRole) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, createSessionToken(userId, role), getSessionCookieOptions());
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}
