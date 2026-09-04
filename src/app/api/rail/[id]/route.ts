import { getRailPair } from "@/lib/store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const pair = await getRailPair(id);
  if (!pair) {
    return NextResponse.json({ error: "Pair not on the rail." }, { status: 404 });
  }
  return NextResponse.json({ pair });
}
