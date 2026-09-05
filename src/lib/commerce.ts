import { FOUND_PLACES } from "@/lib/lookbook";
import type { OrderStatus } from "@/lib/types";

export const PICKUP_SPOTS = [
  "Westlands",
  "Kilimani",
  "CBD",
  "Ngong Road",
  "Lavington",
  "WhatsApp delivery",
] as const;

export type PickupSpot = (typeof PICKUP_SPOTS)[number];

export function isPickupSpot(value: string): value is PickupSpot {
  return (PICKUP_SPOTS as readonly string[]).includes(value);
}

export function orderCodeFromId(id: string): string {
  return `SYO-${id.slice(0, 8).toUpperCase()}`;
}

export function splitPayment(input: {
  priceKes: number;
  creditKes: number;
  useCredit: boolean;
}): { creditApplied: number; mpesaDue: number } {
  if (!input.useCredit || input.creditKes <= 0) {
    return { creditApplied: 0, mpesaDue: input.priceKes };
  }
  const creditApplied = Math.min(input.creditKes, input.priceKes);
  return {
    creditApplied,
    mpesaDue: Math.max(0, input.priceKes - creditApplied),
  };
}

export function dropWeekLabel(date = new Date()): string {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function neighbourhoods(): readonly string[] {
  return FOUND_PLACES;
}

/** True when Daraja env is present — otherwise pay is demo stub. */
export function mpesaIsLive(): boolean {
  return Boolean(
    process.env.SAYARI_MPESA_SHORTCODE &&
      process.env.SAYARI_MPESA_PASSKEY &&
      process.env.SAYARI_MPESA_CONSUMER_KEY &&
      process.env.SAYARI_MPESA_CONSUMER_SECRET,
  );
}

export function pickupGuide(spot: string): {
  title: string;
  when: string;
  bring: string;
  note: string;
} {
  if (spot === "WhatsApp delivery") {
    return {
      title: "WhatsApp delivery",
      when: "We confirm a window after payment — usually same day in Nairobi.",
      bring: "Sayari ID + order code on your phone.",
      note: "Pin drop via WhatsApp. Rider holds till you confirm.",
    };
  }
  return {
    title: `${spot} pickup`,
    when: "Same day once status hits READY — usually within business hours.",
    bring: "Sayari ID · order code · the phone you reserved with.",
    note: "We'll ping WhatsApp when the pair is bagged and waiting.",
  };
}

export function holdRemainingMs(reservedUntil: string, now = Date.now()): number {
  return Math.max(0, Date.parse(reservedUntil) - now);
}

export function formatHoldRemaining(ms: number): string {
  if (ms <= 0) return "Expired";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m left`;
  return `${h}h ${m.toString().padStart(2, "0")}m left`;
}

export type TimelineStep = {
  key: OrderStatus | "HOLD";
  label: string;
  done: boolean;
  current: boolean;
};

export function orderTimeline(status: OrderStatus): TimelineStep[] {
  const flow: Array<OrderStatus | "HOLD"> = [
    "RESERVED",
    "PAID",
    "READY",
    "COLLECTED",
  ];

  if (status === "CANCELLED" || status === "EXPIRED") {
    return [
      {
        key: "RESERVED",
        label: "Reserved",
        done: true,
        current: false,
      },
      {
        key: status,
        label: status === "EXPIRED" ? "Hold expired" : "Cancelled",
        done: true,
        current: true,
      },
    ];
  }

  const idx = flow.indexOf(status);
  return flow.map((key, i) => ({
    key,
    label:
      key === "RESERVED"
        ? "Hold"
        : key === "PAID"
          ? "Paid"
          : key === "READY"
            ? "Ready"
            : "Collected",
    done: i < idx,
    current: i === idx,
  }));
}
