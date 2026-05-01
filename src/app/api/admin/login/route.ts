import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getEmergencyAdminSession,
  isDatabaseUnavailable,
  isEmergencyAdminLogin,
} from "@/lib/dbFallback";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/auth";
import { isRateLimited } from "@/lib/rateLimit";

type LoginPayload = {
  email: string;
  password: string;
};

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let email = "";
  let password = "";

  try {
    const body = (await request.json()) as LoginPayload;
    email = body.email?.trim().toLowerCase() ?? "";
    password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: "يرجى إدخال البريد وكلمة المرور" }, { status: 400 });
    }

    const rateKey = `${getClientIp(request)}:${email}`;
    if (isRateLimited(rateKey)) {
      return NextResponse.json({ ok: false, message: "محاولات كثيرة، حاول لاحقًا" }, { status: 429 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ ok: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ ok: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      createSessionToken(user.id, user.role),
      getSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    if (isDatabaseUnavailable(error) && email && password && isEmergencyAdminLogin(email, password)) {
      const fallbackUser = getEmergencyAdminSession();
      const response = NextResponse.json({
        ok: true,
        data: fallbackUser,
        fallback: true,
      });
      response.cookies.set(
        ADMIN_SESSION_COOKIE_NAME,
        createSessionToken(fallbackUser.id, fallbackUser.role),
        getSessionCookieOptions(),
      );
      return response;
    }

    return NextResponse.json(
      {
        ok: false,
        message: "حدث خطأ أثناء تسجيل الدخول",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
