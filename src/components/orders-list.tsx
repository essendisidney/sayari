"use client";

import { HoldCountdown } from "@/components/hold-countdown";
import { OrderTimeline } from "@/components/order-timeline";
import { pickupGuide } from "@/lib/commerce";
import type { Order } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initial: Order[];
  creditKes: number;
  demoPay?: boolean;
};

export function OrdersList({
  initial,
  creditKes,
  demoPay = true,
}: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCredit, setUseCredit] = useState(creditKes > 0);
  const [waById, setWaById] = useState<Record<string, string>>({});

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
      };
      if (!response.ok) throw new Error(payload.error ?? "Action failed.");
      if (payload.order) {
        setOrders((current) =>
          current.map((row) =>
            row.id === payload.order!.id ? payload.order! : row,
          ),
        );
        if (payload.whatsappUrl) {
          setWaById((current) => ({
            ...current,
            [payload.order!.id]: payload.whatsappUrl!,
          }));
        }
      }
      router.refresh();
      return payload;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
      return null;
    } finally {
      setPending(false);
    }
  }

  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted">
        No orders yet.{" "}
        <Link href="/rail" className="underline hover:text-nairobi">
          Shop the rail
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-nairobi">{error}</p> : null}
      {creditKes > 0 ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useCredit}
            onChange={(e) => setUseCredit(e.target.checked)}
          />
          Prefer Sayari credit on pay · KES {creditKes.toLocaleString("en-KE")}
        </label>
      ) : null}
      <ul className="space-y-4">
        {orders.map((order) => {
          const guide = pickupGuide(order.pickup);
          const canPay = order.status === "RESERVED";
          const canCancel = order.status === "RESERVED";
          const wa = waById[order.id];

          return (
            <li key={order.id} className="rail-tag p-4 sm:p-5">
              <OrderTimeline status={order.status} />
              <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {order.code}
                    {order.mpesaRef ? ` · ${order.mpesaRef}` : ""}
                  </p>
                  <p className="mt-1 font-display text-2xl uppercase tracking-wide">
                    {order.brand} {order.model}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Size {order.size} · KES{" "}
                    {order.priceKes.toLocaleString("en-KE")}
                    {order.creditApplied > 0
                      ? ` · credit −${order.creditApplied.toLocaleString("en-KE")}`
                      : ""}
                  </p>
                </div>
                <Link
                  href={`/rail/${order.railId}`}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] hover:text-nairobi"
                >
                  Rail #{order.railId}
                </Link>
              </div>

              {canPay ? (
                <div className="mt-3">
                  <HoldCountdown reservedUntil={order.reservedUntil} />
                </div>
              ) : null}

              <div className="mt-4 border-t border-dashed border-ink/20 pt-3 text-sm text-muted">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
                  {guide.title}
                </p>
                <p className="mt-1">{guide.when}</p>
                <p className="mt-1">Bring: {guide.bring}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {canPay ? (
                  <button
                    type="button"
                    className="sayari-btn-tag !px-3 !py-2"
                    disabled={pending}
                    onClick={() =>
                      void run({
                        action: "pay",
                        orderId: order.id,
                        useCredit,
                      })
                    }
                  >
                    Pay now
                  </button>
                ) : null}
                {canCancel ? (
                  <button
                    type="button"
                    className="sayari-btn-ghost !px-3 !py-2"
                    disabled={pending}
                    onClick={() =>
                      void run({ action: "cancel", orderId: order.id })
                    }
                  >
                    Cancel hold
                  </button>
                ) : null}
                {order.status === "RESERVED" ||
                order.status === "PAID" ||
                order.status === "READY" ? (
                  wa ? (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className="sayari-btn-ghost !px-3 !py-2"
                    >
                      WhatsApp
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="sayari-btn-ghost !px-3 !py-2"
                      disabled={pending}
                      onClick={() =>
                        void run({ action: "whatsapp", orderId: order.id })
                      }
                    >
                      WhatsApp
                    </button>
                  )
                ) : null}
              </div>

              {demoPay && order.status === "PAID" ? (
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  Demo M-Pesa — live Daraja when keys are set.
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
