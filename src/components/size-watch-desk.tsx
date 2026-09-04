"use client";

import { FIND_CATEGORIES } from "@/lib/lookbook";
import { KENYAN_SIZES } from "@/lib/taxonomy";
import type { RailPair, SizeWatch } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Enriched = { watch: SizeWatch; live: RailPair[] };

type Props = {
  signedIn: boolean;
  defaultSize: number;
  defaultBudget?: number;
  defaultCategory?: string;
  defaultQuery?: string;
  initial: Enriched[];
};

export function SizeWatchDesk({
  signedIn,
  defaultSize,
  defaultBudget = 8000,
  defaultCategory = "Anything",
  defaultQuery = "",
  initial,
}: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [size, setSize] = useState(defaultSize);
  const [category, setCategory] = useState(defaultCategory);
  const [budgetMaxKes, setBudgetMaxKes] = useState(defaultBudget);
  const [query, setQuery] = useState(defaultQuery);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestWa, setGuestWa] = useState<string | null>(null);

  async function arm(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setGuestWa(null);
    try {
      const response = await fetch("/api/watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size,
          category: category === "Anything" ? null : category,
          budgetMaxKes,
          query: query.trim() || null,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        watch?: SizeWatch;
        login?: string;
        whatsappUrl?: string;
      };
      if (response.status === 401 || payload.login) {
        if (payload.whatsappUrl) setGuestWa(payload.whatsappUrl);
        return;
      }
      if (!response.ok) throw new Error(payload.error ?? "Could not arm watch.");
      router.refresh();
      const refresh = await fetch("/api/watch");
      if (refresh.ok) {
        const data = (await refresh.json()) as { watches: Enriched[] };
        setRows(data.watches);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not arm watch.");
    } finally {
      setPending(false);
    }
  }

  async function disarm(id: string) {
    setPending(true);
    try {
      await fetch("/api/watch", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setRows((current) =>
        current.map((row) =>
          row.watch.id === id
            ? { ...row, watch: { ...row.watch, active: false } }
            : row,
        ),
      );
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const active = rows.filter((row) => row.watch.active);

  return (
    <div className="space-y-10">
      <form onSubmit={arm} className="rail-tag space-y-5 p-6 sm:p-8">
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
          <label className="sayari-label" htmlFor="watch-lane">
            Lane (optional)
          </label>
          <select
            id="watch-lane"
            className="sayari-input mt-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {FIND_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="sayari-label" htmlFor="watch-budget">
            Budget max (KES)
          </label>
          <input
            id="watch-budget"
            type="number"
            className="sayari-input mt-1"
            value={budgetMaxKes}
            onChange={(e) => setBudgetMaxKes(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="sayari-label" htmlFor="watch-query">
            Brand / vibe (optional)
          </label>
          <input
            id="watch-query"
            className="sayari-input mt-1"
            placeholder="Samba · Dunk · black sneakers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-nairobi">{error}</p> : null}

        <button type="submit" className="sayari-btn-tag" disabled={pending}>
          {pending
            ? "Arming…"
            : signedIn
              ? "Arm Size Watch"
              : "Arm via WhatsApp / sign in"}
        </button>

        {!signedIn ? (
          <p className="text-sm text-muted">
            Guests get a WhatsApp brief.{" "}
            <Link href="/id/login?next=/watch" className="underline">
              Sign in
            </Link>{" "}
            to keep watches on Sayari ID.
          </p>
        ) : null}

        {guestWa ? (
          <a
            href={guestWa}
            target="_blank"
            rel="noreferrer"
            className="sayari-btn inline-flex"
          >
            Open WhatsApp watch →
          </a>
        ) : null}
      </form>

      <section>
        <p className="sayari-label">Armed</p>
        <h2 className="mt-2 font-display text-3xl uppercase tracking-wide">
          {active.length === 0 ? "No watches yet" : `${active.length} watching`}
        </h2>

        {active.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            When your size lands, it hits your feed. Gone is gone — arm early.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-ink/15 border border-ink bg-bone">
            {active.map(({ watch, live }) => (
              <li key={watch.id} className="px-4 py-5 sm:px-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-nairobi">
                      Size {watch.size}
                      {watch.category ? ` · ${watch.category}` : ""}
                      {watch.budgetMaxKes
                        ? ` · ≤ KES ${watch.budgetMaxKes.toLocaleString("en-KE")}`
                        : ""}
                    </p>
                    <p className="mt-2 font-display text-2xl uppercase tracking-wide">
                      {watch.query?.trim() || "Anything good"}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      {live.length > 0
                        ? `${live.length} live on the rail now`
                        : "Waiting for the next drop"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-nairobi"
                    disabled={pending}
                    onClick={() => void disarm(watch.id)}
                  >
                    Disarm
                  </button>
                </div>
                {live.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {live.map((pair) => (
                      <Link
                        key={pair.id}
                        href={`/rail/${pair.id}`}
                        className="border border-ink bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] hover:border-nairobi"
                      >
                        #{pair.id} · {pair.brand} {pair.model} · {pair.price}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
