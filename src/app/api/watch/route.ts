import { getCurrentProfile } from "@/lib/auth";
import {
  createSizeWatch,
  deactivateSizeWatch,
  listRail,
  listSizeWatches,
} from "@/lib/store";
import { liveMatchesForWatch } from "@/lib/size-watch";
import { KENYAN_SIZES } from "@/lib/taxonomy";
import { armSizeWatchMessage, whatsappHref } from "@/lib/whatsapp";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const [watches, rail] = await Promise.all([
    listSizeWatches(profile.id),
    listRail({ status: "AVAILABLE" }),
  ]);
  const enriched = watches.map((watch) => ({
    watch,
    live: liveMatchesForWatch(rail, watch).slice(0, 6),
  }));
  return NextResponse.json({ watches: enriched, shoeSize: profile.shoeSize });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    size?: number;
    category?: string | null;
    budgetMaxKes?: number | null;
    query?: string | null;
    guest?: boolean;
  };

  const size = Number(body.size);
  if (!KENYAN_SIZES.includes(size as (typeof KENYAN_SIZES)[number])) {
    return NextResponse.json({ error: "Pick a real size." }, { status: 400 });
  }

  const budgetMaxKes =
    body.budgetMaxKes != null && Number.isFinite(Number(body.budgetMaxKes))
      ? Number(body.budgetMaxKes)
      : null;

  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({
      login: "/id/login?next=/watch",
      whatsappUrl: whatsappHref(
        armSizeWatchMessage({
          size,
          category: body.category,
          budgetMaxKes,
          query: body.query,
        }),
      ),
    });
  }

  try {
    const watch = await createSizeWatch({
      profileId: profile.id,
      size,
      category: body.category ?? null,
      budgetMaxKes,
      query: body.query ?? null,
    });
    return NextResponse.json({ watch });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not arm watch." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Missing watch id." }, { status: 400 });
  }
  const ok = await deactivateSizeWatch(profile.id, body.id);
  if (!ok) {
    return NextResponse.json({ error: "Watch not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
