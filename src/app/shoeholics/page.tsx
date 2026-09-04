import { SpottedFeed } from "@/components/spotted-feed";
import { getCurrentProfile } from "@/lib/auth";
import { WEEKLY_RITUALS } from "@/lib/taxonomy";
import { laneLeaders, listSpotted } from "@/lib/store";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShoeholicsPage() {
  const [leaders, posts, profile] = await Promise.all([
    laneLeaders(),
    listSpotted(),
    getCurrentProfile(),
  ]);

  return (
    <main className="flex-1">
      <section className="border-b border-ink bg-ink text-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            Community
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none tracking-wide sm:text-7xl">
            Shoeholics
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-bone/70">
            Nairobi&apos;s people who know a good pair when they see one. Show
            us your kicks. Rate this fit. Steal of the week.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/spotted" className="sayari-btn-tag !bg-tag">
              Submit a fit
            </Link>
            <Link
              href="/join"
              className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone/70 hover:text-tag"
            >
              Join the 500
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
          <p className="sayari-label">This week&apos;s leaders</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map(({ lane, post }) => (
              <div
                key={lane}
                className="border border-ink bg-bone p-5 shadow-[3px_3px_0_rgba(23,23,23,0.1)]"
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-nairobi">
                  {lane}
                </p>
                <p className="mt-3 font-display text-2xl uppercase tracking-wide">
                  {post
                    ? `${post.displayName} · ${post.neighbourhood}`
                    : "Open lane"}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {post ? `${post.votes} votes` : "Be first"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-paper">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
          <p className="sayari-label">Weekly rituals</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WEEKLY_RITUALS.map((ritual) => (
              <div key={ritual.day} className="border border-ink/20 px-4 py-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  {ritual.day}
                </p>
                <p className="mt-2 font-display text-xl uppercase tracking-wide">
                  {ritual.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
        <SpottedFeed
          initial={posts}
          signedIn={Boolean(profile)}
          viewerId={profile?.id ?? null}
        />
      </section>
    </main>
  );
}
