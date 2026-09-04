import { Logo } from "@/components/logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-ink text-bone">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo variant="lockup" invert className="h-32 w-auto" />
          <p className="mt-6 font-display text-2xl uppercase tracking-wide text-tag">
            Found in Nairobi.
            <br />
            Worn everywhere.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            The world
          </p>
          <ul className="mt-4 space-y-2 text-sm text-bone/80">
            <li>
              <Link href="/#rail" className="hover:text-tag">
                The Rail
              </Link>
            </li>
            <li>
              <Link href="/#rewear" className="hover:text-tag">
                ReWear
              </Link>
            </li>
            <li>
              <Link href="/#shoeholics" className="hover:text-tag">
                Shoeholics
              </Link>
            </li>
            <li>
              <Link href="/#whatsapp" className="hover:text-tag">
                Niko na size…
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            Account
          </p>
          <ul className="mt-4 space-y-2 text-sm text-bone/80">
            <li>
              <Link href="/join" className="hover:text-tag">
                Join the 500
              </Link>
            </li>
            <li>
              <Link href="/id/login" className="hover:text-tag">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/id" className="hover:text-tag">
                Sayari ID
              </Link>
            </li>
          </ul>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/40">
            Packaging: brown paper · orange sticker · FOUND stamp
          </p>
        </div>
      </div>
    </footer>
  );
}
