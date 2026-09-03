import { Logo } from "@/components/logo";
import { getFounderCount } from "@/lib/founders";
import {
  HERO_IMAGE,
  LEATHER_IMAGE,
  LOOKBOOK,
  RAIL_IMAGE,
} from "@/lib/lookbook";
import { FOUNDING_CAP, WEEKLY_RITUALS } from "@/lib/taxonomy";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const count = await getFounderCount();
  const remaining = Math.max(FOUNDING_CAP - count, 0);

  return (
    <main className="flex-1">
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between px-5 py-12 sm:px-10 lg:min-h-[82vh] lg:py-16">
            <div>
              <div className="flex items-center gap-4">
                <span className="stamp">Archive open</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-tobacco">
                  Lot 0001–{String(FOUNDING_CAP).padStart(4, "0")}
                </span>
              </div>
              <h1 className="mt-8 max-w-xl font-display text-5xl leading-[0.95] sm:text-7xl">
                <span className="italic">Not new.</span>
                <br />
                Known.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-muted">
                Sayari is Nairobi&apos;s shoe house for new-in and ReWear —
                premium thrift with a name, a size, and a closet behind every
                pair.
              </p>
            </div>
            <div className="mt-12">
              <Logo variant="lockup" className="h-32 w-auto sm:h-36" />
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/join" className="sayari-btn">
                  Claim a lot
                </Link>
                <Link
                  href="/id/login"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-tobacco"
                >
                  I already have an ID
                </Link>
              </div>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {count} of {FOUNDING_CAP} lots claimed · {remaining} on the rail
              </p>
            </div>
          </div>
          <div className="relative min-h-[380px] bg-chip lg:min-h-[82vh]">
            <Image
              src={HERO_IMAGE}
              alt="The Sayari floor"
              fill
              priority
              className="object-cover"
            />
            <p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone">
              Floor · Nairobi
            </p>
          </div>
        </div>
      </section>

      <section id="rail" className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="sayari-label">Now on the rail</p>
              <h2 className="mt-3 font-display text-5xl italic">
                Eight rooms. One archive.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              Condition noted. Size later. This is how Vestiaire lists a bag —
              we do it for Kenya&apos;s shoes.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {LOOKBOOK.map((item) => (
              <Link key={item.lot} href="/join" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-chip">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-3 top-3 bg-bone/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink">
                    {item.condition}
                  </span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm">{item.name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-tobacco">
                      {item.lot}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="rewear" className="border-b border-line bg-night text-bone">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image
              src={RAIL_IMAGE}
              alt="Clothes and shoes on the rail"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-16 sm:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
              ReWear
            </p>
            <h2 className="mt-4 font-display text-5xl italic leading-tight">
              The pair you no longer wear still has a price.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-bone/70">
              Trade it in. We value it, give Sayari credit, and put it back on
              the rail. That is the circular shop — The RealReal, for footwear,
              in Nairobi.
            </p>
            <ul className="mt-8 space-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-brass">
              <li>01 — Photograph the pair</li>
              <li>02 — We estimate the lot</li>
              <li>03 — Credit on your Sayari ID</li>
              <li>04 — It sells again</li>
            </ul>
            <Link href="/join" className="sayari-btn mt-10 !bg-bone !text-night">
              Open a closet
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-12">
            <p className="sayari-label">The closet</p>
            <h2 className="mt-3 font-display text-5xl italic">
              What you already own is inventory.
            </h2>
            <div className="ticket mt-8 divide-y divide-dashed divide-tobacco/40 px-5">
              <div className="flex justify-between py-4 text-sm">
                <span>Nike Air Max</span>
                <span className="font-mono text-[10px] uppercase text-tobacco">
                  42 · Frequent
                </span>
              </div>
              <div className="flex justify-between py-4 text-sm">
                <span>Bata Oxford</span>
                <span className="font-mono text-[10px] uppercase text-tobacco">
                  42 · Work
                </span>
              </div>
              <div className="flex justify-between py-4 text-sm">
                <span>Adidas Samba</span>
                <span className="font-mono text-[10px] uppercase text-tobacco">
                  42 · Weekend
                </span>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted">
              Size 42. Eight to fifteen thousand. No runner in eight months.
              Sayari sells the next pair because it already knows the last.
            </p>
          </div>
          <div className="relative min-h-[440px] bg-chip">
            <Image
              src={LEATHER_IMAGE}
              alt="Worn-in boots"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10">
          <p className="sayari-label">House hours</p>
          <h2 className="mt-3 font-display text-5xl italic">The week on the floor.</h2>
          <ol className="mt-10 grid grid-cols-2 gap-px bg-line md:grid-cols-4 lg:grid-cols-7">
            {WEEKLY_RITUALS.map((ritual) => (
              <li key={ritual.day} className="bg-paper px-4 py-6">
                <p className="sayari-label">{ritual.day}</p>
                <p className="mt-4 font-display text-xl italic leading-6">
                  {ritual.name}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="membership" className="bg-tobacco text-bone">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-bone/15 md:grid-cols-3">
          {[
            ["100", "Founding Member", "First names on the book"],
            ["500", "Founding Shoeholic", "The opening cohort"],
            ["1,000", "Founders Drop", "The first archive release"],
          ].map(([n, label, note]) => (
            <div key={label} className="px-6 py-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                {label}
              </p>
              <p className="mt-3 font-display text-6xl italic">{n}</p>
              <p className="mt-4 text-sm text-bone/70">{note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
