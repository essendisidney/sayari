import { Logo } from "@/components/logo";
import Link from "next/link";

export const metadata = {
  title: "Brand system · Sayari",
  description:
    "Visual vocabulary for Sayari — Instagram, TikTok, WhatsApp, packaging.",
};

const VOCAB = [
  "FOUND",
  "THE SAYARI MAP",
  "RAIL",
  "SIZE",
  "GRADE",
  "KES",
  "FOUND — [LOCATION]",
  "ONE PAIR ONLY",
  "NO RESTOCK",
  "SHOEHOLICS",
  "REWEAR",
  "GONE",
  "NIKO NA SIZE",
] as const;

export default function BrandPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-ink bg-paper">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-10">
          <p className="sayari-label">Brand system</p>
          <h1 className="mt-3 font-display text-5xl uppercase tracking-wide sm:text-6xl">
            Recognizable without the logo.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Paper + ink + photography + accent. 70% editorial. 30% thrift
            street. Nairobi as source, not decoration. Provenance lives on{" "}
            <Link href="/found" className="underline hover:text-nairobi">
              The Sayari Map
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Logo variant="mark" className="h-10 w-auto" />
            <span className="stamp">Found</span>
            <span className="price-sticker !rotate-0">KES 6,500</span>
            <span className="stamp stamp-sold">Gone</span>
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-bone">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-10">
          <p className="sayari-label">Visual vocabulary</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {VOCAB.map((word) => (
              <span
                key={word}
                className="border border-ink bg-paper px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink">
        <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-10">
          <p className="sayari-label">Colour</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ["Old paper", "bg-paper", "border-ink"],
              ["Ink", "bg-ink text-bone", "border-ink"],
              ["Market orange", "bg-nairobi text-bone", "border-nairobi"],
              ["Price-tag yellow", "bg-tag", "border-ink"],
              ["Deep green", "bg-market text-bone", "border-market"],
            ].map(([name, fill, border]) => (
              <div
                key={name}
                className={`aspect-[4/3] border ${border} ${fill} flex items-end p-3`}
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram rail drop */}
      <section className="border-b border-ink bg-chip">
        <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-10">
          <p className="sayari-label">Instagram · Rail drop</p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-wide">
            Feed template
          </h2>
          <div className="mt-8 mx-auto max-w-sm">
            <article className="brand-frame aspect-square overflow-hidden bg-paper p-5">
              <div className="flex h-full flex-col border border-ink bg-bone">
                <div className="flex items-center justify-between border-b border-dashed border-ink/30 px-4 py-3">
                  <div>
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-muted">
                      Sayari
                    </p>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                      Rail #NBO-084
                    </p>
                  </div>
                  <span className="stamp !py-0.5 !text-[8px]">Found</span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center bg-chip px-4 text-center">
                  <p className="font-display text-4xl uppercase tracking-wide">
                    Adidas Samba
                  </p>
                  <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em]">
                    Size 41 · Grade 8/10
                  </p>
                  <p className="mt-2 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-nairobi">
                    Found — Eastlands
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-ink/30 px-4 py-3">
                  <span className="price-sticker !rotate-0 !px-2 !py-1">
                    KES 4,200
                  </span>
                  <p className="text-right font-mono text-[8px] font-bold uppercase tracking-[0.12em]">
                    One pair only
                    <br />
                    No restock
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Story / TikTok / WhatsApp */}
      <section className="border-b border-ink">
        <div className="mx-auto grid max-w-[1100px] gap-8 px-5 py-14 sm:px-10 lg:grid-cols-3">
          <div>
            <p className="sayari-label">Story</p>
            <div className="brand-frame mt-4 aspect-[9/16] bg-ink p-4 text-bone">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-tag">
                Today on the rail
              </p>
              <p className="mt-8 font-display text-3xl uppercase leading-none tracking-wide">
                Size 42
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-bone/70">
                Dunk · CBD · Grade 9/10
              </p>
              <span className="price-sticker mt-8 inline-block !rotate-0">
                KES 6,500
              </span>
              <p className="mt-auto pt-16 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/45">
                Shop before it&apos;s gone
              </p>
            </div>
          </div>

          <div>
            <p className="sayari-label">TikTok</p>
            <div className="brand-frame mt-4 aspect-[9/16] bg-paper p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                POV
              </p>
              <p className="mt-6 font-display text-2xl uppercase leading-tight tracking-wide">
                You said you&apos;re just looking.
              </p>
              <div className="mt-10 border border-ink bg-bone p-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  Rail #NBO-041
                </p>
                <p className="mt-2 font-display text-xl uppercase">Nike Dunk</p>
                <p className="mt-2 font-mono text-[10px] uppercase text-nairobi">
                  Found — CBD
                </p>
                <span className="price-sticker mt-4 inline-block !rotate-0 !text-[11px]">
                  KES 6,500
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="sayari-label">WhatsApp status</p>
            <div className="brand-frame mt-4 aspect-[9/16] bg-market p-4 text-bone">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-tag">
                New on the rail
              </p>
              <p className="mt-10 font-display text-4xl uppercase tracking-wide">
                Size 42
              </p>
              <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.12em]">
                KES 4,500
              </p>
              <p className="mt-2 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-tag">
                Found — Kilimani
              </p>
              <div className="mt-12 border-2 border-dashed border-bone/40 p-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  Niko na size…
                </p>
                <p className="mt-2 text-sm text-bone/70">
                  Reply with size · budget · vibe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sold + packaging */}
      <section className="border-b border-ink bg-bone">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-5 py-14 sm:px-10 lg:grid-cols-2">
          <div>
            <p className="sayari-label">Sold</p>
            <div className="brand-frame mt-4 bg-paper p-8 text-center">
              <p className="stamp stamp-sold !rotate-0 text-2xl !px-6 !py-3">
                Gone.
              </p>
              <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.16em]">
                Rail #NBO-084
              </p>
              <p className="mt-2 font-display text-2xl uppercase tracking-wide">
                Found a new home.
              </p>
            </div>
          </div>
          <div>
            <p className="sayari-label">Packaging</p>
            <div className="brand-frame mt-4 bg-[#c4a574] p-8 text-ink">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                Sayari
              </p>
              <p className="mt-4 font-display text-3xl uppercase leading-none tracking-wide">
                Found in Nairobi.
                <br />
                Worn everywhere.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="stamp !bg-paper/80">Found</span>
                <span className="border-2 border-nairobi bg-nairobi px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-bone">
                  Rail #NBO-041
                </span>
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em]">
                Found — CBD
              </p>
              <p className="mt-8 border-t border-dashed border-ink/40 pt-4 font-mono text-[10px] uppercase tracking-[0.14em]">
                This pair found a new home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 text-center text-bone sm:px-10">
        <p className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
          The digital home of Nairobi&apos;s thrift shoe culture.
        </p>
        <Link href="/rail" className="sayari-btn-tag mt-8 inline-flex !bg-tag">
          Back to the rail
        </Link>
      </section>
    </main>
  );
}
