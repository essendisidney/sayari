import { OrdersList } from "@/components/orders-list";
import { getCurrentIdentity } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/id/login?next=/orders");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-10">
        <p className="sayari-label">Commerce</p>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-wide">
          My orders
        </h1>
        <p className="mt-3 text-sm text-muted">
          {identity.profile.sayariId} · credit KES{" "}
          {(identity.profile.creditKes ?? 0).toLocaleString("en-KE")}
        </p>
        <div className="mt-10">
          <OrdersList initial={identity.orders} />
        </div>
        <p className="mt-8 text-sm text-muted">
          <Link href="/id" className="underline hover:text-nairobi">
            Back to Sayari ID
          </Link>
        </p>
      </div>
    </main>
  );
}
