import { getCurrentIdentity, getCurrentProfile } from "@/lib/auth";
import { FOUND_PLACES } from "@/lib/lookbook";
import { REWEAR_GRADES, type RewearGradeId } from "@/lib/rewear";
import { COMMUNITIES, KENYAN_SIZES } from "@/lib/taxonomy";
import { createRewearOffer, identityFor } from "@/lib/store";
import type { ClosetUsage } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json({ rewear: identity.rewear });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in to ReWear." }, { status: 401 });
  }

  const body = (await request.json()) as {
    closetItemId?: string;
    brand?: string;
    model?: string;
    size?: number;
    category?: string;
    gradeId?: string;
    foundNeighbourhood?: string;
    imageUrl?: string;
    notes?: string;
    usage?: ClosetUsage;
  };

  const brand = String(body.brand ?? "").trim();
  const model = String(body.model ?? "").trim();
  const size = Number(body.size);
  const category = String(body.category ?? "Sneakers");
  const gradeId = String(body.gradeId ?? "B") as RewearGradeId;
  const foundNeighbourhood = String(body.foundNeighbourhood ?? "Nairobi").trim();
  const imageUrl = String(body.imageUrl ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (!brand || !model) {
    return NextResponse.json({ error: "Brand and model required." }, { status: 400 });
  }
  if (!KENYAN_SIZES.includes(size as (typeof KENYAN_SIZES)[number])) {
    return NextResponse.json({ error: "Pick a size 35–47." }, { status: 400 });
  }
  if (!REWEAR_GRADES.some((row) => row.id === gradeId)) {
    return NextResponse.json({ error: "Pick a grade." }, { status: 400 });
  }
  if (
    foundNeighbourhood &&
    !(FOUND_PLACES as readonly string[]).includes(foundNeighbourhood) &&
    foundNeighbourhood !== "Nairobi"
  ) {
    // allow free text neighbourhoods too — only warn via accepting any string
  }
  if (!(COMMUNITIES as readonly string[]).includes(category)) {
    return NextResponse.json({ error: "Pick a lane." }, { status: 400 });
  }

  try {
    const submission = await createRewearOffer({
      profileId: profile.id,
      closetItemId: body.closetItemId || null,
      brand,
      model,
      size,
      category,
      gradeId,
      usage: body.usage ?? null,
      foundNeighbourhood: foundNeighbourhood || "Nairobi",
      imageUrl,
      notes,
    });
    const identity = await identityFor(profile);
    return NextResponse.json({ submission, identity });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not estimate." },
      { status: 400 },
    );
  }
}
