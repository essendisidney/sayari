import type { RailPair, SizeWatch, WishlistItem } from "@/lib/types";

export function matchesSizeWatch(
  pair: RailPair,
  watch: Pick<
    SizeWatch,
    "size" | "category" | "budgetMaxKes" | "query" | "active"
  >,
): boolean {
  if (!watch.active) return false;
  if (pair.status === "SOLD") return false;
  if (pair.size !== watch.size) return false;
  if (watch.budgetMaxKes != null && pair.priceKes > watch.budgetMaxKes) {
    return false;
  }
  if (watch.category && watch.category !== "Anything") {
    const needle = watch.category.toLowerCase();
    const hay = `${pair.category} ${pair.brand} ${pair.model}`.toLowerCase();
    if (!hay.includes(needle) && !(needle.includes("sneaker") && pair.category === "Sneakers")) {
      return false;
    }
  }
  if (watch.query?.trim()) {
    const tokens = watch.query
      .trim()
      .toLowerCase()
      .split(/[\s,/]+/)
      .filter((t) => t.length >= 2);
    const hay = `${pair.brand} ${pair.model} ${pair.found}`.toLowerCase();
    if (tokens.length > 0 && !tokens.some((t) => hay.includes(t))) {
      return false;
    }
  }
  return true;
}

export function wishlistHitsPair(
  pair: RailPair,
  items: WishlistItem[],
): boolean {
  const hay = `${pair.brand} ${pair.model}`.toLowerCase();
  return items.some((item) => {
    const tokens = item.name
      .toLowerCase()
      .split(/[\s,/]+/)
      .filter((t) => t.length >= 3);
    if (tokens.length === 0) return false;
    return tokens.every((t) => hay.includes(t));
  });
}

export function liveMatchesForWatch(
  pairs: RailPair[],
  watch: SizeWatch,
): RailPair[] {
  return pairs.filter((pair) => matchesSizeWatch(pair, watch));
}
