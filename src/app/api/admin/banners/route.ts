import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Admin banners API placeholder",
    data: [],
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Admin create banner placeholder",
  });
}
