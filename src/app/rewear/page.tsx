import { RewearDesk } from "@/components/rewear-desk";
import { getCurrentIdentity } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RewearPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/id/login?next=/rewear");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10 lg:py-16">
        <div className="max-w-2xl">
          <p className="sayari-label">ReWear</p>
          <h1 className="mt-3 font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
            Your closet has money in it.
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            Photograph → estimate → Sayari credit → back on the rail. Found.
            Checked. Worn again.
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Wear → trade → ReWear · {identity.profile.sayariId}
          </p>
        </div>

        <div className="mt-12">
          <RewearDesk identity={identity} />
        </div>

        <p className="mt-10 text-sm text-muted">
          Prefer the rail first?{" "}
          <Link href="/find" className="underline hover:text-nairobi">
            Find a pair
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
