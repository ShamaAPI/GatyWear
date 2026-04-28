import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Cart API placeholder",
    data: null,
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Cart update placeholder",
  });
}
