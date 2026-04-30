import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE_NAME = "gw_admin_session";
const ADMIN_ROLES = new Set(["admin", "staff"]);

type JwtPayload = {
  userId: number;
  role: string;
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV !== "production") return "gaty-wear-dev-insecure-secret";
  return secret ?? "";
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

async function verifyJwtHmac(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const content = `${encodedHeader}.${encodedPayload}`;
  const secret = getAuthSecret();
  if (!secret) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const signatureBytes = Uint8Array.from(decodeBase64Url(signature), (char) => char.charCodeAt(0));
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(content)
  );

  if (!isValid) return null;

  try {
    const header = JSON.parse(decodeBase64Url(encodedHeader)) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") return null;

    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as JwtPayload;
    if (!payload?.userId || !payload?.role || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!ADMIN_ROLES.has(payload.role)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (!isAdminPage || isAdminLogin) return NextResponse.next();

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = await verifyJwtHmac(sessionToken);
  if (!session) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

