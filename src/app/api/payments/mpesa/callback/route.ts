import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Safaricom Daraja STK callback target.
 * Wire SAYARI_MPESA_* secrets, then confirm payment against order.mpesaRef.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  console.info("[sayari] mpesa callback", JSON.stringify(body));

  // Acknowledge immediately — Daraja expects a fast 200.
  return NextResponse.json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: process.env.SAYARI_MPESA_SHORTCODE ? "configured" : "stub",
    hint: "POST Daraja callbacks here when live.",
  });
}
