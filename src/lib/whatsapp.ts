/** Business WhatsApp — override with SAYARI_WHATSAPP_NUMBER (digits only, country code). */
export function sayariWhatsAppNumber(): string {
  return (process.env.SAYARI_WHATSAPP_NUMBER ?? "254700000000").replace(/\D/g, "");
}

export function whatsappHref(message: string): string {
  return `https://wa.me/${sayariWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function grabPairMessage(pair: {
  id: string;
  brand: string;
  model: string;
  size: number;
  price: string;
  found: string;
}): string {
  return [
    `RAIL #${pair.id}`,
    `${pair.brand} ${pair.model}`,
    `Size ${pair.size} · ${pair.price}`,
    `FOUND — ${pair.found}`,
    "",
    "Niko interested. Hold this pair?",
  ].join("\n");
}

export function findRequestMessage(input: {
  size: number;
  budgetMaxKes: number;
  category: string;
  colours: string;
  notes?: string;
  matchLine?: string;
}): string {
  const lines = [
    "NIKO NA SIZE " + input.size + ".",
    `Looking for: ${input.category || "Anything good"}`,
    `Budget: up to KES ${input.budgetMaxKes.toLocaleString("en-KE")}`,
  ];
  if (input.colours.trim()) lines.push(`Colours: ${input.colours.trim()}`);
  if (input.notes?.trim()) lines.push(`Notes: ${input.notes.trim()}`);
  if (input.matchLine) {
    lines.push("", "Matches on the rail:", input.matchLine);
  }
  lines.push("", "Sayari finds the pair.");
  return lines.join("\n");
}
