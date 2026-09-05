import { orderTimeline } from "@/lib/commerce";
import type { OrderStatus } from "@/lib/types";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const steps = orderTimeline(status);

  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step) => (
        <li
          key={`${step.key}-${step.label}`}
          className={`border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${
            step.current
              ? "border-nairobi bg-nairobi text-bone"
              : step.done
                ? "border-ink bg-ink text-bone"
                : "border-ink/25 text-muted"
          }`}
        >
          {step.label}
        </li>
      ))}
    </ol>
  );
}
