"use client";

import type { RailPair } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function GrabPairButton({ pair }: { pair: RailPair }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function grab() {
    if (pair.status === "SOLD") return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/rail/${pair.id}/hold`, { method: "POST" });
      const payload = (await response.json()) as {
        error?: string;
        whatsappUrl?: string;
      };
      if (!response.ok) throw new Error(payload.error ?? "Could not hold that.");
      if (payload.whatsappUrl) {
        window.open(payload.whatsappUrl, "_blank", "noopener,noreferrer");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not hold that.");
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

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="sayari-btn-tag"
        disabled={pending}
        onClick={grab}
      >
        {pending
          ? "Holding…"
          : pair.status === "HOLD"
            ? "Still interested → WhatsApp"
            : "Grab it → WhatsApp"}
      </button>
      {error ? <p className="text-sm text-nairobi">{error}</p> : null}
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Hold lasts 6 hours. Confirm on WhatsApp.
      </p>
    </div>
  );
}
