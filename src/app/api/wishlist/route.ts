import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { addWishlistItem, identityFor, listWishlist } from "@/lib/store";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json({ items: await listWishlist(profile.id) });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  if (name.length < 2) {
    return NextResponse.json({ error: "Name the pair you want." }, { status: 400 });
  }
  await addWishlistItem({ profileId: profile.id, name, notes });
  const fresh = await getCurrentProfile();
  return NextResponse.json(await identityFor(fresh ?? profile));
}
