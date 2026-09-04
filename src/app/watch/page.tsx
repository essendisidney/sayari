import { ActivityFeed } from "@/components/activity-feed";
import { SizeWatchDesk } from "@/components/size-watch-desk";
import { getCurrentIdentity, getCurrentProfile } from "@/lib/auth";
import { listRail, listSizeWatches } from "@/lib/store";
import { liveMatchesForWatch } from "@/lib/size-watch";
import { FIND_CATEGORIES } from "@/lib/lookbook";
import { KENYAN_SIZES } from "@/lib/taxonomy";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    size?: string;
    budget?: string;
    category?: string;
    query?: string;
  }>;
};

export default async function WatchPage({ searchParams }: Props) {
  const params = await searchParams;
  const [profile, identity] = await Promise.all([
    getCurrentProfile(),
    getCurrentIdentity(),
  ]);

  const sizeParam = Number(params.size);
  const defaultSize = KENYAN_SIZES.includes(
    sizeParam as (typeof KENYAN_SIZES)[number],
  )
    ? sizeParam
    : (profile?.shoeSize ?? 42);

  const budgetParam = Number(params.budget);
  const defaultBudget =
    Number.isFinite(budgetParam) && budgetParam > 0 ? budgetParam : 8000;

  const categoryParam = params.category?.trim() || "Anything";
  const defaultCategory = (FIND_CATEGORIES as readonly string[]).includes(
    categoryParam,
  )
    ? categoryParam
    : "Anything";

  const rail = await listRail({ status: "AVAILABLE" });
  const watches = profile ? await listSizeWatches(profile.id) : [];
  const enriched = watches.map((watch) => ({
    watch,
    live: liveMatchesForWatch(rail, watch).slice(0, 6),
  }));

  return (
    <main className="flex-1 pb-16 sm:pb-0">
      <section className="border-b border-ink bg-ink text-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10 sm:py-14">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            Scarcity
          </p>
          <h1 className="mt-3 font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
            Size Watch
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-bone/70">
            Your size might be here — or about to land. Arm a watch. When it
            hits the rail, you hear first. One pair only. Don&apos;t sleep.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-10 sm:px-10 sm:py-14">
        <SizeWatchDesk
          signedIn={Boolean(profile)}
          defaultSize={defaultSize}
          defaultBudget={defaultBudget}
          defaultCategory={defaultCategory}
          defaultQuery={params.query?.trim() ?? ""}
          initial={enriched}
        />

        {identity ? (
          <div className="mt-14 border-t border-ink pt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="sayari-label">Alerts</p>
                <h2 className="mt-2 font-display text-3xl uppercase tracking-wide">
                  When it lands
                </h2>
              </div>
              <Link
                href="/id"
                className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] hover:text-nairobi"
              >
                Sayari ID →
              </Link>
            </div>
            <div className="mt-6">
              <ActivityFeed initial={identity.notifications} />
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
