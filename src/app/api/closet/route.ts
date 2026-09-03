import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { CLOSET_USAGE, COMMUNITIES, KENYAN_SIZES } from "@/lib/taxonomy";
import { addClosetItem, identityFor, listCloset } from "@/lib/store";
import type { ClosetUsage } from "@/lib/types";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json({ items: await listCloset(profile.id) });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const category =
    typeof body.category === "string" ? body.category.trim() : "";
  const usage = typeof body.usage === "string" ? body.usage.trim() : "";
  const boughtOn =
    typeof body.boughtOn === "string" ? body.boughtOn.trim() : "";
  const size = Number(body.size ?? profile.shoeSize);

  if (name.length < 2 || brand.length < 2) {
    return NextResponse.json(
      { error: "Name and brand are required." },
      { status: 400 },
    );
  }
  if (!(COMMUNITIES as readonly string[]).includes(category)) {
    return NextResponse.json({ error: "Pick a category." }, { status: 400 });
  }
  if (!(CLOSET_USAGE as readonly string[]).includes(usage)) {
    return NextResponse.json({ error: "Pick how you wear it." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}$/.test(boughtOn)) {
    return NextResponse.json(
      { error: "Bought month should look like 2026-06." },
      { status: 400 },
    );
  }
  if (!(KENYAN_SIZES as readonly number[]).includes(size)) {
    return NextResponse.json({ error: "Size looks off." }, { status: 400 });
  }

  await addClosetItem({
    profileId: profile.id,
    name,
    brand,
    size,
    category,
    boughtOn,
    usage: usage as ClosetUsage,
  });
  const fresh = await getCurrentProfile();
  return NextResponse.json(await identityFor(fresh ?? profile));
}
