import { FoundDesk } from "@/components/found-desk";
import {
  allFoundNodes,
  emptyCounts,
  type PlaceCounts,
} from "@/lib/found-geo";
import { listRail, listSpotted } from "@/lib/store";
import type { RailPair, SpottedPost } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ place?: string }>;
};

export default async function FoundPage({ searchParams }: Props) {
  const params = await searchParams;
  const [pairs, spotted] = await Promise.all([listRail({}), listSpotted()]);
  const nodes = allFoundNodes();

  const counts: Record<string, PlaceCounts> = {};
  const pairsByPlace: Record<string, RailPair[]> = {};
  for (const node of nodes) {
    counts[node.place] = emptyCounts();
    pairsByPlace[node.place] = [];
  }

  for (const pair of pairs) {
    if (!counts[pair.found]) {
      counts[pair.found] = emptyCounts();
      pairsByPlace[pair.found] = [];
    }
    const bucket = counts[pair.found];
    bucket.total += 1;
    if (pair.status === "FOUND") bucket.found += 1;
    else if (pair.status === "HOLD") bucket.hold += 1;
    else if (pair.status === "SOLD") bucket.sold += 1;
    pairsByPlace[pair.found].push(pair);
  }

  const spottedByPlace: Record<string, SpottedPost[]> = {};
  for (const post of spotted) {
    if (!spottedByPlace[post.neighbourhood]) {
      spottedByPlace[post.neighbourhood] = [];
    }
    spottedByPlace[post.neighbourhood].push(post);
  }

  const liveHoods = nodes.filter((n) => (counts[n.place]?.found ?? 0) > 0).length;

  return (
    <main className="flex-1 pb-16 sm:pb-0">
      <section className="border-b border-ink bg-ink text-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10 sm:py-14">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            Provenance
          </p>
          <h1 className="mt-3 font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
            The Sayari Map
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-bone/70">
            Every pair has a place it came from. Tap a neighbourhood — see
            what&apos;s on the rail, what&apos;s gone, and what the city is
            wearing.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/45">
            {liveHoods} neighbourhoods lit · schematic · not to scale
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-10 sm:py-14">
        <FoundDesk
          nodes={nodes}
          counts={counts}
          pairsByPlace={pairsByPlace}
          spottedByPlace={spottedByPlace}
          initialPlace={params.place ?? null}
        />

        <div className="mt-12 flex flex-wrap gap-4 border-t border-ink pt-8">
          <Link href="/rail" className="sayari-btn-tag">
            Full rail →
          </Link>
          <Link
            href="/find"
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] hover:text-nairobi"
          >
            Niko na size…
          </Link>
          <Link
            href="/spotted"
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted hover:text-nairobi"
          >
            Spotted in Nairobi
          </Link>
        </div>
      </section>
    </main>
  );
}
