import { Logo } from "@/components/logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-night text-bone">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Logo variant="lockup" invert className="h-36 w-auto" />
          <p className="mt-6 max-w-xs font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
            Nairobi · New-in · ReWear · Est. archive
          </p>
        </div>
        <div className="flex flex-wrap gap-12 text-sm">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
              The floor
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/#rail">The rail</Link>
              </li>
              <li>
                <Link href="/#rewear">ReWear</Link>
              </li>
              <li>
                <Link href="/join">Join the 500</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
              Account
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/id/login">Sign in</Link>
              </li>
              <li>
                <Link href="/id">Sayari ID</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
