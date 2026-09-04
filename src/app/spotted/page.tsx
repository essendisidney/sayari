import { SpottedFeed } from "@/components/spotted-feed";
import { getCurrentProfile } from "@/lib/auth";
import { listSpotted } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SpottedPage() {
  const [posts, profile] = await Promise.all([
    listSpotted(),
    getCurrentProfile(),
  ]);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10">
        <p className="sayari-label">Community</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
          Spotted in Nairobi
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
          Real people. Real streets. Real pairs. Vote the city&apos;s best finds
          — Sayari features the winners.
        </p>
        <div className="mt-12">
          <SpottedFeed
            initial={posts}
            signedIn={Boolean(profile)}
            viewerId={profile?.id ?? null}
          />
        </div>
      </div>
    </main>
  );
}
