"use client";

import { PICKUP_SPOTS } from "@/lib/commerce";
import type { Order, RailPair } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  pair: RailPair;
  creditKes: number;
  signedIn: boolean;
  existingOrder?: Order | null;
};

export function CheckoutPanel({
  pair,
  creditKes,
  signedIn,
  existingOrder = null,
}: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(existingOrder);
  const [pickup, setPickup] = useState<string>(PICKUP_SPOTS[0]);
  const [useCredit, setUseCredit] = useState(creditKes > 0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    const price = pair.priceKes;
    const credit = useCredit ? Math.min(creditKes, price) : 0;
    return { credit, mpesa: Math.max(0, price - credit) };
  }, [pair.priceKes, creditKes, useCredit]);

  async function run(body: Record<string, unknown>) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as {
        error?: string;
        order?: Order;
        whatsappUrl?: string;
        login?: string;
      };
      if (response.status === 401) {
        router.push(`/id/login?next=/rail/${pair.id}`);
        return;
      }
      if (!response.ok) throw new Error(payload.error ?? "Could not continue.");
      if (payload.order) setOrder(payload.order);
      if (payload.whatsappUrl && body.action === "reserve") {
        // keep optional WA ping but don't force open on every reserve
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
    } finally {
      setPending(false);
    }
  }

  if (pair.status === "SOLD") {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Sold — already walked out.
      </p>
    );
  }

  if (!signedIn) {
    return (
      <div className="space-y-3">
        <Link
          href={`/id/login?next=/rail/${pair.id}`}
          className="sayari-btn-tag inline-flex"
        >
          Sign in to reserve →
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Hold · pay · pickup. WhatsApp still works after.
        </p>
      </div>
    );
  }

  if (order && (order.status === "PAID" || order.status === "READY")) {
    return (
      <div className="space-y-3 border border-ink bg-bone p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-market">
          {order.status} · {order.code}
        </p>
        <p className="text-sm">
          Pickup: {order.pickup}
          {order.mpesaRef ? ` · M-Pesa ${order.mpesaRef}` : ""}
        </p>
        <Link href="/orders" className="sayari-btn inline-flex">
          Track order
        </Link>
      </div>
    );
  }

  if (order && order.status === "RESERVED") {
    return (
      <div className="space-y-4 border border-ink bg-bone p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
          Reserved · {order.code}
        </p>
        <p className="text-sm text-muted">
          Hold until{" "}
          {new Date(order.reservedUntil).toLocaleTimeString("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          . Pickup {order.pickup}.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useCredit}
            onChange={(e) => setUseCredit(e.target.checked)}
          />
          Use Sayari credit (KES {creditKes.toLocaleString("en-KE")} available)
        </label>
        <div className="font-mono text-[11px] uppercase tracking-[0.12em]">
          <p>Credit − KES {(useCredit ? Math.min(creditKes, order.priceKes) : 0).toLocaleString("en-KE")}</p>
          <p className="mt-1">
            M-Pesa due{" "}
            <span className="text-nairobi">
              KES{" "}
              {(
                order.priceKes -
                (useCredit ? Math.min(creditKes, order.priceKes) : 0)
              ).toLocaleString("en-KE")}
            </span>
          </p>
        </div>
        {error ? <p className="text-sm text-nairobi">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="sayari-btn-tag"
            disabled={pending}
            onClick={() =>
              void run({
                action: "pay",
                orderId: order.id,
                useCredit,
              })
            }
          >
            {pending ? "Paying…" : "Pay now"}
          </button>
          <button
            type="button"
            className="sayari-btn-ghost"
            disabled={pending}
            onClick={() => void run({ action: "cancel", orderId: order.id })}
          >
            Cancel hold
          </button>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
          M-Pesa is stubbed for now — ref generated on pay. Live Daraja next.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="sayari-label">Pickup</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PICKUP_SPOTS.map((spot) => (
            <button
              key={spot}
              type="button"
              className="size-chip !min-w-0 !px-3 text-[10px] uppercase tracking-[0.1em]"
              data-active={pickup === spot}
              onClick={() => setPickup(spot)}
            >
              {spot}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={useCredit}
          disabled={creditKes <= 0}
          onChange={(e) => setUseCredit(e.target.checked)}
        />
        Apply credit · KES {creditKes.toLocaleString("en-KE")}
      </label>

      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <p>
          Rail price KES {pair.priceKes.toLocaleString("en-KE")} · credit −
          {preview.credit.toLocaleString("en-KE")} · M-Pesa{" "}
          {preview.mpesa.toLocaleString("en-KE")}
        </p>
      </div>

      {error ? <p className="text-sm text-nairobi">{error}</p> : null}

      <button
        type="button"
        className="sayari-btn-tag"
        disabled={pending}
        onClick={() =>
          void run({
            action: "reserve",
            railId: pair.id,
            pickup,
            useCredit,
          })
        }
      >
        {pending ? "Holding…" : "Reserve 6 hours →"}
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        One pair only. Pay to lock pickup.
      </p>
    </div>
  );
}
