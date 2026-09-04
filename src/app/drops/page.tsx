import { RailCard } from "@/components/rail-card";
import { dropWeekLabel } from "@/lib/commerce";
import { listRail } from "@/lib/store";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DropsPage() {
  const rail = await listRail();
  const drop = rail.filter((pair) => pair.status !== "SOLD").slice(0, 6);
  const week = dropWeekLabel();

  return (
    <main className="flex-1">
      <section className="border-b border-ink bg-ink text-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            Sayari drops · {week}
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none tracking-wide sm:text-7xl">
            This week on the rail.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-bone/70">
            Fresh finds. One pair each. No restock. Reserve before it walks.
          </p>
          <Link href="/find" className="sayari-btn-tag mt-8 inline-flex !bg-tag">
            Niko na size…
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
        {drop.length === 0 ? (
          <p className="text-sm text-muted">
            Drop is clearing.{" "}
            <Link href="/find" className="underline">
              WhatsApp us
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {drop.map((pair) => (
              <RailCard key={pair.id} pair={pair} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
