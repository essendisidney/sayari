"use client";

import { RailCard } from "@/components/rail-card";
import type { RailPair } from "@/lib/lookbook";
import { KENYAN_SIZES } from "@/lib/taxonomy";
import { useMemo, useState } from "react";

export function RailSection({ pairs }: { pairs: RailPair[] }) {
  const [size, setSize] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (size === null) return pairs;
    return pairs.filter((pair) => pair.size === size);
  }, [pairs, size]);

  return (
    <section id="rail" className="border-b border-line">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="sayari-label">Today on the rail</p>
            <h2 className="mt-2 font-display text-5xl uppercase tracking-wide sm:text-6xl">
              Found objects.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Pre-loved. Properly checked. Priced in KES. One pair each — when
            it&apos;s gone, it&apos;s gone.
          </p>
        </div>

        <div className="mt-10">
          <p className="sayari-label">What&apos;s your size?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="size-chip !min-w-[64px] text-[10px] uppercase tracking-[0.1em]"
              data-active={size === null}
              onClick={() => setSize(null)}
            >
              All
            </button>
            {KENYAN_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className="size-chip"
                data-active={size === s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {size !== null ? (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {filtered.length === 0
                ? `Hakuna size ${size} on the rail right now — WhatsApp us.`
                : `${filtered.length} pair${filtered.length === 1 ? "" : "s"} in size ${size}`}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((pair) => (
            <RailCard key={pair.id} pair={pair} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 border border-dashed border-ink/30 bg-bone px-6 py-10 text-center">
            <p className="font-display text-3xl uppercase tracking-wide">
              Empty rail for {size}
            </p>
            <p className="mt-2 text-sm text-muted">
              Tell Sayari on WhatsApp. We hunt.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
