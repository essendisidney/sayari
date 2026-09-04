import { FOUND_PLACES } from "@/lib/lookbook";

export type FoundPlace = (typeof FOUND_PLACES)[number];

/** Schematic positions on a 100×100 canvas — not a real GIS map. */
export type FoundNode = {
  place: FoundPlace;
  x: number;
  y: number;
  blurb: string;
};

const NODE_META: Record<
  FoundPlace,
  { x: number; y: number; blurb: string }
> = {
  Westlands: {
    x: 28,
    y: 22,
    blurb: "Mall clear-outs and estate hand-offs.",
  },
  Lavington: {
    x: 34,
    y: 34,
    blurb: "Quiet finds. Unexpected pairs.",
  },
  Kilimani: {
    x: 42,
    y: 40,
    blurb: "Apartment clear-outs. Soft miles.",
  },
  Kawangware: {
    x: 30,
    y: 48,
    blurb: "Estate finds. Street-tested.",
  },
  "Ngong Road": {
    x: 40,
    y: 52,
    blurb: "Stall energy. Weekend hunters.",
  },
  Karen: {
    x: 22,
    y: 62,
    blurb: "Suburb shelves. Clean grades.",
  },
  CBD: {
    x: 55,
    y: 42,
    blurb: "City centre. High turnover. Don't sleep.",
  },
  Eastlands: {
    x: 72,
    y: 38,
    blurb: "Honest wear. Real bargains.",
  },
  "South B": {
    x: 62,
    y: 58,
    blurb: "Weekend pairs. Lived-in soles.",
  },
};

export function allFoundNodes(): FoundNode[] {
  return FOUND_PLACES.map((place) => ({
    place,
    ...NODE_META[place],
  }));
}

export type PlaceCounts = {
  found: number;
  hold: number;
  sold: number;
  total: number;
};

export function emptyCounts(): PlaceCounts {
  return { found: 0, hold: 0, sold: 0, total: 0 };
}
