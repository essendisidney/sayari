import { RailCard } from "@/components/rail-card";
import type { PlaceCounts } from "@/lib/found-geo";
import type { RailPair, SpottedPost } from "@/lib/types";
import { nearPlaceMessage, whatsappHref } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";

type Props = {
  place: string;
  blurb: string;
  counts: PlaceCounts;
  pairs: RailPair[];
  spotted: SpottedPost[];
};

export function FoundPlacePanel({
  place,
  blurb,
  counts,
  pairs,
  spotted,
}: Props) {
  const live = pairs.filter((p) => p.status !== "SOLD").slice(0, 4);
  const wa = whatsappHref(nearPlaceMessage(place));

  return (
    <div className="space-y-6">
      <div className="border border-ink bg-bone p-5 sm:p-6">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-nairobi">
          Found —
        </p>
        <h2 className="mt-2 font-display text-4xl uppercase tracking-wide sm:text-5xl">
          {place}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{blurb}</p>

        <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
          <Stat label="On rail" value={String(counts.found)} hot />
          <Stat label="Hold" value={String(counts.hold)} />
          <Stat label="Gone" value={String(counts.sold)} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/rail?found=${encodeURIComponent(place)}`}
            className="sayari-btn-tag"
          >
            Shop {place} →
          </Link>
          <a href={wa} target="_blank" rel="noreferrer" className="sayari-btn-ghost">
            Looking near {place}
          </a>
          <Link
            href={`/find`}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted hover:text-nairobi"
          >
            Niko na size…
          </Link>
        </div>
      </div>

      {live.length > 0 ? (
        <div>
          <p className="sayari-label">On the rail from here</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {live.map((pair) => (
              <RailCard key={pair.id} pair={pair} />
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-ink/40 bg-paper p-6">
          <p className="font-display text-2xl uppercase tracking-wide">
            Nothing live here right now.
          </p>
          <p className="mt-2 text-sm text-muted">
            Gone is gone. Tell Sayari what you want from {place} — we&apos;ll
            watch the rail.
          </p>
          <a href={wa} target="_blank" rel="noreferrer" className="sayari-btn mt-5 inline-flex">
            WhatsApp this hood
          </a>
        </div>
      )}

      {spotted.length > 0 ? (
        <div>
          <p className="sayari-label">Spotted — {place}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {spotted.slice(0, 4).map((post) => (
              <Link
                key={post.id}
                href="/spotted"
                className="rail-tag flex gap-3 overflow-hidden p-2"
              >
                <div className="relative h-20 w-20 shrink-0 bg-chip">
                  <Image
                    src={post.imageUrl}
                    alt={post.caption}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 py-1 pr-2">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-nairobi">
                    {post.lane}
                  </p>
                  <p className="mt-1 truncate font-display text-lg uppercase tracking-wide">
                    {post.displayName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {post.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  hot,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className="border border-ink/20 bg-paper px-3 py-3">
      <p className="text-muted">{label}</p>
      <p
        className={`mt-1 text-lg font-bold ${hot ? "text-nairobi" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}
