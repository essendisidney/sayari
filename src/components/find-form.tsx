"use client";

import { FIND_CATEGORIES } from "@/lib/lookbook";
import { KENYAN_SIZES } from "@/lib/taxonomy";
import type { RailPair } from "@/lib/types";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type Props = {
  defaultSize?: number;
  defaultBudget?: number;
  defaultCategory?: string;
};

export function FindForm({
  defaultSize = 42,
  defaultBudget = 5000,
  defaultCategory = "Sneakers",
}: Props) {
  const [size, setSize] = useState(defaultSize);
  const [budgetMaxKes, setBudgetMaxKes] = useState(defaultBudget);
  const [category, setCategory] = useState(defaultCategory);
  const [colours, setColours] = useState("");
  const [notes, setNotes] = useState("");
  const [matches, setMatches] = useState<RailPair[] | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/rail/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, budgetMaxKes, category, colours, notes }),
      });
      const payload = (await response.json()) as {
        error?: string;
        matches?: RailPair[];
        whatsappUrl?: string;
      };
      if (!response.ok) throw new Error(payload.error ?? "Could not search the rail.");
      setMatches(payload.matches ?? []);
      setWhatsappUrl(payload.whatsappUrl ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not search the rail.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="rail-tag space-y-6 p-6 sm:p-8">
        <div>
          <p className="sayari-label">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
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

        <div>
          <label className="sayari-label" htmlFor="budget">
            Budget (KES max)
          </label>
          <input
            id="budget"
            className="sayari-input mt-1 font-mono text-lg"
            type="number"
            min={500}
            step={100}
            value={budgetMaxKes}
            onChange={(e) => setBudgetMaxKes(Number(e.target.value))}
          />
        </div>

        <div>
          <p className="sayari-label">Looking for</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FIND_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className="size-chip !min-w-0 !px-3 text-[10px] uppercase tracking-[0.1em]"
                data-active={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="sayari-label" htmlFor="colours">
            Colours
          </label>
          <input
            id="colours"
            className="sayari-input mt-1"
            placeholder="Black or white"
            value={colours}
            onChange={(e) => setColours(e.target.value)}
          />
        </div>

        <div>
          <label className="sayari-label" htmlFor="notes">
            Anything else
          </label>
          <input
            id="notes"
            className="sayari-input mt-1"
            placeholder="Wedding Saturday · low sole · no red"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-nairobi">{error}</p> : null}

        <button type="submit" className="sayari-btn" disabled={pending}>
          {pending ? "Checking the rail…" : "Sayari finds the pair"}
        </button>
      </form>

      {matches ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="sayari-label">On the rail for you</p>
              <h2 className="mt-1 font-display text-3xl uppercase tracking-wide">
                {matches.length === 0
                  ? "Hakuna exact match"
                  : `${matches.length} find${matches.length === 1 ? "" : "s"}`}
              </h2>
            </div>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sayari-btn-tag"
              >
                Open WhatsApp →
              </a>
            ) : null}
          </div>

          {matches.length === 0 ? (
            <div className="space-y-4 border border-dashed border-ink/40 bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                Hakuna exact match right now. Arm a Size Watch — we ping you
                when it lands. Gone is gone.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/watch?size=${size}&budget=${budgetMaxKes}&category=${encodeURIComponent(category)}&query=${encodeURIComponent(notes)}`}
                  className="sayari-btn-tag"
                >
                  Watch this brief →
                </Link>
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sayari-btn-ghost"
                  >
                    WhatsApp anyway
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-ink/15 border border-ink bg-bone">
              {matches.map((pair) => (
                <li key={pair.id}>
                  <Link
                    href={`/rail/${pair.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-paper"
                  >
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        Rail #{pair.id} · {pair.found}
                      </p>
                      <p className="mt-1 font-display text-xl uppercase tracking-wide">
                        {pair.brand} {pair.model}
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em]">
                        Size {pair.size} · {pair.gradeScore} · {pair.status}
                      </p>
                    </div>
                    <span className="price-sticker !rotate-0">{pair.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
