import { getCurrentProfile } from "@/lib/auth";
import { TICKER } from "@/lib/lookbook";
import { Logo } from "@/components/logo";
import Link from "next/link";

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  const loop = [...TICKER, ...TICKER];

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm">
      <div className="tape overflow-hidden text-ink">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8">
              {item}
              <span className="text-nairobi" aria-hidden>
                ●
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-ink">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:h-[72px] sm:px-8">
          <Link href="/" aria-label="Sayari home" className="shrink-0">
            <Logo variant="mark" className="h-9 w-auto sm:h-12" priority />
          </Link>
          <nav
            aria-label="Primary"
            className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] sm:gap-7 sm:tracking-[0.16em]"
          >
            <Link href="/rail" className="hover:text-nairobi">
              Rail
            </Link>
            <Link href="/find" className="hover:text-nairobi">
              Find
            </Link>
            <Link
              href="/shoeholics"
              className="hidden hover:text-nairobi sm:inline"
            >
              Shoeholics
            </Link>
            <Link href="/rewear" className="hidden hover:text-nairobi md:inline">
              ReWear
            </Link>
            {profile ? (
              <Link href="/id" className="hover:text-nairobi">
                {profile.sayariId}
              </Link>
            ) : (
              <Link href="/join" className="sayari-btn-tag !px-3 !py-2">
                Join
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
