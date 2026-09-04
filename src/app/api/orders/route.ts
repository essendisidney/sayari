import { getCurrentProfile } from "@/lib/auth";
import { isPickupSpot } from "@/lib/commerce";
import {
  cancelOrder,
  createReservation,
  getOrder,
  identityFor,
  listOrders,
  payOrder,
} from "@/lib/store";
import { grabPairMessage, whatsappHref } from "@/lib/whatsapp";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders(profile.id) });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json(
      { error: "Sign in to reserve.", login: "/id/login?next=/id" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    action?: string;
    railId?: string;
    orderId?: string;
    pickup?: string;
    useCredit?: boolean;
    mpesaPhone?: string;
  };

  try {
    if (body.action === "reserve") {
      const pickup = String(body.pickup ?? "Westlands");
      if (!isPickupSpot(pickup)) {
        return NextResponse.json({ error: "Pick a pickup spot." }, { status: 400 });
      }
      const order = await createReservation({
        profileId: profile.id,
        railId: String(body.railId ?? ""),
        pickup,
        useCredit: Boolean(body.useCredit),
      });
      return NextResponse.json({
        order,
        identity: await identityFor(profile),
        whatsappUrl: whatsappHref(
          grabPairMessage({
            id: order.railId,
            brand: order.brand,
            model: order.model,
            size: order.size,
            price: `KES ${order.priceKes.toLocaleString("en-KE")}`,
            found: order.pickup,
          }) + `\nOrder ${order.code} · reserved 6hrs`,
        ),
      });
    }

    if (body.action === "pay" && body.orderId) {
      const order = await payOrder({
        profileId: profile.id,
        orderId: body.orderId,
        useCredit: body.useCredit !== false,
        mpesaPhone: body.mpesaPhone,
      });
      return NextResponse.json({
        order,
        identity: await identityFor(profile),
      });
    }

    if (body.action === "cancel" && body.orderId) {
      const order = await cancelOrder(profile.id, body.orderId);
      return NextResponse.json({
        order,
        identity: await identityFor(profile),
      });
    }

    if (body.action === "get" && body.orderId) {
      const order = await getOrder(body.orderId);
      if (!order || order.profileId !== profile.id) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Order failed." },
      { status: 400 },
    );
  }
}
