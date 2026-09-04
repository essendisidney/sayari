import { FOUND_PLACES } from "@/lib/lookbook";

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
