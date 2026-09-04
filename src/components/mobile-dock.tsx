"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/rail", label: "Rail" },
  { href: "/found", label: "Found" },
  { href: "/find", label: "Find" },
  { href: "/shoeholics", label: "Culture" },
] as const;

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink bg-paper/95 backdrop-blur-sm sm:hidden"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex h-14 items-center justify-center font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${
                  active ? "bg-ink text-bone" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
