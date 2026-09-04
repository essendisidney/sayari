"use client";

import type { Order, RailPair, RewearSubmission, SpottedPost } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

type DeskData = {
  rewear: RewearSubmission[];
  rail: RailPair[];
  orders: Order[];
  spotted: SpottedPost[];
};

export function OpsDesk() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<DeskData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [size, setSize] = useState("42");
  const [priceKes, setPriceKes] = useState("4500");
  const [found, setFound] = useState("Kilimani");
  const [image, setImage] = useState("");

  async function refresh() {
    const response = await fetch("/api/ops");
    if (response.status === 401) {
      setAuthed(false);
      setData(null);
      return;
    }
    const payload = (await response.json()) as DeskData;
    setData(payload);
    setAuthed(true);
  }

  useEffect(() => {
    void fetch("/api/ops/auth")
      .then((r) => r.json())
      .then((payload: { ok?: boolean }) => {
        if (payload.ok) {
          setAuthed(true);
          return refresh();
        }
      });
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/ops/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Wrong pin.");
      setAuthed(true);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wrong pin.");
    } finally {
      setPending(false);
    }
  }

  async function run(body: Record<string, unknown>) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/ops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Ops failed.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ops failed.");
    } finally {
      setPending(false);
    }
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="rail-tag mx-auto max-w-md space-y-4 p-8">
        <p className="sayari-label">Sayari ops</p>
        <h1 className="font-display text-4xl uppercase tracking-wide">Rail desk</h1>
        <input
          className="sayari-input"
          type="password"
          placeholder="Ops pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        {error ? <p className="text-sm text-nairobi">{error}</p> : null}
        <button type="submit" className="sayari-btn" disabled={pending}>
          Unlock
        </button>
      </form>
    );
  }

  const queue =
    data?.rewear.filter(
      (row) => row.status === "ACCEPTED" || row.status === "INTAKE",
    ) ?? [];

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="sayari-label">Ops</p>
          <h1 className="font-display text-5xl uppercase tracking-wide">
            Rail desk
          </h1>
          <PersistenceBadge />
        </div>
        <button
          type="button"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
          onClick={() =>
            void fetch("/api/ops/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "logout" }),
            }).then(() => {
              setAuthed(false);
              setData(null);
            })
          }
        >
          Lock desk
        </button>
      </div>

      {error ? <p className="text-sm text-nairobi">{error}</p> : null}

      <section>
        <h2 className="font-display text-3xl uppercase tracking-wide">
          Fulfillment
        </h2>
        <ul className="mt-5 divide-y divide-ink/15 border border-ink bg-bone">
          {(data?.orders ?? [])
            .filter(
              (row) =>
                row.status === "PAID" ||
                row.status === "READY" ||
                row.status === "RESERVED",
            )
            .map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-4"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {order.status} · {order.code} · {order.pickup}
                  </p>
                  <p className="mt-1 font-display text-2xl uppercase tracking-wide">
                    {order.brand} {order.model}
                  </p>
                  <p className="text-sm text-muted">
                    Rail #{order.railId} · KES{" "}
                    {order.priceKes.toLocaleString("en-KE")}
                    {order.mpesaRef ? ` · ${order.mpesaRef}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.status === "PAID" ? (
                    <button
                      type="button"
                      className="sayari-btn-tag !px-3 !py-2"
                      disabled={pending}
                      onClick={() =>
                        void run({
                          action: "order-status",
                          orderId: order.id,
                          status: "READY",
                        })
                      }
                    >
                      Mark ready
                    </button>
                  ) : null}
                  {order.status === "READY" || order.status === "PAID" ? (
                    <button
                      type="button"
                      className="sayari-btn !px-3 !py-2"
                      disabled={pending}
                      onClick={() =>
                        void run({
                          action: "order-status",
                          orderId: order.id,
                          status: "COLLECTED",
                        })
                      }
                    >
                      Collected
                    </button>
                  ) : null}
                  {order.status === "RESERVED" || order.status === "PAID" ? (
                    <button
                      type="button"
                      className="sayari-btn-ghost !px-3 !py-2"
                      disabled={pending}
                      onClick={() =>
                        void run({
                          action: "order-status",
                          orderId: order.id,
                          status: "CANCELLED",
                        })
                      }
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-3xl uppercase tracking-wide">
          ReWear intake ({queue.length})
        </h2>
        {queue.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No accepted handovers waiting.</p>
        ) : (
          <ul className="mt-5 divide-y divide-ink/15 border border-ink bg-bone">
            {queue.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-4"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {row.foundNeighbourhood} · credit KES{" "}
                    {row.creditKes.toLocaleString("en-KE")}
                  </p>
                  <p className="mt-1 font-display text-2xl uppercase tracking-wide">
                    {row.brand} {row.model}
                  </p>
                  <p className="text-sm text-muted">
                    Size {row.size} · {row.gradeScore} · resale KES{" "}
                    {row.resaleKes.toLocaleString("en-KE")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="sayari-btn-tag !px-3 !py-2"
                    disabled={pending}
                    onClick={() =>
                      void run({ action: "confirm", rewearId: row.id })
                    }
                  >
                    Confirm → credit + rail
                  </button>
                  <button
                    type="button"
                    className="sayari-btn-ghost !px-3 !py-2"
                    disabled={pending}
                    onClick={() =>
                      void run({ action: "decline", rewearId: row.id })
                    }
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rail-tag space-y-4 p-6">
        <h2 className="font-display text-3xl uppercase tracking-wide">
          Add to rail
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="sayari-input"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <input
            className="sayari-input"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            className="sayari-input"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <input
            className="sayari-input"
            placeholder="Price KES"
            value={priceKes}
            onChange={(e) => setPriceKes(e.target.value)}
          />
          <input
            className="sayari-input"
            placeholder="Found"
            value={found}
            onChange={(e) => setFound(e.target.value)}
          />
          <input
            className="sayari-input"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="sayari-btn"
          disabled={pending}
          onClick={() =>
            void run({
              action: "add",
              pair: {
                brand,
                model,
                size: Number(size),
                category: "Sneakers",
                grade: "Very Good",
                gradeScore: "8/10",
                found,
                priceKes: Number(priceKes),
                image,
                story: "Ops drop on the rail.",
              },
            }).then(() => {
              setBrand("");
              setModel("");
            })
          }
        >
          List pair
        </button>
      </section>

      <section>
        <h2 className="font-display text-3xl uppercase tracking-wide">
          Spotted · feature
        </h2>
        <ul className="mt-5 divide-y divide-ink/15 border border-ink bg-bone">
          {(data?.spotted ?? []).slice(0, 12).map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {post.lane}
                  {post.featured ? " · FEATURED" : ""} · {post.votes} votes
                </p>
                <p className="mt-1 font-display text-xl uppercase tracking-wide">
                  {post.displayName} · {post.neighbourhood}
                </p>
                <p className="text-sm text-muted">{post.caption}</p>
              </div>
              <button
                type="button"
                className="sayari-btn-tag !px-3 !py-2"
                disabled={pending || post.featured}
                onClick={() =>
                  void run({ action: "feature", postId: post.id })
                }
              >
                Shoe of the Week
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-3xl uppercase tracking-wide">
          Live rail
        </h2>
        <ul className="mt-5 divide-y divide-ink/15 border border-ink">
          {(data?.rail ?? []).map((pair) => (
            <li
              key={pair.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <Link
                  href={`/rail/${pair.id}`}
                  className="font-display text-xl uppercase tracking-wide hover:text-nairobi"
                >
                  #{pair.id} {pair.brand} {pair.model}
                </Link>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {pair.status} · size {pair.size} · {pair.price}
                </p>
              </div>
              {pair.status !== "SOLD" ? (
                <button
                  type="button"
                  className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  disabled={pending}
                  onClick={() => void run({ action: "sold", railId: pair.id })}
                >
                  Mark sold
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PersistenceBadge() {
  const [mode, setMode] = useState("…");
  useEffect(() => {
    void fetch("/api/health")
      .then((r) => r.json())
      .then((payload: { persistence?: string }) => {
        setMode(payload.persistence ?? "file");
      })
      .catch(() => setMode("file"));
  }, []);
  return (
    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
      Store · {mode === "supabase" ? "Supabase (durable)" : "local file (dev)"}
    </p>
  );
}
