import { Logo } from "@/components/logo";
import { RailSection } from "@/components/rail-section";
import { getFounderCount } from "@/lib/founders";
import {
  FOUND_PLACES,
  HERO_IMAGE,
  REWEAR_IMAGE,
  SHOEHOLIC_VOTES,
  SPOTTED_IMAGE,
  STREET_IMAGE,
} from "@/lib/lookbook";
import { listRail } from "@/lib/store";
import { FOUNDING_CAP } from "@/lib/taxonomy";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [count, pairs] = await Promise.all([getFounderCount(), listRail()]);
  const remaining = Math.max(FOUNDING_CAP - count, 0);

  return (
    <main className="flex-1">
      <section className="relative min-h-[90vh] overflow-hidden border-b border-ink bg-ink text-bone">
        <Image
          src={HERO_IMAGE}
          alt="Sayari thrifted shoes"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />

        <div className="relative mx-auto flex min-h-[90vh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-24 sm:px-10 lg:justify-center lg:pb-20">
          <div className="rise max-w-3xl">
            <Logo
              variant="lockup"
              invert
              priority
              className="h-28 w-auto sm:h-36"
            />

            <h1 className="rise-delay-1 mt-8 font-display text-4xl uppercase leading-[0.95] tracking-wide sm:text-6xl lg:text-7xl">
              You don&apos;t find the pair.
              <br />
              <span className="text-tag">The pair finds you.</span>
            </h1>

            <p className="rise-delay-2 mt-5 max-w-lg text-base leading-7 text-bone/75">
              Nairobi&apos;s thrifted shoe rail. Sneakers. Loafers. Boots.
              Runners. Hidden gems — pre-loved, properly checked, priced in
              KES.
            </p>

            <div className="rise-delay-3 mt-8 flex flex-wrap items-center gap-4">
              <Link href="/#rail" className="sayari-btn-tag">
                Shop the rail →
              </Link>
              <Link
                href="/join"
                className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone/70 hover:text-tag"
              >
                Join the 500
              </Link>
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/40">
              Found in Nairobi · Worn everywhere · {count}/{FOUNDING_CAP} ·{" "}
              {remaining} seats left
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-tag">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 sm:px-10">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
            Found in
          </span>
          {FOUND_PLACES.map((place) => (
            <span
              key={place}
              className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/70"
            >
              {place}
            </span>
          ))}
        </div>
      </section>

      <RailSection pairs={pairs} />

      <section id="whatsapp" className="border-b border-ink">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[420px] bg-chip">
            <Image
              src={STREET_IMAGE}
              alt="Street sneakers"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-bone px-5 py-16 sm:px-12">
            <span className="stamp">WhatsApp</span>
            <h2 className="mt-6 font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">
              Niko na size 42.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              Tell Sayari what you&apos;re looking for. We check the live rail.
              If it&apos;s there, we hold it. No app. No catalogue scroll.
            </p>
            <div className="mt-8 space-y-0 border border-ink bg-paper">
              {[
                ["You", "Size 42 · Budget 5K · Sneakers · Black or white"],
                [
                  "Sayari",
                  "Air Max KES 4,500 · Kilimani · Grade 8.5 · Hold till 6PM?",
                ],
              ].map(([who, text]) => (
                <div
                  key={who}
                  className="border-b border-ink/15 px-4 py-4 last:border-b-0"
                >
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-nairobi">
                    {who}
                  </p>
                  <p className="mt-1 text-sm">{text}</p>
                </div>
              ))}
            </div>
            <Link href="/find" className="sayari-btn mt-8 self-start">
              Sayari finds the pair
            </Link>
          </div>
        </div>
      </section>

      <section id="rewear" className="border-b border-ink bg-market text-bone">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-12">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
              ReWear
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">
              Your closet has money in it.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-bone/75">
              Picha the pair. We estimate. You get Sayari credit. Someone else
              gets the shoe. Wear → trade → ReWear.
            </p>
            <ol className="mt-8 space-y-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-tag">
              <li>01 — Photograph</li>
              <li>02 — Estimate</li>
              <li>03 — Credit on Sayari ID</li>
              <li>04 — Back on the rail</li>
            </ol>
            <Link
              href="/join"
              className="sayari-btn-tag mt-10 self-start !bg-tag"
            >
              Open my closet
            </Link>
          </div>
          <div className="relative min-h-[420px]">
            <Image
              src={REWEAR_IMAGE}
              alt="Closet and rail"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </div>
      </section>

      <section id="shoeholics" className="border-b border-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="sayari-label">Community</p>
              <h2 className="mt-2 font-display text-5xl uppercase tracking-wide">
                Shoeholics of Nairobi
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              Best find. Best fit. Best bargain. Unexpected pair. The city
              documents its own shoe culture.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SHOEHOLIC_VOTES.map((item) => (
              <div
                key={item.title}
                className="border border-ink bg-bone p-5 shadow-[3px_3px_0_rgba(23,23,23,0.1)]"
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-nairobi">
                  {item.title}
                </p>
                <p className="mt-3 font-display text-2xl uppercase tracking-wide">
                  {item.pair}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {item.vote}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-0 border border-ink lg:grid-cols-2">
            <div className="relative min-h-[320px] bg-chip">
              <Image
                src={SPOTTED_IMAGE}
                alt="Spotted in Nairobi"
                fill
                className="object-cover"
              />
              <span className="stamp absolute left-4 top-4 !bg-bone/90">
                Spotted
              </span>
            </div>
            <div className="flex flex-col justify-center bg-paper px-6 py-10 sm:px-10">
              <h3 className="font-display text-3xl uppercase tracking-wide">
                Spotted in Nairobi
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                Real people. Real streets. Real pairs from the rail. Submit
                your fit — Sayari reposts the best.
              </p>
              <Link href="/join" className="sayari-btn mt-6 self-start">
                Submit a fit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="membership" className="bg-ink text-bone">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-bone/10 md:grid-cols-3">
          {[
            ["100", "Founding Member", "First names in the book"],
            ["500", "Founding Shoeholic", "Opening cohort · Nairobi"],
            ["1,000", "Founders Drop", "First archive release"],
          ].map(([n, label, note]) => (
            <div key={label} className="px-6 py-14">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
                {label}
              </p>
              <p className="mt-3 font-display text-6xl uppercase tracking-wide">
                {n}
              </p>
              <p className="mt-3 text-sm text-bone/65">{note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
