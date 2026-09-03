import { NextResponse } from "next/server";
import { setSessionCookie, verifyOtp } from "@/lib/auth";
import { normalizeKenyanPhone } from "@/lib/phone";

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: string; code?: string };
  const phone = normalizeKenyanPhone(body.phone ?? "");
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!phone) {
    return NextResponse.json(
      { error: "Use a Kenyan mobile number." },
      { status: 400 },
    );
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }
  try {
    const result = await verifyOtp(phone, code);
    await setSessionCookie(result.token);
    return NextResponse.json({
      ok: true,
      sayariId: result.profile.sayariId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not verify that.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
