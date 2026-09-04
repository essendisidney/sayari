import type { RailPair } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export function RailCard({ pair }: { pair: RailPair }) {
  const gone = pair.status === "SOLD";

  return (
    <Link
      href={`/rail/${pair.id}`}
      className={`rail-tag group block overflow-hidden ${gone ? "opacity-90" : ""}`}
    >
      <div className="relative aspect-[4/5] bg-chip">
        <Image
          src={pair.image}
          alt={`${pair.brand} ${pair.model} — Found ${pair.found}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${
            gone ? "grayscale" : ""
          }`}
        />
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="bg-bone/95 px-2 py-1.5 shadow-[2px_2px_0_rgba(23,23,23,0.15)]">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
              Sayari
            </p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
              Rail #{pair.id}
            </p>
          </div>
          <span
            className={`stamp !bg-bone/95 !py-1 !text-[8px] ${
              pair.status === "HOLD"
                ? "stamp-market"
                : gone
                  ? "stamp-sold"
                  : ""
            }`}
          >
            {gone ? "GONE" : pair.status === "HOLD" ? "HOLD" : "ONE PAIR"}
          </span>
        </div>
        {!gone ? (
          <span className="price-sticker absolute bottom-3 right-3 !text-[12px]">
            {pair.price}
          </span>
        ) : null}
      </div>

      <div className="space-y-2.5 border-t border-ink px-3 py-3">
        <div>
          <h3 className="font-display text-[1.35rem] uppercase leading-none tracking-wide sm:text-2xl">
            {pair.brand} {pair.model}
          </h3>
        </div>

        {gone ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Rail #{pair.id} found a new home.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
              <p>
                <span className="text-muted">Size </span>
                <span className="font-bold">{pair.size}</span>
              </p>
              <p className="text-right">
                <span className="text-muted">Grade </span>
                <span className="font-bold">{pair.gradeScore}</span>
              </p>
            </div>

            <p className="found-mark">Found — {pair.found}</p>

            <div className="flex items-center justify-between gap-2 border-t border-dashed border-ink/25 pt-2.5">
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
                Last seen {pair.lastSeen}
              </p>
              <p className="text-right font-mono text-[8px] font-bold uppercase leading-tight tracking-[0.12em]">
                One pair only
                <br />
                No restock
              </p>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
