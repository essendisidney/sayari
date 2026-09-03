import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { identityFor, removeClosetItem } from "@/lib/store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const { id } = await params;
  const removed = await removeClosetItem(profile.id, id);
  if (!removed) {
    return NextResponse.json({ error: "Pair not found." }, { status: 404 });
  }
  const fresh = await getCurrentProfile();
  return NextResponse.json(await identityFor(fresh ?? profile));
}
