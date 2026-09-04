import { getCurrentProfile } from "@/lib/auth";
import { markNotificationsRead } from "@/lib/store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const count = await markNotificationsRead(profile.id);
  return NextResponse.json({ ok: true, marked: count });
}
