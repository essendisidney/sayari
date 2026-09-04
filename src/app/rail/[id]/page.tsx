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

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-10">
        <Link
          href="/#rail"
          className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted hover:text-nairobi"
        >
          ← Back to the rail
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rail-tag overflow-hidden">
            <div className="relative aspect-[4/5] bg-chip sm:aspect-[5/4]">
              <Image
                src={pair.image}
                alt={`${pair.brand} ${pair.model}`}
                fill
                priority
                className="object-cover"
              />
              <span className="price-sticker absolute bottom-4 right-4 text-base">
                {pair.price}
              </span>
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
                    : pair.status === "SOLD"
                      ? "stamp-sold"
                      : ""
                }`}
              >
                {pair.status === "SOLD" ? "GONE" : pair.status}
              </span>
            </div>

            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
              {pair.brand}
            </h1>
            <p className="mt-2 text-xl text-muted">{pair.model}</p>

            {pair.status === "SOLD" ? (
              <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
                #{pair.id} found a new home.
              </p>
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

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pair.status !== "SOLD" && (
                <>
                  <span className="price-sticker !rotate-0">{pair.price}</span>
                  <span className="stamp !rotate-0">One pair only</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                    No restock
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-nairobi">
              {pair.status === "SOLD"
                ? "Gone from the rail"
                : `Found — ${pair.found}`}
            </p>

            <div className="mt-8">
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
          <section className="mt-16 border-t border-ink pt-12">
            <p className="sayari-label">Also size {pair.size}</p>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-wide">
              Still on the rail
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((row) => (
                <RailCard key={row.id} pair={row} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
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
