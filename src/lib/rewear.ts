import type { ClosetUsage } from "@/lib/types";

export const REWEAR_GRADES = [
  { id: "A", label: "Grade A · like new", score: "9.5/10", factor: 0.72 },
  { id: "B", label: "Very Good", score: "8.5/10", factor: 0.58 },
  { id: "C", label: "Good · honest wear", score: "7/10", factor: 0.45 },
  { id: "D", label: "Lived in", score: "5.5/10", factor: 0.32 },
] as const;

export type RewearGradeId = (typeof REWEAR_GRADES)[number]["id"];

const BRAND_BASE_KES: Record<string, number> = {
  nike: 9000,
  adidas: 7500,
  "new balance": 8500,
  puma: 5500,
  clarks: 7000,
  bata: 3500,
  converse: 5000,
  vans: 5500,
  timberland: 9500,
  dr: 9000,
  default: 6000,
};

const USAGE_TRIM: Record<ClosetUsage, number> = {
  Rarely: 1.08,
  Occasion: 1.02,
  Weekend: 0.95,
  Work: 0.9,
  Frequent: 0.82,
};

function brandBase(brand: string): number {
  const key = brand.trim().toLowerCase();
  for (const [name, value] of Object.entries(BRAND_BASE_KES)) {
    if (name !== "default" && key.includes(name)) return value;
  }
  return BRAND_BASE_KES.default;
}

export function estimateRewear(input: {
  brand: string;
  gradeId: RewearGradeId;
  usage?: ClosetUsage | null;
}): {
  estimatedValueKes: number;
  creditKes: number;
  resaleKes: number;
  grade: (typeof REWEAR_GRADES)[number];
} {
  const grade =
    REWEAR_GRADES.find((row) => row.id === input.gradeId) ?? REWEAR_GRADES[1];
  const base = brandBase(input.brand);
  const usageFactor = input.usage ? USAGE_TRIM[input.usage] : 1;
  const estimatedValueKes = Math.round((base * grade.factor * usageFactor) / 100) * 100;
  const creditKes = Math.round((estimatedValueKes * 0.72) / 100) * 100;
  const resaleKes = Math.round((estimatedValueKes * 1.18) / 100) * 100;
  return { estimatedValueKes, creditKes, resaleKes, grade };
}

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function nextRailId(existingIds: string[]): string {
  let max = 0;
  for (const id of existingIds) {
    const match = /^NBO-(\d+)$/i.exec(id);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `NBO-${String(max + 1).padStart(3, "0")}`;
}
