import { CheckoutPanel } from "@/components/checkout-panel";
import { RailCard } from "@/components/rail-card";
import { getCurrentProfile } from "@/lib/auth";
import { getRailPair, listOrders, listRail } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RailPairPage({ params }: Props) {
  const { id } = await params;
  const pair = await getRailPair(id);
  if (!pair) notFound();

  const profile = await getCurrentProfile();
  const existingOrder = profile
    ? (await listOrders(profile.id)).find(
        (row) =>
          row.railId === pair.id &&
          (row.status === "RESERVED" ||
            row.status === "PAID" ||
            row.status === "READY"),
      ) ?? null
    : null;

  const related = (await listRail({ size: pair.size }))
    .filter((row) => row.id !== pair.id)
    .slice(0, 3);

  const gone = pair.status === "SOLD";

  return (
    <main className="flex-1 pb-24 sm:pb-0">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-10 sm:py-10">
        <Link
          href="/rail"
          className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted hover:text-nairobi"
        >
          ← Back to the rail
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="rail-tag overflow-hidden">
            <div className="relative aspect-[4/5] bg-chip sm:aspect-[5/4]">
              <Image
                src={pair.image}
                alt={`${pair.brand} ${pair.model} found in ${pair.found}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={`object-cover ${gone ? "grayscale" : ""}`}
              />
              {!gone ? (
                <span className="price-sticker absolute bottom-4 right-4 text-base">
                  {pair.price}
                </span>
              ) : (
                <span className="stamp stamp-sold absolute left-4 top-4 !bg-bone/95 !rotate-0 text-lg !px-4 !py-2">
                  Gone.
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
                Sayari · Rail #{pair.id}
              </span>
              <span
                className={`stamp !py-0.5 ${
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

            <h1 className="mt-5 font-display text-4xl uppercase leading-none tracking-wide sm:text-6xl">
              {pair.brand}
            </h1>
            <p className="mt-2 text-lg text-muted sm:text-xl">{pair.model}</p>

            {gone ? (
              <div className="mt-8 border border-ink bg-bone p-5">
                <p className="font-display text-2xl uppercase tracking-wide">
                  Gone.
                </p>
                <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
                  Rail #{pair.id} found a new home.
                </p>
              </div>
            ) : (
              <dl className="mt-8 grid grid-cols-2 gap-4 border border-ink bg-bone p-5 font-mono text-[11px] uppercase tracking-[0.12em] sm:grid-cols-3">
                <Meta label="Size" value={String(pair.size)} />
                <Meta label="Grade" value={pair.gradeScore} />
                <Meta label="Found" value={pair.found} />
                <Meta label="Lane" value={pair.category} />
                <Meta label="Last seen" value={pair.lastSeen} />
                <Meta label="Pair" value={`#${pair.id}`} />
              </dl>
            )}

            <p className="mt-6 max-w-md text-sm leading-7 text-muted">
              {pair.story}
            </p>

            {!gone ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="price-sticker !rotate-0">{pair.price}</span>
                <span className="stamp !rotate-0">One pair only</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  No restock
                </span>
              </div>
            ) : null}

            <p className="found-mark mt-4">
              {gone ? "Gone from the rail" : `Found — ${pair.found}`}
            </p>

            <div className="mt-8 hidden sm:block">
              <CheckoutPanel
                pair={pair}
                creditKes={profile?.creditKes ?? 0}
                signedIn={Boolean(profile)}
                existingOrder={existingOrder}
              />
            </div>

            <Link
              href="/find"
              className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted hover:text-nairobi"
            >
              Or tell Sayari what you want →
            </Link>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-14 border-t border-ink pt-10 sm:mt-16 sm:pt-12">
            <p className="sayari-label">Also size {pair.size}</p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-wide sm:text-4xl">
              Still on the rail
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {related.map((row) => (
                <RailCard key={row.id} pair={row} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Sticky mobile commerce bar */}
      {!gone ? (
        <div className="fixed inset-x-0 bottom-14 z-40 border-t border-ink bg-paper p-3 sm:hidden">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                Rail #{pair.id} · Size {pair.size}
              </p>
              <p className="font-display text-lg uppercase tracking-wide">
                {pair.price}
              </p>
            </div>
            <span className="found-mark !text-[9px]">Found — {pair.found}</span>
          </div>
          <CheckoutPanel
            pair={pair}
            creditKes={profile?.creditKes ?? 0}
            signedIn={Boolean(profile)}
            existingOrder={existingOrder}
          />
        </div>
      ) : null}
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}
