import { IdentityDesk } from "@/components/identity-desk";
import { getCurrentIdentity } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function IdPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/id/login");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
        <IdentityDesk initial={identity} />
      </div>
    </main>
  );
}
