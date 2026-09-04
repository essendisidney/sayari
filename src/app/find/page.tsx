import { FindForm } from "@/components/find-form";
import { getCurrentProfile } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FindPage() {
  const profile = await getCurrentProfile();

  return (
    <main className="flex-1">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div>
          <p className="sayari-label">WhatsApp</p>
          <h1 className="mt-3 font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
            Niko na size {profile?.shoeSize ?? 42}.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Size. Budget. Vibe. Occasion. Say it like you&apos;d text a friend —
            we check the live rail and open WhatsApp with the brief ready.
          </p>
          <ul className="mt-6 space-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <li>“Niko na wedding Saturday. Nipee shoe.”</li>
            <li>“Niko na 3K. Size 41.”</li>
            <li>“Need black sneakers size 43.”</li>
          </ul>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-nairobi">
            One pair only · No restock · Gone is gone
          </p>
          {profile ? (
            <p className="mt-4 text-sm text-muted">
              Signed in as {profile.sayariId} · size {profile.shoeSize}
              {profile.budgetBand ? ` · ${profile.budgetBand}` : ""}
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted">
              <Link href="/join" className="underline hover:text-nairobi">
                Join Shoeholics
              </Link>{" "}
              so we remember your size next time.
            </p>
          )}
        </div>

        <FindForm
          defaultSize={profile?.shoeSize ?? 42}
          defaultBudget={budgetFromBand(profile?.budgetBand)}
          defaultCategory={profile?.categories[0] ?? "Sneakers"}
        />
      </div>
    </main>
  );
}

function budgetFromBand(band?: string): number {
  if (!band) return 5000;
  if (band.includes("Under")) return 5000;
  if (band.includes("5,000–8,000")) return 8000;
  if (band.includes("8,000–15,000")) return 15000;
  if (band.includes("15,000–25,000")) return 25000;
  if (band.includes("25,000+")) return 40000;
  return 5000;
}
