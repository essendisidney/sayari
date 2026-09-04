import { getCurrentProfile } from "@/lib/auth";
import {
  acceptRewearOffer,
  cancelRewearOffer,
  identityFor,
} from "@/lib/store";
import { rewearHandoverMessage, whatsappHref } from "@/lib/whatsapp";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { action?: string };

  try {
    if (body.action === "accept") {
      const submission = await acceptRewearOffer(profile.id, id);
      return NextResponse.json({
        submission,
        identity: await identityFor(profile),
        whatsappUrl: whatsappHref(
          rewearHandoverMessage({
            sayariId: profile.sayariId,
            brand: submission.brand,
            model: submission.model,
            size: submission.size,
            creditKes: submission.creditKes,
            rewearId: submission.id,
          }),
        ),
      });
    }
    if (body.action === "cancel") {
      const submission = await cancelRewearOffer(profile.id, id);
      return NextResponse.json({
        submission,
        identity: await identityFor(profile),
      });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update." },
      { status: 400 },
    );
  }
}
