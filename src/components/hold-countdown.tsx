"use client";

import { formatHoldRemaining, holdRemainingMs } from "@/lib/commerce";
import { useEffect, useState } from "react";

export function HoldCountdown({
  reservedUntil,
  className = "",
}: {
  reservedUntil: string;
  className?: string;
}) {
  const [ms, setMs] = useState(() => holdRemainingMs(reservedUntil));

  useEffect(() => {
    setMs(holdRemainingMs(reservedUntil));
    const id = window.setInterval(() => {
      setMs(holdRemainingMs(reservedUntil));
    }, 30000);
    return () => window.clearInterval(id);
  }, [reservedUntil]);

  const expired = ms <= 0;

  return (
    <p
      className={`font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
        expired ? "text-nairobi" : "text-ink"
      } ${className}`}
    >
      {expired ? "Hold expired — pair may be back on the rail" : formatHoldRemaining(ms)}
    </p>
  );
}
