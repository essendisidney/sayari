export type RailPair = {
  id: string;
  brand: string;
  model: string;
  size: number;
  grade: string;
  gradeScore: string;
  found: string;
  price: string;
  priceKes: number;
  lastSeen: string;
  image: string;
  status: "FOUND" | "HOLD" | "SOLD";
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=2000&q=80";

export const STREET_IMAGE =
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=80";

export const REWEAR_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80";

export const SPOTTED_IMAGE =
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1400&q=80";

export const RAIL: RailPair[] = [
  {
    id: "NBO-024",
    brand: "Nike",
    model: "Air Max",
    size: 42,
    grade: "Very Good",
    gradeScore: "8.5/10",
    found: "Kilimani",
    price: "KES 4,500",
    priceKes: 4500,
    lastSeen: "04.09.26",
    status: "FOUND",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "NBO-041",
    brand: "Nike",
    model: "Dunk",
    size: 42,
    grade: "Grade A",
    gradeScore: "9/10",
    found: "CBD",
    price: "KES 6,500",
    priceKes: 6500,
    lastSeen: "04.09.26",
    status: "FOUND",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "NBO-008",
    brand: "Adidas",
    model: "Samba",
    size: 41,
    grade: "Good",
    gradeScore: "7.5/10",
    found: "Eastlands",
    price: "KES 3,800",
    priceKes: 3800,
    lastSeen: "03.09.26",
    status: "FOUND",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "NBO-031",
    brand: "Bata",
    model: "Oxford",
    size: 43,
    grade: "Excellent",
    gradeScore: "9.5/10",
    found: "Upper Hill",
    price: "KES 2,800",
    priceKes: 2800,
    lastSeen: "04.09.26",
    status: "FOUND",
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "NBO-022",
    brand: "Clarks",
    model: "Desert Boot",
    size: 39,
    grade: "Very Good",
    gradeScore: "8/10",
    found: "Lavington",
    price: "KES 5,200",
    priceKes: 5200,
    lastSeen: "02.09.26",
    status: "HOLD",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "NBO-014",
    brand: "Adidas",
    model: "Campus",
    size: 41,
    grade: "Very Good",
    gradeScore: "8/10",
    found: "Ngong Road",
    price: "KES 4,200",
    priceKes: 4200,
    lastSeen: "04.09.26",
    status: "FOUND",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "NBO-003",
    brand: "New Balance",
    model: "550",
    size: 44,
    grade: "New in",
    gradeScore: "10/10",
    found: "Westlands",
    price: "KES 9,800",
    priceKes: 9800,
    lastSeen: "04.09.26",
    status: "FOUND",
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "NBO-019",
    brand: "Puma",
    model: "Suede",
    size: 40,
    grade: "Good",
    gradeScore: "7/10",
    found: "South B",
    price: "KES 3,000",
    priceKes: 3000,
    lastSeen: "01.09.26",
    status: "FOUND",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80",
  },
];

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
  "ONE PAIR ONLY",
  "FOUND IN NAIROBI",
  "PRE-LOVED · PROPERLY CHECKED",
  "KES ON THE RAIL",
  "NO RESTOCK",
  "SIZE 35–47",
  "REWEAR YOUR CLOSET",
  "SHOEHOLICS OF NAIROBI",
];

export const SHOEHOLIC_VOTES = [
  { title: "Best Find", pair: "Nike Dunk · CBD", vote: "RAIL #041" },
  { title: "Best Fit", pair: "Samba · Eastlands", vote: "RAIL #008" },
  { title: "Best Bargain", pair: "Bata Oxford · 2.8K", vote: "RAIL #031" },
  { title: "Unexpected", pair: "Clarks · Lavington", vote: "RAIL #022" },
] as const;
