import { Logo } from "@/components/logo";
import { RailCard } from "@/components/rail-card";
import { getFounderCount } from "@/lib/founders";
import {
  FOUND_PLACES,
  REWEAR_IMAGE,
  SPOTTED_IMAGE,
  STREET_IMAGE,
} from "@/lib/lookbook";
import { laneLeaders, listRail, listSpotted } from "@/lib/store";
import { FOUNDING_CAP, KENYAN_SIZES } from "@/lib/taxonomy";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [count, pairs, leaders, spotted] = await Promise.all([
    getFounderCount(),
    listRail({ status: "AVAILABLE" }),
    laneLeaders(),
    listSpotted(),
  ]);
  const remaining = Math.max(FOUNDING_CAP - count, 0);
  const hero = pairs[0] ?? null;
  const todaysFinds = pairs.slice(0, 8);
  const featured = spotted.find((row) => row.featured) ?? spotted[0];

  return (
    <main className="flex-1">
      {/* 1. HERO — brand first, visual, minimal copy */}
      <section className="border-b border-ink bg-paper">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex min-h-[72vh] flex-col justify-center border-b border-ink px-5 py-12 sm:px-10 lg:min-h-[90vh] lg:border-b-0 lg:border-r lg:py-16">
            <div className="rise">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">
                Sayari
              </p>
              <Logo
                variant="mark"
                priority
                className="mt-4 h-10 w-auto sm:h-12"
              />
              <h1 className="rise-delay-1 mt-8 font-display text-[2.65rem] uppercase leading-[0.9] tracking-wide sm:text-6xl lg:text-7xl">
                Found in Nairobi.
                <br />
                Worn everywhere.
              </h1>
              <p className="rise-delay-2 mt-5 text-base text-muted sm:text-lg">
                Nairobi&apos;s thrifted shoe rail.
              </p>
              <div className="rise-delay-3 mt-8 flex flex-wrap gap-3">
                <Link href="/#rail" className="sayari-btn-tag">
                  Shop the rail →
                </Link>
                <Link
                  href="/find"
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted hover:text-nairobi"
                >
                  Niko na size…
                </Link>
              </div>
              <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                You never know what you&apos;ll find · {count}/{FOUNDING_CAP} ·{" "}
                {remaining} seats
              </p>
            </div>
          </div>

          <div className="relative min-h-[58vh] bg-chip lg:min-h-[90vh]">
            {hero ? (
              <>
                <Image
                  src={hero.image}
                  alt={`${hero.brand} ${hero.model}`}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 sm:p-8">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
                    Rail #{hero.id}
                  </p>
                  <p className="mt-2 font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl">
                    {hero.brand} {hero.model}
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone/80">
                    Size {hero.size} · {hero.gradeScore} · Found — {hero.found}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="price-sticker !rotate-0">{hero.price}</span>
                    <Link
                      href={`/rail/${hero.id}`}
                      className="sayari-btn-tag !bg-tag"
                    >
                      Grab it →
                    </Link>
                  </div>
                </div>
                <span className="stamp absolute left-4 top-4 !bg-bone/95">
                  One pair only
                </span>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-10">
                <p className="font-display text-4xl uppercase tracking-wide">
                  Rail clearing
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. TODAY ON THE RAIL */}
      <section id="rail" className="border-b border-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="sayari-label">Discovery</p>
              <h2 className="mt-2 font-display text-5xl uppercase tracking-wide">
                Today on the rail
              </h2>
              <p className="mt-2 text-sm text-muted">
                Gone is gone. Don&apos;t sleep on it.
              </p>
            </div>
            <Link
              href="/rail"
              className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] hover:text-nairobi"
            >
              Full rail →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {todaysFinds.map((pair) => (
              <RailCard key={pair.id} pair={pair} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT'S YOUR SIZE? */}
      <section className="border-b border-ink bg-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10">
          <p className="sayari-label">What&apos;s your size?</p>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-wide">
            Your size might be here.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {KENYAN_SIZES.map((size) => (
              <Link
                key={size}
                href={`/rail?size=${size}`}
                className="size-chip hover:bg-ink hover:text-bone"
              >
                {size}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOUND IN NAIROBI — map / provenance */}
      <section className="border-b border-ink bg-ink text-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            Provenance
          </p>
          <h2 className="mt-3 font-display text-5xl uppercase tracking-wide">
            Found in Nairobi
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-bone/65">
            Every pair has a place it came from. Tap a neighbourhood.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {FOUND_PLACES.map((place) => (
              <Link
                key={place}
                href={`/rail?found=${encodeURIComponent(place)}`}
                className="border border-bone/25 px-4 py-5 transition hover:border-tag hover:bg-bone/5"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-tag">
                  Found —
                </p>
                <p className="mt-2 font-display text-xl uppercase tracking-wide">
                  {place}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHATSAPP */}
      <section id="whatsapp" className="border-b border-ink">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[400px] bg-chip">
            <Image
              src={STREET_IMAGE}
              alt="Nairobi street sneakers"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-paper px-5 py-14 sm:px-12">
            <span className="stamp">WhatsApp</span>
            <h2 className="mt-6 font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">
              Niko na size 42.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              A friend who knows where the good stuff is. Not a contact form.
            </p>
            <div className="mt-8 border border-ink bg-bone">
              {[
                ["You", "Niko na wedding Saturday. Nipee shoe."],
                ["Sayari", "Size? Budget? Vibe?"],
                [
                  "Sayari",
                  "Air Max — KES 4,500 · Kilimani · Grade 8.5/10 · Hold till 6PM?",
                ],
              ].map(([who, text], i) => (
                <div
                  key={`${who}-${i}`}
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
              Open WhatsApp find
            </Link>
          </div>
        </div>
      </section>

      {/* 6. REWEAR */}
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
              Found. Checked. Worn again. Your old pair becomes someone&apos;s
              new find.
            </p>
            <ol className="mt-8 space-y-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-tag">
              <li>01 — Photograph</li>
              <li>02 — Estimate</li>
              <li>03 — Get Sayari credit</li>
              <li>04 — Back on the rail</li>
            </ol>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55">
              Wear → trade → ReWear
            </p>
            <Link
              href="/rewear"
              className="sayari-btn-tag mt-10 self-start !bg-tag"
            >
              Start ReWear
            </Link>
          </div>
          <div className="relative min-h-[400px]">
            <Image
              src={REWEAR_IMAGE}
              alt="ReWear"
              fill
              className="object-cover opacity-85"
            />
          </div>
        </div>
      </section>

      {/* 7. SHOEHOLICS + SPOTTED */}
      <section id="shoeholics" className="border-b border-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10">
          <p className="sayari-label">Culture</p>
          <h2 className="mt-2 font-display text-5xl uppercase tracking-wide">
            Shoeholics of Nairobi
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            People who know a good pair when they see one.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map(({ lane, post }) => (
              <div key={lane} className="border border-ink bg-bone p-5">
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

          <div className="mt-10 grid border border-ink lg:grid-cols-2">
            <div className="relative min-h-[320px] bg-chip">
              <Image
                src={featured?.imageUrl ?? SPOTTED_IMAGE}
                alt="Spotted in Nairobi"
                fill
                className="object-cover"
              />
              <span className="stamp absolute left-4 top-4 !bg-bone/95">
                Spotted
              </span>
            </div>
            <div className="flex flex-col justify-center bg-paper px-6 py-10 sm:px-10">
              <h3 className="font-display text-3xl uppercase tracking-wide">
                Spotted in Nairobi
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                Real people. Real streets. Real pairs.
                {featured
                  ? ` ${featured.displayName} — ${featured.caption}`
                  : ""}
              </p>
              <Link href="/spotted" className="sayari-btn mt-6 self-start">
                Show us your kicks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLOSE */}
      <section className="bg-ink px-5 py-20 text-center text-bone sm:px-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-tag">
          Sayari
        </p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-wide sm:text-6xl">
          Found in Nairobi.
          <br />
          Worn everywhere.
        </h2>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/55">
          One pair · One story · One new home
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/rail" className="sayari-btn-tag !bg-tag">
            Shop the rail
          </Link>
          <Link href="/brand" className="sayari-btn-ghost !border-bone !text-bone">
            Brand system
          </Link>
        </div>
      </section>
    </main>
  );
}
