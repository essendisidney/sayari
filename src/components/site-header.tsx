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
              <span className="text-nairobi">●</span>
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-ink">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Sayari home" className="shrink-0">
            <Logo variant="mark" className="h-11 w-auto sm:h-12" priority />
          </Link>
          <nav className="flex items-center gap-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] sm:gap-7">
            <Link href="/rail" className="hidden hover:text-nairobi sm:inline">
              The Rail
            </Link>
            <Link href="/shoeholics" className="hidden hover:text-nairobi md:inline">
              Shoeholics
            </Link>
            <Link href="/drops" className="hidden hover:text-nairobi lg:inline">
              Drops
            </Link>
            <Link
              href="/find"
              className="hidden hover:text-nairobi xl:inline"
            >
              Find
            </Link>
            {profile ? (
              <Link href="/id">{profile.sayariId}</Link>
            ) : (
              <>
                <Link
                  href="/id/login"
                  className="hidden text-muted hover:text-ink sm:inline"
                >
                  Sign in
                </Link>
                <Link href="/join" className="sayari-btn-tag !px-3 !py-2">
                  Join
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
