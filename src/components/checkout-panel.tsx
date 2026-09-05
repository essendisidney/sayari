"use client";

import { HoldCountdown } from "@/components/hold-countdown";
import { OrderTimeline } from "@/components/order-timeline";
import { PICKUP_SPOTS, pickupGuide } from "@/lib/commerce";
import type { Order, RailPair } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  pair: RailPair;
  creditKes: number;
  signedIn: boolean;
  existingOrder?: Order | null;
  demoPay?: boolean;
};

export function CheckoutPanel({
  pair,
  creditKes,
  signedIn,
  existingOrder = null,
  demoPay = true,
}: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(existingOrder);
  const [pickup, setPickup] = useState<string>(
    existingOrder?.pickup ?? PICKUP_SPOTS[0],
  );
  const [useCredit, setUseCredit] = useState(creditKes > 0);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    const price = pair.priceKes;
    const credit = useCredit ? Math.min(creditKes, price) : 0;
    return { credit, mpesa: Math.max(0, price - credit) };
  }, [pair.priceKes, creditKes, useCredit]);

  const guide = pickupGuide(order?.pickup ?? pickup);

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
      if (payload.whatsappUrl) setWaUrl(payload.whatsappUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
    } finally {
      setPending(false);
    }
  }

  if (pair.status === "SOLD" && !order) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Gone — already found a new home.
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
          Hold 6h · pay · pickup. One pair only.
        </p>
      </div>
    );
  }

  if (order && (order.status === "CANCELLED" || order.status === "EXPIRED")) {
    return (
      <div className="space-y-3 border border-ink bg-bone p-4">
        <OrderTimeline status={order.status} />
        <p className="mt-3 font-display text-2xl uppercase tracking-wide">
          {order.status === "EXPIRED" ? "Hold expired." : "Hold cancelled."}
        </p>
        <p className="text-sm text-muted">
          {order.status === "EXPIRED"
            ? "Gone is gone — if it's still on the rail, reserve again."
            : "Pair released back to the rail."}
        </p>
        <Link href="/orders" className="sayari-btn-ghost inline-flex">
          My orders
        </Link>
      </div>
    );
  }

  if (order && (order.status === "PAID" || order.status === "READY" || order.status === "COLLECTED")) {
    return (
      <div className="space-y-4 border border-ink bg-bone p-4">
        <OrderTimeline status={order.status} />
        <div>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-market">
            {order.status} · {order.code}
          </p>
          <p className="mt-2 font-display text-2xl uppercase tracking-wide">
            {guide.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">{guide.when}</p>
          <p className="mt-1 text-sm text-muted">Bring: {guide.bring}</p>
          <p className="mt-1 text-sm text-muted">{guide.note}</p>
          {order.mpesaRef ? (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em]">
              Ref {order.mpesaRef}
              {demoPay ? " · demo M-Pesa" : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/orders" className="sayari-btn inline-flex">
            Track order
          </Link>
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="sayari-btn-tag inline-flex"
            >
              WhatsApp Sayari
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  if (order && order.status === "RESERVED") {
    const due =
      order.priceKes - (useCredit ? Math.min(creditKes, order.priceKes) : 0);
    return (
      <div className="space-y-4 border border-ink bg-bone p-4">
        <OrderTimeline status={order.status} />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
            Reserved · {order.code}
          </p>
          <HoldCountdown reservedUntil={order.reservedUntil} />
        </div>
        <p className="text-sm text-muted">
          Pickup {order.pickup}. Pay before the hold dies — one pair only.
        </p>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useCredit}
            disabled={creditKes <= 0}
            onChange={(e) => setUseCredit(e.target.checked)}
          />
          Use Sayari credit (KES {creditKes.toLocaleString("en-KE")})
        </label>

        {due > 0 ? (
          <div>
            <label className="sayari-label" htmlFor="mpesa-phone">
              M-Pesa phone (optional)
            </label>
            <input
              id="mpesa-phone"
              className="sayari-input mt-1"
              placeholder="07… or 254…"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
            />
          </div>
        ) : null}

        <div className="font-mono text-[11px] uppercase tracking-[0.12em]">
          <p>
            Credit − KES{" "}
            {(useCredit ? Math.min(creditKes, order.priceKes) : 0).toLocaleString(
              "en-KE",
            )}
          </p>
          <p className="mt-1">
            M-Pesa due{" "}
            <span className="text-nairobi">
              KES {due.toLocaleString("en-KE")}
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
                mpesaPhone: mpesaPhone || undefined,
              })
            }
          >
            {pending ? "Paying…" : due <= 0 ? "Confirm with credit →" : "Pay now →"}
          </button>
          <button
            type="button"
            className="sayari-btn-ghost"
            disabled={pending}
            onClick={() => void run({ action: "cancel", orderId: order.id })}
          >
            Cancel hold
          </button>
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.14em] hover:text-nairobi"
            >
              WhatsApp hold →
            </a>
          ) : null}
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
          {demoPay
            ? "Demo M-Pesa — ref generated on pay. Live Daraja when keys are set."
            : "STK push via Daraja."}
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
        <p className="mt-3 text-xs leading-5 text-muted">{pickupGuide(pickup).note}</p>
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
          Rail KES {pair.priceKes.toLocaleString("en-KE")} · credit −
          {preview.credit.toLocaleString("en-KE")} · M-Pesa{" "}
          {preview.mpesa.toLocaleString("en-KE")}
        </p>
      </div>

      {error ? <p className="text-sm text-nairobi">{error}</p> : null}

      <button
        type="button"
        className="sayari-btn-tag"
        disabled={pending || pair.status === "HOLD"}
        onClick={() =>
          void run({
            action: "reserve",
            railId: pair.id,
            pickup,
            useCredit,
          })
        }
      >
        {pending
          ? "Holding…"
          : pair.status === "HOLD"
            ? "On hold"
            : "Reserve 6 hours →"}
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        One pair only. Pay to lock pickup. Gone is gone.
      </p>
    </div>
  );
}
