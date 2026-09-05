import { OrdersList } from "@/components/orders-list";
import { getCurrentIdentity } from "@/lib/auth";
import { mpesaIsLive } from "@/lib/commerce";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/id/login?next=/orders");
  const demoPay = !mpesaIsLive();

  return (
    <main className="flex-1 pb-16 sm:pb-0">
      <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-10">
        <p className="sayari-label">Commerce</p>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-wide">
          My orders
        </h1>
        <p className="mt-3 text-sm text-muted">
          {identity.profile.sayariId} · credit KES{" "}
          {(identity.profile.creditKes ?? 0).toLocaleString("en-KE")}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Hold → pay → ready → collect
          {demoPay ? " · demo M-Pesa" : " · live M-Pesa"}
        </p>
        <div className="mt-10">
          <OrdersList
            initial={identity.orders}
            creditKes={identity.profile.creditKes ?? 0}
            demoPay={demoPay}
          />
        </div>
        <p className="mt-8 text-sm text-muted">
          <Link href="/rail" className="underline hover:text-nairobi">
            Back to the rail
          </Link>
          {" · "}
          <Link href="/id" className="underline hover:text-nairobi">
            Sayari ID
          </Link>
        </p>
      </div>
    </main>
  );
}
