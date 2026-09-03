import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/auth";
import { normalizeKenyanPhone } from "@/lib/phone";

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: string };
  const phone = normalizeKenyanPhone(body.phone ?? "");
  if (!phone) {
    return NextResponse.json(
      { error: "Use a Kenyan mobile number." },
      { status: 400 },
    );
  }
  try {
    const issued = await issueOtp(phone);
    return NextResponse.json({
      ok: true,
      phone,
      sayariId: issued.profile.sayariId,
      devCode: issued.devCode,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send a code.";
    const status = message.includes("Join") ? 404 : 429;
    return NextResponse.json({ error: message }, { status });
  }
}
