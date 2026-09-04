import type { RailPair } from "@/lib/lookbook";
import Image from "next/image";
import Link from "next/link";

export function RailCard({ pair }: { pair: RailPair }) {
  return (
    <Link href="/join" className="rail-tag block overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2">
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
          Sayari · Rail #{pair.id}
        </span>
        <span
          className={`stamp !py-0.5 !text-[8px] ${
            pair.status === "HOLD"
              ? "stamp-market"
              : pair.status === "SOLD"
                ? "stamp-sold"
                : ""
          }`}
        >
          {pair.status}
        </span>
      </div>

      <div className="relative aspect-[4/5] bg-chip">
        <Image
          src={pair.image}
          alt={`${pair.brand} ${pair.model}`}
          fill
          className="object-cover"
        />
        <span className="price-sticker absolute bottom-3 right-3">
          {pair.price}
        </span>
      </div>

      <div className="space-y-3 px-3 py-3">
        <div>
          <p className="font-display text-2xl uppercase leading-none tracking-wide">
            {pair.brand}
          </p>
          <p className="mt-1 text-sm text-muted">{pair.model}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
          <div>
            <p className="text-muted">Size</p>
            <p className="mt-0.5 font-semibold">{pair.size}</p>
          </div>
          <div>
            <p className="text-muted">Grade</p>
            <p className="mt-0.5 font-semibold">{pair.gradeScore}</p>
          </div>
          <div>
            <p className="text-muted">Found</p>
            <p className="mt-0.5 font-semibold">{pair.found}</p>
          </div>
          <div>
            <p className="text-muted">Last seen</p>
            <p className="mt-0.5 font-semibold">{pair.lastSeen}</p>
          </div>
        </div>

        <p className="border-t border-dashed border-ink/20 pt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-nairobi">
          One pair only · No restock
        </p>
      </div>
    </Link>
  );
}
