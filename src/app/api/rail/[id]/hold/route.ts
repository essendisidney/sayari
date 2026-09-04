import { getCurrentProfile } from "@/lib/auth";
import { getRailPair, holdRailPair } from "@/lib/store";
import { grabPairMessage, whatsappHref } from "@/lib/whatsapp";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const profile = await getCurrentProfile();

  try {
    const existing = await getRailPair(id);
    if (!existing) {
      return NextResponse.json({ error: "Pair not on the rail." }, { status: 404 });
    }
    if (existing.status === "SOLD") {
      return NextResponse.json({ error: "Already sold." }, { status: 409 });
    }

    const pair = await holdRailPair(id, profile?.id ?? null);
    if (!pair) {
      return NextResponse.json({ error: "Could not hold that pair." }, { status: 409 });
    }

    return NextResponse.json({
      pair,
      whatsappUrl: whatsappHref(grabPairMessage(pair)),
      heldHours: 6,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Hold failed." },
      { status: 409 },
    );
  }
}
