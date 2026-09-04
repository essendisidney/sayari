import { getCurrentProfile } from "@/lib/auth";
import { isSpottedLane } from "@/lib/community";
import { FOUND_PLACES } from "@/lib/lookbook";
import {
  createSpottedPost,
  listSpotted,
  voteSpotted,
} from "@/lib/store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await listSpotted();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: string;
    postId?: string;
    caption?: string;
    neighbourhood?: string;
    lane?: string;
    imageUrl?: string;
    railId?: string;
  };

  try {
    if (body.action === "vote" && body.postId) {
      const post = await voteSpotted(profile.id, body.postId);
      return NextResponse.json({ post });
    }

    const lane = String(body.lane ?? "Best Fit");
    if (!isSpottedLane(lane)) {
      return NextResponse.json({ error: "Pick a lane." }, { status: 400 });
    }
    const neighbourhood = String(body.neighbourhood ?? "Nairobi").trim();
    if (
      neighbourhood !== "Nairobi" &&
      !(FOUND_PLACES as readonly string[]).includes(neighbourhood)
    ) {
      // allow free-text neighbourhoods
    }

    const post = await createSpottedPost({
      profileId: profile.id,
      caption: String(body.caption ?? ""),
      neighbourhood: neighbourhood || "Nairobi",
      lane,
      imageUrl: String(body.imageUrl ?? ""),
      railId: body.railId ? String(body.railId).trim().toUpperCase() : null,
    });
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not post." },
      { status: 400 },
    );
  }
}
