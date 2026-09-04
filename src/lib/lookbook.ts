import type { RailPair } from "@/lib/types";

/**
 * Local lookbook — Nairobi street + thrift-market photography
 * (Unsplash: Dwayne Joe / Nairobi street; market stall thrift displays).
 * Replace with Sayari's own shoots when ready — keep paths under /lookbook.
 */
export const HERO_IMAGE = "/lookbook/nike-nairobi.jpg";
export const STREET_IMAGE = "/lookbook/street-fit-nairobi.jpg";
export const REWEAR_IMAGE = "/lookbook/market-shoes.jpg";
export const SPOTTED_IMAGE = "/lookbook/spotted-nairobi.jpg";
export const CULTURE_IMAGE = "/lookbook/shoeholics.jpg";
export const MARKET_IMAGE = "/lookbook/market-stalls.jpg";

/** Static seed — copied into data/store.json on first read. */
export type RailSeed = Omit<RailPair, "heldUntil" | "heldByProfileId">;

export const RAIL_SEED: RailSeed[] = [
  {
    id: "NBO-024",
    brand: "Nike",
    model: "Air Max",
    size: 42,
    category: "Sneakers",
    grade: "Very Good",
    gradeScore: "8.5/10",
    found: "Kilimani",
    price: "KES 4,500",
    priceKes: 4500,
    lastSeen: "04.09.26",
    status: "FOUND",
    story:
      "Pulled from a Kilimani clear-out. Cushion still soft. One pair only.",
    image: "/lookbook/nike-nairobi.jpg",
  },
  {
    id: "NBO-041",
    brand: "Nike",
    model: "Dunk",
    size: 42,
    category: "Sneakers",
    grade: "Grade A",
    gradeScore: "9/10",
    found: "CBD",
    price: "KES 6,500",
    priceKes: 6500,
    lastSeen: "04.09.26",
    status: "FOUND",
    story: "CBD find. Clean toebox. Looks barely worn for Nairobi miles.",
    image: "/lookbook/street-fit-nairobi.jpg",
  },
  {
    id: "NBO-008",
    brand: "Adidas",
    model: "Samba",
    size: 41,
    category: "Sneakers",
    grade: "Good",
    gradeScore: "7.5/10",
    found: "Eastlands",
    price: "KES 3,800",
    priceKes: 3800,
    lastSeen: "03.09.26",
    status: "FOUND",
    story: "Eastlands classic. Gum sole with honest wear. Ready to walk.",
    image: "/lookbook/market-shoes.jpg",
  },
  {
    id: "NBO-031",
    brand: "Bata",
    model: "Oxford",
    size: 43,
    category: "Office",
    grade: "Excellent",
    gradeScore: "9.5/10",
    found: "Upper Hill",
    price: "KES 2,800",
    priceKes: 2800,
    lastSeen: "04.09.26",
    status: "FOUND",
    story: "Upper Hill desk pair. Polish-ready. Quiet flex for Monday.",
    image: "/lookbook/storefront.jpg",
  },
  {
    id: "NBO-022",
    brand: "Clarks",
    model: "Desert Boot",
    size: 39,
    category: "Boots",
    grade: "Very Good",
    gradeScore: "8/10",
    found: "Lavington",
    price: "KES 5,200",
    priceKes: 5200,
    lastSeen: "02.09.26",
    status: "HOLD",
    story: "Lavington hand-off. Crepe sole intact. On hold until evening.",
    image: "/lookbook/urban-shoe.jpg",
  },
  {
    id: "NBO-014",
    brand: "Adidas",
    model: "Campus",
    size: 41,
    category: "Sneakers",
    grade: "Very Good",
    gradeScore: "8/10",
    found: "Ngong Road",
    price: "KES 4,200",
    priceKes: 4200,
    lastSeen: "04.09.26",
    status: "FOUND",
    story: "Ngong Road stall energy. Suede soft, shape solid.",
    image: "/lookbook/market-stalls.jpg",
  },
  {
    id: "NBO-003",
    brand: "New Balance",
    model: "550",
    size: 44,
    category: "Sneakers",
    grade: "New in",
    gradeScore: "10/10",
    found: "Westlands",
    price: "KES 9,800",
    priceKes: 9800,
    lastSeen: "04.09.26",
    status: "FOUND",
    story: "Westlands drop. Basically untouched. Archive-level condition.",
    image: "/lookbook/shoeholics.jpg",
  },
  {
    id: "NBO-019",
    brand: "Puma",
    model: "Suede",
    size: 40,
    category: "Casual",
    grade: "Good",
    gradeScore: "7/10",
    found: "South B",
    price: "KES 3,000",
    priceKes: 3000,
    lastSeen: "01.09.26",
    status: "FOUND",
    story: "South B weekend pair. Lived-in suede. Honest thrift price.",
    image: "/lookbook/spotted-nairobi.jpg",
  },
];

/** @deprecated Prefer listRail() — kept for static fallbacks. */
export const RAIL = RAIL_SEED;

export const FOUND_PLACES = [
  "Kilimani",
  "CBD",
  "Eastlands",
  "Westlands",
  "Ngong Road",
  "Lavington",
  "South B",
  "Karen",
  "Kawangware",
] as const;

export const TICKER = [
  "FOUND IN NAIROBI",
  "WORN EVERYWHERE",
  "ONE PAIR ONLY",
  "NO RESTOCK",
  "GONE IS GONE",
  "YOUR SIZE MIGHT BE HERE",
  "KES ON THE RAIL",
  "NIKO NA SIZE",
  "FOUND. CHECKED. WORN AGAIN.",
  "YOU NEVER KNOW WHAT YOU'LL FIND",
  "SHOEHOLICS",
  "REWEAR",
];

export const SHOEHOLIC_VOTES = [
  { title: "Best Find", pair: "Nike Dunk · CBD", vote: "RAIL #041" },
  { title: "Best Fit", pair: "Samba · Eastlands", vote: "RAIL #008" },
  { title: "Best Bargain", pair: "Bata Oxford · 2.8K", vote: "RAIL #031" },
  { title: "Unexpected", pair: "Clarks · Lavington", vote: "RAIL #022" },
] as const;

export const FIND_CATEGORIES = [
  "Anything",
  "Sneakers",
  "Office",
  "Casual",
  "Boots",
  "Streetwear",
  "Sports",
] as const;
