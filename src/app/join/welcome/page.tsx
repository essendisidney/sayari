import { Logo } from "@/components/logo";
import { OtpForm } from "@/components/otp-form";
import { foundingTier } from "@/lib/taxonomy";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; phone?: string; id?: string }>;
}) {
  const params = await searchParams;
  const n = Number(params.n ?? "0");
  const valid = Number.isInteger(n) && n > 0;
  const tier = valid ? foundingTier(n) : "Shoeholic";
  const sayariId =
    params.id ?? (valid ? `SY-${String(n).padStart(4, "0")}` : null);

  return (
    <main className="flex-1">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="stamp">Admitted</span>
          <h1 className="mt-8 font-display text-6xl uppercase leading-none tracking-wide">
            {sayariId ?? "Welcome."}
          </h1>
          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-nairobi">
            {valid ? `Rail lot ${String(n).padStart(4, "0")}` : null} · {tier}
          </p>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">
            Verify the number. The closet opens. Your pair — found or ReWear —
            now has a place on the rail.
          </p>
          <div className="mt-10">
            <Logo variant="lockup" className="h-32 w-auto" />
          </div>
        </div>
        <OtpForm phone={params.phone ?? ""} lockPhone={Boolean(params.phone)} />
      </div>
    </main>
  );
}
