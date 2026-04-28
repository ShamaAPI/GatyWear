import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Admin orders API placeholder",
    data: [],
  });
}

export async function PATCH() {
  return NextResponse.json({
    ok: true,
    message: "Admin order status update placeholder",
  });
}
