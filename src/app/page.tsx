import { Logo } from "@/components/logo";
import { getFounderCount } from "@/lib/founders";
import {
  HERO_IMAGE,
  LEATHER_IMAGE,
  LOOKBOOK,
  PLACES,
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
      {/* Full-bleed hero — brand first, Kenya ground */}
      <section className="relative min-h-[92vh] overflow-hidden bg-night text-bone">
        <Image
          src={HERO_IMAGE}
          alt="Sayari — Nairobi footwear"
          fill
          priority
          className="hero-image object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 sm:px-10 lg:justify-center lg:pb-24">
          <div className="rise max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="stamp !border-brass !text-brass">Nairobi open</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                Westlands · CBD · WhatsApp
              </span>
            </div>

            <Logo
              variant="lockup"
              invert
              priority
              className="rise-delay-1 mt-10 h-36 w-auto sm:h-44"
            />

            <h1 className="rise-delay-2 mt-8 font-display text-4xl leading-[1.05] sm:text-6xl">
              <span className="italic text-brass">Not another shoe store.</span>
              <br />
              The home for people who love shoes — in Nairobi.
            </h1>

            <p className="rise-delay-3 mt-5 max-w-lg text-base leading-7 text-bone/75">
              Size, closet, ReWear, and a WhatsApp stylist that checks real
              stock. Join the first 500 before the floor fills.
            </p>

            <div className="rise-delay-3 mt-9 flex flex-wrap items-center gap-4">
              <Link href="/join" className="sayari-btn !bg-laterite !text-bone">
                Join the 500
              </Link>
              <Link
                href="/id/login"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70 transition hover:text-brass"
              >
                Niko already in →
              </Link>
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45">
              {count} of {FOUNDING_CAP} claimed · {remaining} seats on the rail
            </p>
          </div>
        </div>
      </section>

      {/* Place strip — ground Kenya */}
      <section className="border-b border-line bg-ink text-bone">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 sm:px-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
            Pickup &amp; talk
          </span>
          {PLACES.map((place) => (
            <span
              key={place}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55"
            >
              {place}
            </span>
          ))}
        </div>
      </section>

      <section id="rail" className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="sayari-label">Now on the rail</p>
              <h2 className="mt-3 font-display text-5xl italic sm:text-6xl">
                Pairs with a story.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              Condition noted. Neighbourhood tagged. Price in KSh. This is how
              Nairobi buys shoes that already mean something.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
            {LOOKBOOK.map((item) => (
              <Link key={item.lot} href="/join" className="rail-card group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-chip">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 bg-bone/95 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink">
                    {item.condition}
                  </span>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="font-mono text-[11px] text-laterite">
                      {item.price}
                    </p>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {item.lot} · {item.place}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="rewear" className="border-b border-line bg-night text-bone">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[440px]">
            <Image
              src={RAIL_IMAGE}
              alt="The Sayari rail"
              fill
              className="object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
          </div>
          <div className="flex flex-col justify-center px-5 py-16 sm:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
              ReWear · circular Nairobi
            </p>
            <h2 className="mt-4 font-display text-5xl italic leading-tight">
              That pair you parked under the bed? Still worth something.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-bone/70">
              Upload it. We estimate. You get Sayari credit. We put it back on
              the rail for the next Shoeholic. Less waste. More fit.
            </p>
            <ul className="mt-8 space-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-brass">
              <li>01 — Picha the pair</li>
              <li>02 — We give a number</li>
              <li>03 — Credit on your Sayari ID</li>
              <li>04 — It walks again</li>
            </ul>
            <Link href="/join" className="sayari-btn mt-10 !bg-laterite !text-bone">
              Open my closet
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-12">
            <p className="sayari-label">WhatsApp · your size · real stock</p>
            <h2 className="mt-3 font-display text-5xl italic">
              &ldquo;Niko na wedding Saturday. Nipee shoe.&rdquo;
            </h2>
            <div className="ticket mt-8 space-y-0 px-5">
              <div className="border-b border-dashed border-tobacco/40 py-4 text-sm">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-laterite">
                  You
                </p>
                <p className="mt-1">Size 42. Budget 10k. Office, not flashy.</p>
              </div>
              <div className="py-4 text-sm">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-laterite">
                  Sayari
                </p>
                <p className="mt-1">
                  Black loafer KSh 7,500 · Brown derby KSh 8,900 · Chelsea KSh
                  9,800. Reserved till 6PM, Westlands. Pay now or pick up?
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted">
              No app download required. Meet Nairobi where it already shops —
              on WhatsApp, with inventory that is actually there.
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
          <p className="sayari-label">House hours · EAT</p>
          <h2 className="mt-3 font-display text-5xl italic">
            The week, on the floor.
          </h2>
          <ol className="mt-10 grid grid-cols-2 gap-px bg-line md:grid-cols-4 lg:grid-cols-7">
            {WEEKLY_RITUALS.map((ritual) => (
              <li key={ritual.day} className="bg-paper/80 px-4 py-6 backdrop-blur-sm">
                <p className="sayari-label">{ritual.day}</p>
                <p className="mt-4 font-display text-xl italic leading-6">
                  {ritual.name}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="membership" className="bg-laterite text-bone">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-bone/15 md:grid-cols-3">
          {[
            ["100", "Founding Member", "First names in the book"],
            ["500", "Founding Shoeholic", "The Nairobi opening cohort"],
            ["1,000", "Founders Drop", "First archive release"],
          ].map(([n, label, note]) => (
            <div key={label} className="px-6 py-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60">
                {label}
              </p>
              <p className="mt-3 font-display text-6xl italic">{n}</p>
              <p className="mt-4 text-sm text-bone/75">{note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
