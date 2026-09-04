import { RailCatalog } from "@/components/rail-catalog";
import { getCurrentProfile } from "@/lib/auth";
import { listRail } from "@/lib/store";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ found?: string; size?: string }>;
};

export default async function RailPage({ searchParams }: Props) {
  const params = await searchParams;
  const [pairs, profile] = await Promise.all([
    listRail({}),
    getCurrentProfile(),
  ]);

  const defaultSize = params.size
    ? Number(params.size)
    : (profile?.shoeSize ?? null);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="sayari-label">The Rail</p>
            <h1 className="mt-2 font-display text-5xl uppercase tracking-wide sm:text-6xl">
              {params.found
                ? `Found — ${params.found}`
                : "You never know what you'll find."}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted">
              One pair. One story. One new home. Discovery, not endless
              inventory.
            </p>
          </div>
          <Link href="/find" className="sayari-btn-tag">
            Niko na size…
          </Link>
        </div>

        <div className="mt-10">
          <RailCatalog
            pairs={
              params.found
                ? pairs.filter(
                    (pair) =>
                      pair.found.toLowerCase() ===
                      params.found!.toLowerCase(),
                  )
                : pairs
            }
            defaultSize={
              Number.isFinite(defaultSize as number)
                ? (defaultSize as number)
                : null
            }
          />
        </div>
      </div>
    </main>
  );
}
