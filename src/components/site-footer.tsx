import { Logo } from "@/components/logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-ink text-bone">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo variant="lockup" invert className="h-28 w-auto" />
          <p className="mt-6 font-display text-2xl uppercase tracking-wide text-tag">
            Found in Nairobi.
            <br />
            Worn everywhere.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-bone/65">
            The digital home of Nairobi&apos;s thrift shoe culture. One pair.
            One story. One new home.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            The world
          </p>
          <ul className="mt-4 space-y-2 text-sm text-bone/80">
            <li>
              <Link href="/rail" className="hover:text-tag">
                The Rail
              </Link>
            </li>
            <li>
              <Link href="/find" className="hover:text-tag">
                WhatsApp find
              </Link>
            </li>
            <li>
              <Link href="/rewear" className="hover:text-tag">
                ReWear
              </Link>
            </li>
            <li>
              <Link href="/shoeholics" className="hover:text-tag">
                Shoeholics
              </Link>
            </li>
            <li>
              <Link href="/spotted" className="hover:text-tag">
                Spotted
              </Link>
            </li>
            <li>
              <Link href="/drops" className="hover:text-tag">
                Drops
              </Link>
            </li>
            <li>
              <Link href="/brand" className="hover:text-tag">
                Brand system
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
            You
          </p>
          <ul className="mt-4 space-y-2 text-sm text-bone/80">
            <li>
              <Link href="/join" className="hover:text-tag">
                Join Shoeholics
              </Link>
            </li>
            <li>
              <Link href="/id" className="hover:text-tag">
                Sayari ID
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-tag">
                Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/15 px-5 py-4 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-bone/40 sm:px-8">
        You never know what you&apos;ll find.
      </div>
    </footer>
  );
}
