import { persistenceMode } from "@/lib/persist";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    persistence: persistenceMode(),
    product: "sayari",
  });
}
