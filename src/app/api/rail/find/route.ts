import { getCurrentProfile } from "@/lib/auth";
import { KENYAN_SIZES } from "@/lib/taxonomy";
import { createFindRequest } from "@/lib/store";
import { findRequestMessage, whatsappHref } from "@/lib/whatsapp";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    size?: number;
    budgetMaxKes?: number;
    category?: string;
    colours?: string;
    notes?: string;
  };

  const size = Number(body.size);
  const budgetMaxKes = Number(body.budgetMaxKes ?? 0);
  const category = String(body.category ?? "Anything").trim() || "Anything";
  const colours = String(body.colours ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (!KENYAN_SIZES.includes(size as (typeof KENYAN_SIZES)[number])) {
    return NextResponse.json({ error: "Pick a size between 35 and 47." }, { status: 400 });
  }
  if (!Number.isFinite(budgetMaxKes) || budgetMaxKes < 500) {
    return NextResponse.json(
      { error: "Tell us a budget (at least KES 500)." },
      { status: 400 },
    );
  }

  const profile = await getCurrentProfile();
  const { request: find, matches } = await createFindRequest({
    profileId: profile?.id ?? null,
    size,
    budgetMaxKes,
    category,
    colours,
    notes,
  });

  const matchLine =
    matches.length === 0
      ? "Hakuna exact match right now — we will hunt."
      : matches
          .map(
            (pair) =>
              `#${pair.id} ${pair.brand} ${pair.model} · ${pair.price} · ${pair.found}`,
          )
          .join("\n");

  const message = findRequestMessage({
    size,
    budgetMaxKes,
    category,
    colours,
    notes,
    matchLine,
  });

  return NextResponse.json({
    requestId: find.id,
    matches,
    whatsappUrl: whatsappHref(message),
    message,
  });
}
