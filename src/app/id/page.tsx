import { ActivityFeed } from "@/components/activity-feed";
import { IdentityDesk } from "@/components/identity-desk";
import { RailCard } from "@/components/rail-card";
import { getCurrentIdentity } from "@/lib/auth";
import { listRail } from "@/lib/store";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function IdPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/id/login");

  const forYou = (await listRail({ size: identity.profile.shoeSize }))
    .filter((pair) => pair.status !== "SOLD")
    .slice(0, 4);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1440px] space-y-14 px-5 py-12 sm:px-8 lg:py-16">
        <IdentityDesk initial={identity} />

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="sayari-label">Activity</p>
              <h2 className="mt-2 font-display text-4xl uppercase tracking-wide">
                Your Sayari feed
              </h2>
            </div>
          </div>
          <div className="mt-6">
            <ActivityFeed initial={identity.notifications} />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="sayari-label">Live rail</p>
              <h2 className="mt-2 font-display text-4xl uppercase tracking-wide">
                Size {identity.profile.shoeSize} for you
              </h2>
            </div>
            <Link
              href="/rail"
              className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] hover:text-nairobi"
            >
              Full catalog →
            </Link>
          </div>

          {forYou.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              Hakuna size {identity.profile.shoeSize} right now.{" "}
              <Link href="/find" className="underline">
                Tell Sayari what you want
              </Link>
              .
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {forYou.map((pair) => (
                <RailCard key={pair.id} pair={pair} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
