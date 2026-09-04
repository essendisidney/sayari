import { Logo } from "@/components/logo";
import { OtpForm } from "@/components/otp-form";
import { getCurrentProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; next?: string }>;
}) {
  const profile = await getCurrentProfile();
  const { phone = "", next = "/id" } = await searchParams;
  if (profile) redirect(next.startsWith("/") ? next : "/id");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[560px] px-5 py-16 sm:px-8 lg:py-24">
        <Logo variant="mark" className="h-12 w-auto" />
        <p className="sayari-label mt-12">WhatsApp number</p>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-wide">
          Fungua Sayari ID.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Same number you joined with. Closet, wishlist, ReWear credit.
        </p>
        <div className="mt-10">
          <OtpForm
            phone={phone}
            lockPhone={Boolean(phone)}
            joinHint
            nextPath={next.startsWith("/") ? next : "/id"}
          />
        </div>
      </div>
    </main>
  );
}
