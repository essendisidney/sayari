import { JoinForm } from "@/components/join-form";
import { RAIL_IMAGE } from "@/lib/lookbook";
import Image from "next/image";

export default function JoinPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        <div className="relative hidden min-h-[720px] lg:block">
          <Image
            src={RAIL_IMAGE}
            alt="The rail"
            fill
            className="object-cover"
            priority
          />
          <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.18em] text-bone">
            Application · Nairobi archive
          </p>
        </div>
        <div className="px-5 py-14 sm:px-12 lg:py-20">
          <span className="stamp">Lot pending</span>
          <h1 className="mt-8 font-display text-5xl italic leading-tight sm:text-6xl">
            Ask for a number.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Size, what you wear, what you spend, whether you would trade a
            pair. Then the code opens your Sayari ID.
          </p>
          <div className="mt-10">
            <JoinForm />
          </div>
        </div>
      </div>
    </main>
  );
}
