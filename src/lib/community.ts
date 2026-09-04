export const SPOTTED_LANES = [
  "Best Find",
  "Best Fit",
  "Best Bargain",
  "Unexpected",
  "Shoe of the Week",
] as const;

export type SpottedLane = (typeof SPOTTED_LANES)[number];

export function isSpottedLane(value: string): value is SpottedLane {
  return (SPOTTED_LANES as readonly string[]).includes(value);
}

export const SPOTTED_SEED = [
  {
    id: "spot-seed-1",
    profileId: "seed",
    sayariId: "SY-0007",
    displayName: "Amina",
    caption: "Dunk from the CBD rail. Clean with jeans.",
    neighbourhood: "CBD",
    lane: "Best Fit",
    imageUrl: "/lookbook/street-fit-nairobi.jpg",
    railId: "NBO-041",
    votes: 18,
    featured: true,
    createdAt: "2026-09-02T10:00:00.000Z",
  },
  {
    id: "spot-seed-2",
    profileId: "seed",
    sayariId: "SY-0012",
    displayName: "Brian",
    caption: "Samba hunt · Eastlands energy.",
    neighbourhood: "Eastlands",
    lane: "Best Find",
    imageUrl: "/lookbook/market-shoes.jpg",
    railId: "NBO-008",
    votes: 14,
    featured: false,
    createdAt: "2026-09-03T08:00:00.000Z",
  },
  {
    id: "spot-seed-3",
    profileId: "seed",
    sayariId: "SY-0021",
    displayName: "Wanjiku",
    caption: "Bata Oxford for 2.8K. Office flex.",
    neighbourhood: "Upper Hill",
    lane: "Best Bargain",
    imageUrl: "/lookbook/storefront.jpg",
    railId: "NBO-031",
    votes: 11,
    featured: false,
    createdAt: "2026-09-03T14:00:00.000Z",
  },
  {
    id: "spot-seed-4",
    profileId: "seed",
    sayariId: "SY-0003",
    displayName: "Otieno",
    caption: "Clarks in Lavington. Did not see that coming.",
    neighbourhood: "Lavington",
    lane: "Unexpected",
    imageUrl: "/lookbook/urban-shoe.jpg",
    railId: "NBO-022",
    votes: 9,
    featured: false,
    createdAt: "2026-09-04T09:00:00.000Z",
  },
] as const;
