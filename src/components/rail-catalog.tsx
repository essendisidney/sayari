"use client";

import { RailCard } from "@/components/rail-card";
import { FOUND_PLACES } from "@/lib/lookbook";
import { COMMUNITIES, KENYAN_SIZES } from "@/lib/taxonomy";
import type { RailPair } from "@/lib/types";
import { useMemo, useState } from "react";

type Props = {
  pairs: RailPair[];
  defaultSize?: number | null;
};

export function RailCatalog({ pairs, defaultSize = null }: Props) {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState<number | null>(defaultSize);
  const [category, setCategory] = useState("Anything");
  const [found, setFound] = useState("Anywhere");
  const [budgetMax, setBudgetMax] = useState(20000);
  const [availableOnly, setAvailableOnly] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pairs.filter((pair) => {
      if (availableOnly && pair.status === "SOLD") return false;
      if (availableOnly && pair.status === "HOLD") return false;
      if (size != null && pair.size !== size) return false;
      if (category !== "Anything" && pair.category !== category) return false;
      if (found !== "Anywhere" && pair.found !== found) return false;
      if (pair.priceKes > budgetMax) return false;
      if (q) {
        const hay =
          `${pair.brand} ${pair.model} ${pair.found} ${pair.id} ${pair.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [pairs, query, size, category, found, budgetMax, availableOnly]);

  return (
    <div>
      <div className="rail-tag space-y-5 p-5 sm:p-6">
        <div>
          <label className="sayari-label" htmlFor="rail-q">
            Search the rail
          </label>
          <input
            id="rail-q"
            className="sayari-input mt-1"
            placeholder="Nike · Samba · Kilimani · NBO-024"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div>
          <p className="sayari-label">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="size-chip !min-w-[56px] text-[10px] uppercase"
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
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="sayari-label">Lane</span>
            <select
              className="sayari-input mt-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Anything">Anything</option>
              {COMMUNITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sayari-label">Found in</span>
            <select
              className="sayari-input mt-1"
              value={found}
              onChange={(e) => setFound(e.target.value)}
            >
              <option value="Anywhere">Anywhere</option>
              {FOUND_PLACES.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sayari-label">
              Max KES {budgetMax.toLocaleString("en-KE")}
            </span>
            <input
              className="mt-3 w-full accent-nairobi"
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Only FOUND pairs (hide hold / sold)
        </label>
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {filtered.length} pair{filtered.length === 1 ? "" : "s"} on the rail
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 border border-dashed border-ink/30 bg-bone px-6 py-10 text-center">
          <p className="font-display text-3xl uppercase tracking-wide">
            Empty for that filter
          </p>
          <p className="mt-2 text-sm text-muted">
            Loosen size or budget — or WhatsApp Find.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((pair) => (
            <RailCard key={pair.id} pair={pair} />
          ))}
        </div>
      )}
    </div>
  );
}
