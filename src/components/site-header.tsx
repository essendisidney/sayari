import { getCurrentProfile } from "@/lib/auth";
import { TICKER } from "@/lib/lookbook";
import { Logo } from "@/components/logo";
import Link from "next/link";

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  const loop = [...TICKER, ...TICKER];

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm">
      <div className="overflow-hidden border-b border-line bg-night text-bone">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              {item}
              <span className="text-brass">/</span>
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-line">
        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Sayari home" className="shrink-0">
            <Logo variant="mark" className="h-12 w-auto sm:h-14" priority />
          </Link>
          <nav className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] sm:gap-8">
            <Link
              href="/#rail"
              className="hidden text-tobacco transition hover:text-laterite sm:inline"
            >
              The rail
            </Link>
            <Link
              href="/#rewear"
              className="hidden text-tobacco transition hover:text-laterite md:inline"
            >
              ReWear
            </Link>
            {profile ? (
              <Link href="/id" className="hover:text-laterite">
                {profile.sayariId}
              </Link>
            ) : (
              <>
                <Link
                  href="/id/login"
                  className="hidden text-tobacco transition hover:text-laterite sm:inline"
                >
                  Sign in
                </Link>
                <Link href="/join" className="sayari-btn !bg-laterite !px-4 !py-2.5">
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
