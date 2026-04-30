import { NextResponse } from "next/server";
import { getSessionFromCookies, type AdminSessionRole } from "@/lib/auth";

export async function requireAdminSession(allowedRoles: AdminSessionRole[] = ["admin", "staff"]) {
  const session = await getSessionFromCookies();
  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!allowedRoles.includes(session.role)) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    session,
  };
}

