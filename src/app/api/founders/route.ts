import { createFounder, getFounderCount } from "@/lib/founders";
import { normalizeKenyanPhone } from "@/lib/phone";
import { BUDGET_BANDS, BUY_FREQUENCIES, COMMUNITIES } from "@/lib/taxonomy";
import { NextResponse } from "next/server";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: unknown) {
  return value === true;
}

export async function GET() {
  const count = await getFounderCount();
  return NextResponse.json({ count });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = asString(body.name);
  const phone = normalizeKenyanPhone(asString(body.phone));
  const shoeSize = Number(body.shoeSize);
  const categories = Array.isArray(body.categories)
    ? body.categories.filter(
        (item): item is string =>
          typeof item === "string" &&
          (COMMUNITIES as readonly string[]).includes(item),
      )
    : [];
  const favouriteBrands = asString(body.favouriteBrands);
  const buyFrequency = asString(body.buyFrequency);
  const budgetBand = asString(body.budgetBand);
  const currentShops = asString(body.currentShops);
  const frustration = asString(body.frustration);

  if (name.length < 2) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json(
      { error: "Use a Kenyan mobile number." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(shoeSize) || shoeSize < 35 || shoeSize > 47) {
    return NextResponse.json({ error: "Size looks off." }, { status: 400 });
  }
  if (categories.length === 0) {
    return NextResponse.json(
      { error: "Pick at least one community." },
      { status: 400 },
    );
  }
  if (!favouriteBrands) {
    return NextResponse.json({ error: "Tell us your brands." }, { status: 400 });
  }
  if (!(BUY_FREQUENCIES as readonly string[]).includes(buyFrequency)) {
    return NextResponse.json({ error: "Frequency is invalid." }, { status: 400 });
  }
  if (!(BUDGET_BANDS as readonly string[]).includes(budgetBand)) {
    return NextResponse.json({ error: "Budget is invalid." }, { status: 400 });
  }
  if (!currentShops || !frustration) {
    return NextResponse.json(
      { error: "Shopping habits help us build this." },
      { status: 400 },
    );
  }

  try {
    const member = await createFounder({
      name,
      phone,
      shoeSize,
      categories,
      favouriteBrands,
      buyFrequency,
      budgetBand,
      currentShops,
      frustration,
      wouldTrade: asBoolean(body.wouldTrade),
      wantsRecommendations: asBoolean(body.wantsRecommendations),
    });
    return NextResponse.json({
      foundingNumber: member.foundingNumber,
      foundingTier: member.foundingTier,
      sayariId: member.sayariId,
      phone: member.phone,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save that.";
    const status = message.includes("already") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
