"use client";

import type { Order } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrdersList({ initial }: { initial: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel(orderId: string) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", orderId }),
      });
      const payload = (await response.json()) as {
        error?: string;
        order?: Order;
      };
      if (!response.ok) throw new Error(payload.error ?? "Cancel failed.");
      if (payload.order) {
        setOrders((current) =>
          current.map((row) => (row.id === payload.order!.id ? payload.order! : row)),
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed.");
    } finally {
      setPending(false);
    }
  }

  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted">
        No orders yet.{" "}
        <Link href="/#rail" className="underline hover:text-nairobi">
          Shop the rail
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-nairobi">{error}</p> : null}
      <ul className="divide-y divide-ink/15 border border-ink bg-bone">
        {orders.map((order) => (
          <li key={order.id} className="px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {order.status} · {order.code}
                </p>
                <p className="mt-1 font-display text-2xl uppercase tracking-wide">
                  {order.brand} {order.model}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Size {order.size} · {order.pickup} · KES{" "}
                  {order.priceKes.toLocaleString("en-KE")}
                  {order.creditApplied > 0
                    ? ` · credit −${order.creditApplied.toLocaleString("en-KE")}`
                    : ""}
                  {order.mpesaRef ? ` · ${order.mpesaRef}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/rail/${order.railId}`}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] hover:text-nairobi"
                >
                  Rail #{order.railId}
                </Link>
                {order.status === "RESERVED" ? (
                  <button
                    type="button"
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                    disabled={pending}
                    onClick={() => void cancel(order.id)}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
