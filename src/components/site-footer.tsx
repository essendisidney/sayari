import { Logo } from "@/components/logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-night text-bone">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Logo variant="lockup" invert className="h-36 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-6 text-bone/60">
            Nairobi&apos;s shoe house — new-in, ReWear, and a Sayari ID for
            every foot that walks in.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
            Westlands · WhatsApp · Est. archive
          </p>
        </div>
        <div className="flex flex-wrap gap-12 text-sm">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
              The floor
            </p>
            <ul className="mt-3 space-y-2 text-bone/80">
              <li>
                <Link href="/#rail" className="transition hover:text-brass">
                  The rail
                </Link>
              </li>
              <li>
                <Link href="/#rewear" className="transition hover:text-brass">
                  ReWear
                </Link>
              </li>
              <li>
                <Link href="/join" className="transition hover:text-brass">
                  Join the 500
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
              Talk to us
            </p>
            <ul className="mt-3 space-y-2 text-bone/80">
              <li>
                <Link href="/id/login" className="transition hover:text-brass">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/id" className="transition hover:text-brass">
                  Sayari ID
                </Link>
              </li>
              <li className="font-mono text-[11px] text-bone/50">
                WhatsApp first
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
