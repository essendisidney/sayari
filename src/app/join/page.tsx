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
          <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/20" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
              Application · Nairobi
            </p>
            <p className="mt-2 max-w-sm font-display text-3xl italic text-bone">
              Size, taste, spend — then WhatsApp opens your ID.
            </p>
          </div>
        </div>
        <div className="px-5 py-14 sm:px-12 lg:py-20">
          <span className="stamp">Lot pending</span>
          <h1 className="mt-8 font-display text-5xl italic leading-tight sm:text-6xl">
            Karibu the first 500.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Not a mailing list. Tell us your size, where you shop in Nairobi,
            and whether you&apos;d trade a pair. Then a code opens your Sayari
            ID.
          </p>
          <div className="mt-10">
            <JoinForm />
          </div>
        </div>
      </div>
    </main>
  );
}
