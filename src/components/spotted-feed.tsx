"use client";

import { SPOTTED_LANES } from "@/lib/community";
import { FOUND_PLACES } from "@/lib/lookbook";
import type { SpottedPost } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Props = {
  initial: SpottedPost[];
  signedIn: boolean;
  viewerId: string | null;
};

export function SpottedFeed({ initial, signedIn, viewerId }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("Kilimani");
  const [lane, setLane] = useState<string>("Best Fit");
  const [railId, setRailId] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!signedIn) {
      router.push("/id/login?next=/spotted");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/spotted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          imageUrl,
          neighbourhood,
          lane,
          railId: railId || undefined,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        post?: SpottedPost;
      };
      if (!response.ok) throw new Error(payload.error ?? "Could not post.");
      if (payload.post) {
        setPosts((current) => [payload.post!, ...current]);
        setCaption("");
        setImageUrl("");
        setRailId("");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setPending(false);
    }
  }

  async function vote(postId: string) {
    if (!signedIn) {
      router.push("/id/login?next=/spotted");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/spotted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", postId }),
      });
      const payload = (await response.json()) as {
        error?: string;
        post?: SpottedPost;
      };
      if (!response.ok) throw new Error(payload.error ?? "Vote failed.");
      if (payload.post) {
        setPosts((current) =>
          current
            .map((row) => (row.id === payload.post!.id ? payload.post! : row))
            .sort(
              (a, b) =>
                Number(b.featured) - Number(a.featured) ||
                b.votes - a.votes,
            ),
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-12">
      <form onSubmit={submit} className="rail-tag space-y-4 p-6 sm:p-8">
        <p className="sayari-label">Submit a fit</p>
        <h2 className="font-display text-3xl uppercase tracking-wide">
          Spotted in Nairobi
        </h2>
        {!signedIn ? (
          <p className="text-sm text-muted">
            <Link href="/id/login?next=/spotted" className="underline">
              Sign in
            </Link>{" "}
            with your Sayari ID to post.
          </p>
        ) : null}
        <textarea
          className="sayari-input min-h-[80px]"
          placeholder="Caption — where you wore it, what hit"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
        <input
          className="sayari-input"
          placeholder="Photo URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="sayari-label">Neighbourhood</span>
            <select
              className="sayari-input mt-1"
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
            >
              {FOUND_PLACES.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sayari-label">Lane</span>
            <select
              className="sayari-input mt-1"
              value={lane}
              onChange={(e) => setLane(e.target.value)}
            >
              {SPOTTED_LANES.filter((item) => item !== "Shoe of the Week").map(
                (item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>
        <input
          className="sayari-input"
          placeholder="Rail # optional · NBO-041"
          value={railId}
          onChange={(e) => setRailId(e.target.value)}
        />
        {error ? <p className="text-sm text-nairobi">{error}</p> : null}
        <button type="submit" className="sayari-btn-tag" disabled={pending}>
          {pending ? "Posting…" : "Drop the fit"}
        </button>
      </form>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="rail-tag overflow-hidden">
            <div className="relative aspect-[4/5] bg-chip">
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                className="object-cover"
              />
              {post.featured ? (
                <span className="stamp absolute left-3 top-3 !bg-bone/90">
                  Shoe of the Week
                </span>
              ) : (
                <span className="absolute left-3 top-3 bg-tag px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
                  {post.lane}
                </span>
              )}
            </div>
            <div className="space-y-3 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {post.sayariId} · {post.neighbourhood}
              </p>
              <p className="font-display text-xl uppercase tracking-wide">
                {post.displayName}
              </p>
              <p className="text-sm leading-6 text-muted">{post.caption}</p>
              <div className="flex items-center justify-between gap-3">
                {post.railId ? (
                  <Link
                    href={`/rail/${post.railId}`}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] hover:text-nairobi"
                  >
                    Rail #{post.railId}
                  </Link>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.12em]"
                  disabled={pending || viewerId === post.profileId}
                  onClick={() => void vote(post.id)}
                >
                  ▲ {post.votes}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
