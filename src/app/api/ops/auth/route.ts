import { clearOpsSession, isOpsAuthed, setOpsSession, verifyOpsPin } from "@/lib/ops";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: await isOpsAuthed() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { pin?: string; action?: string };
  if (body.action === "logout") {
    await clearOpsSession();
    return NextResponse.json({ ok: false });
  }
  if (!verifyOpsPin(body.pin ?? "")) {
    return NextResponse.json({ error: "Wrong pin." }, { status: 401 });
  }
  await setOpsSession();
  return NextResponse.json({ ok: true });
}
