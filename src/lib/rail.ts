import type { RailPair } from "@/lib/types";
import { RAIL_SEED } from "@/lib/lookbook";

export type RailFilter = {
  size?: number | null;
  budgetMaxKes?: number | null;
  budgetMinKes?: number | null;
  category?: string | null;
  found?: string | null;
  query?: string | null;
  status?: RailPair["status"] | "AVAILABLE" | null;
};

/** Soft match for the WhatsApp stylist — size exact, then budget + lane. */
export function scoreRailMatch(
  pair: RailPair,
  filter: RailFilter,
): number {
  if (pair.status === "SOLD") return -1;
  if (filter.status === "AVAILABLE" && pair.status !== "FOUND") return -1;
  if (
    filter.status &&
    filter.status !== "AVAILABLE" &&
    pair.status !== filter.status
  ) {
    return -1;
  }
  if (filter.size != null && pair.size !== filter.size) return -1;

  let score = 10;
  if (pair.status === "HOLD") score -= 4;

  if (filter.budgetMaxKes != null && filter.budgetMaxKes > 0) {
    if (pair.priceKes > filter.budgetMaxKes) return -1;
    const headroom = filter.budgetMaxKes - pair.priceKes;
    score += Math.min(8, Math.floor(headroom / 1000));
  }
  if (filter.budgetMinKes != null && filter.budgetMinKes > 0) {
    if (pair.priceKes < filter.budgetMinKes) return -1;
  }

  if (filter.found) {
    if (pair.found.toLowerCase() !== filter.found.toLowerCase()) return -1;
    score += 6;
  }

  if (filter.query?.trim()) {
    const q = filter.query.trim().toLowerCase();
    const hay =
      `${pair.brand} ${pair.model} ${pair.found} ${pair.category} ${pair.id}`.toLowerCase();
    if (!hay.includes(q)) return -1;
    score += 15;
  }

  if (filter.category && filter.category !== "Anything") {
    const needle = filter.category.toLowerCase();
    const hay = `${pair.category} ${pair.brand} ${pair.model}`.toLowerCase();
    if (hay.includes(needle) || needle.includes(pair.category.toLowerCase())) {
      score += 12;
    } else if (needle.includes("sneaker") && pair.category === "Sneakers") {
      score += 12;
    } else {
      score -= 2;
    }
  }

  return score;
}

export function filterRail(pairs: RailPair[], filter: RailFilter): RailPair[] {
  return pairs
    .map((pair) => ({ pair, score: scoreRailMatch(pair, filter) }))
    .filter((row) => row.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.pair);
}

export function seedRailIfEmpty(rail: RailPair[]): RailPair[] {
  if (rail.length === 0) {
    return RAIL_SEED.map((row) => ({
      ...row,
      heldUntil:
        row.status === "HOLD"
          ? new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
          : null,
      heldByProfileId: null,
    }));
  }

  // Keep demo inventory photography in sync with the lookbook.
  const seedById = new Map(RAIL_SEED.map((row) => [row.id, row]));
  return rail.map((pair) => {
    const seed = seedById.get(pair.id);
    if (!seed) return pair;
    if (pair.image === seed.image) return pair;
    return { ...pair, image: seed.image };
  });
}

export function formatLastSeen(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}
