import { JoinForm } from "@/components/join-form";
import { REWEAR_IMAGE } from "@/lib/lookbook";
import Image from "next/image";

export default function JoinPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        <div className="relative hidden min-h-[720px] border-r border-ink lg:block">
          <Image
            src={REWEAR_IMAGE}
            alt="The rail"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
          <div className="absolute bottom-8 left-8 right-8 text-bone">
            <span className="stamp !border-tag !text-tag">Found in Nairobi</span>
            <p className="mt-4 font-display text-4xl uppercase tracking-wide">
              Worn everywhere.
            </p>
          </div>
        </div>
        <div className="px-5 py-14 sm:px-12 lg:py-20">
          <span className="stamp">Lot pending</span>
          <h1 className="mt-8 font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
            Karibu the first 500.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Size. Taste. Budget. Where you shop in Nairobi. Whether you&apos;d
            ReWear a pair. Then WhatsApp opens your Sayari ID.
          </p>
          <div className="mt-10">
            <JoinForm />
          </div>
        </div>
      </div>
    </main>
  );
}
