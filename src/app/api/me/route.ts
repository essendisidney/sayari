import { NextResponse } from "next/server";
import { getCurrentIdentity, getCurrentProfile } from "@/lib/auth";
import { GENDER_PREFERENCES } from "@/lib/taxonomy";
import { identityFor, updateGender } from "@/lib/store";
import type { GenderPreference } from "@/lib/types";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json(identity);
}

export async function PATCH(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const body = (await request.json()) as { genderPreference?: string };
  const gender = body.genderPreference;
  if (
    !gender ||
    !(GENDER_PREFERENCES as readonly string[]).includes(gender)
  ) {
    return NextResponse.json({ error: "Pick a preference." }, { status: 400 });
  }
  const updated = await updateGender(profile.id, gender as GenderPreference);
  if (!updated) {
    return NextResponse.json({ error: "Profile missing." }, { status: 404 });
  }
  return NextResponse.json(await identityFor(updated));
}
