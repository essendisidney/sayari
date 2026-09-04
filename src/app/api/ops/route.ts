import { isOpsAuthed } from "@/lib/ops";
import {
  addRailPairManual,
  confirmRewearIntake,
  declineRewear,
  featureSpotted,
  listAllOrders,
  listAllRewear,
  listRail,
  listSpotted,
  markRailSold,
  updateOrderStatus,
} from "@/lib/store";
import { COMMUNITIES, KENYAN_SIZES } from "@/lib/taxonomy";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isOpsAuthed())) {
    return NextResponse.json({ error: "Ops lock." }, { status: 401 });
  }
  const [rewear, rail, orders, spotted] = await Promise.all([
    listAllRewear(),
    listRail(),
    listAllOrders(),
    listSpotted(),
  ]);
  return NextResponse.json({
    rewear,
    rail: rail.slice(0, 40),
    orders: orders.slice(0, 40),
    spotted: spotted.slice(0, 30),
  });
}

export async function POST(request: Request) {
  if (!(await isOpsAuthed())) {
    return NextResponse.json({ error: "Ops lock." }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: string;
    rewearId?: string;
    railId?: string;
    orderId?: string;
    postId?: string;
    status?: "READY" | "COLLECTED" | "CANCELLED";
    pair?: {
      brand?: string;
      model?: string;
      size?: number;
      category?: string;
      grade?: string;
      gradeScore?: string;
      found?: string;
      priceKes?: number;
      image?: string;
      story?: string;
    };
  };

  try {
    if (body.action === "confirm" && body.rewearId) {
      return NextResponse.json(await confirmRewearIntake(body.rewearId));
    }
    if (body.action === "decline" && body.rewearId) {
      return NextResponse.json({ submission: await declineRewear(body.rewearId) });
    }
    if (body.action === "order-status" && body.orderId && body.status) {
      return NextResponse.json({
        order: await updateOrderStatus(body.orderId, body.status),
      });
    }
    if (body.action === "feature" && body.postId) {
      return NextResponse.json({ post: await featureSpotted(body.postId) });
    }
    if (body.action === "sold" && body.railId) {
      const pair = await markRailSold(body.railId);
      if (!pair) {
        return NextResponse.json({ error: "Pair missing." }, { status: 404 });
      }
      return NextResponse.json({ pair });
    }
    if (body.action === "add" && body.pair) {
      const size = Number(body.pair.size);
      const priceKes = Number(body.pair.priceKes);
      if (!KENYAN_SIZES.includes(size as (typeof KENYAN_SIZES)[number])) {
        return NextResponse.json({ error: "Bad size." }, { status: 400 });
      }
      if (!Number.isFinite(priceKes) || priceKes < 500) {
        return NextResponse.json({ error: "Bad price." }, { status: 400 });
      }
      const category = body.pair.category ?? "Sneakers";
      if (!(COMMUNITIES as readonly string[]).includes(category)) {
        return NextResponse.json({ error: "Bad lane." }, { status: 400 });
      }
      const pair = await addRailPairManual({
        brand: String(body.pair.brand ?? ""),
        model: String(body.pair.model ?? ""),
        size,
        category,
        grade: String(body.pair.grade ?? "Very Good"),
        gradeScore: String(body.pair.gradeScore ?? "8/10"),
        found: String(body.pair.found ?? "Nairobi"),
        priceKes,
        image: String(body.pair.image ?? ""),
        story: String(body.pair.story ?? ""),
      });
      return NextResponse.json({ pair });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ops failed." },
      { status: 400 },
    );
  }
}
