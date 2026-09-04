import type { RailPair } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export function RailCard({ pair }: { pair: RailPair }) {
  const gone = pair.status === "SOLD";

  return (
    <Link
      href={`/rail/${pair.id}`}
      className={`rail-tag block overflow-hidden ${gone ? "opacity-85" : ""}`}
    >
      <div className="flex items-center justify-between border-b border-dashed border-ink/25 px-3 py-2">
        <div>
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-muted">
            Sayari
          </p>
          <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
            Rail #{pair.id}
          </p>
        </div>
        <span
          className={`stamp !py-0.5 !text-[8px] ${
            pair.status === "HOLD"
              ? "stamp-market"
              : gone
                ? "stamp-sold"
                : ""
          }`}
        >
          {gone ? "GONE" : pair.status === "HOLD" ? "HOLD" : "FOUND"}
        </span>
      </div>

      <div className="relative aspect-[4/5] bg-chip">
        <Image
          src={pair.image}
          alt={`${pair.brand} ${pair.model}`}
          fill
          className={`object-cover ${gone ? "grayscale" : ""}`}
        />
      </div>

      <div className="space-y-3 px-3 py-3">
        <div>
          <p className="font-display text-2xl uppercase leading-none tracking-wide">
            {pair.brand}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            {pair.model}
          </p>
        </div>

        {gone ? (
          <p className="border-t border-dashed border-ink/20 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {pair.id} found a new home.
          </p>
        ) : (
          <>
            <div className="flex items-end justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              <div>
                <p className="text-[9px] text-muted">Size</p>
                <p className="mt-0.5 font-bold">{pair.size}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-muted">Grade</p>
                <p className="mt-0.5 font-bold">{pair.gradeScore}</p>
              </div>
            </div>

            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-nairobi">
              Found — {pair.found}
            </p>

            <div className="flex items-center justify-between gap-2 border-t border-dashed border-ink/20 pt-3">
              <span className="price-sticker !rotate-0 !px-2 !py-1 !text-[12px]">
                {pair.price}
              </span>
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">
                One pair only
                <br />
                No restock
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
