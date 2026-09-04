import { listRail } from "@/lib/store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sizeRaw = searchParams.get("size");
  const budgetRaw = searchParams.get("budget");
  const category = searchParams.get("category");
  const found = searchParams.get("found");
  const query = searchParams.get("q");

  const size = sizeRaw ? Number(sizeRaw) : null;
  const budgetMaxKes = budgetRaw ? Number(budgetRaw) : null;

  const pairs = await listRail({
    size: Number.isFinite(size) ? size : null,
    budgetMaxKes: Number.isFinite(budgetMaxKes) ? budgetMaxKes : null,
    category: category || null,
    found: found || null,
    query: query || null,
  });

  return NextResponse.json({ pairs });
}
