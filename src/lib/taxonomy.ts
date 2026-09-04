export const COMMUNITIES = [
  "Sneakers",
  "Office",
  "Casual",
  "Ladies",
  "Streetwear",
  "Luxury",
  "Sports",
  "Boots",
] as const;

export const BUY_FREQUENCIES = [
  "Every few weeks",
  "Every 1–3 months",
  "A few times a year",
  "Only when I need to",
] as const;

export const BUDGET_BANDS = [
  "Under KSh 5,000",
  "KSh 5,000–8,000",
  "KSh 8,000–15,000",
  "KSh 15,000–25,000",
  "KSh 25,000+",
] as const;

export const WEEKLY_RITUALS = [
  { day: "Mon", name: "Shoe of the Week" },
  { day: "Tue", name: "Rate This Fit" },
  { day: "Wed", name: "Sneaker Battle" },
  { day: "Thu", name: "What's In Your Closet?" },
  { day: "Fri", name: "Weekend Drop · Westlands" },
  { day: "Sat", name: "Show Us Your Kicks" },
  { day: "Sun", name: "WhatsApp Restock" },
] as const;

export const KENYAN_SIZES = [
  35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
] as const;

export const GENDER_PREFERENCES = [
  "Menswear",
  "Womenswear",
  "Kids",
  "All",
] as const;

export const CLOSET_USAGE = [
  "Frequent",
  "Work",
  "Weekend",
  "Occasion",
  "Rarely",
] as const;

export const POINT_AWARDS = {
  join: 50,
  verify: 25,
  closet: 15,
  wishlist: 10,
  gender: 10,
  find: 5,
  rewearSubmit: 20,
  rewearCredit: 40,
  reserve: 10,
  purchase: 50,
  spotted: 15,
  spottedVote: 2,
} as const;

export const FOUNDING_CAP = 500;

export function sayariIdFromNumber(n: number): string {
  return `SY-${String(n).padStart(4, "0")}`;
}

export function foundingTier(n: number): string {
  if (n <= 100) return "Sayari Founding Member";
  if (n <= 500) return "Founding Shoeholic";
  return "Shoeholic";
}
