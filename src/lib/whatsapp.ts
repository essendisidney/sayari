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
  creditKes?: number;
}): string {
  const lines = [
    "NIKO NA SIZE " + input.size + ".",
    `Looking for: ${input.category || "Anything good"}`,
    `Budget: up to KES ${input.budgetMaxKes.toLocaleString("en-KE")}`,
  ];
  if (input.creditKes && input.creditKes > 0) {
    lines.push(`Sayari credit on ID: KES ${input.creditKes.toLocaleString("en-KE")}`);
  }
  if (input.colours.trim()) lines.push(`Colours: ${input.colours.trim()}`);
  if (input.notes?.trim()) lines.push(`Notes: ${input.notes.trim()}`);
  if (input.matchLine) {
    lines.push("", "Matches on the rail:", input.matchLine);
  }
  lines.push("", "Sayari finds the pair.");
  return lines.join("\n");
}

export function rewearHandoverMessage(input: {
  sayariId: string;
  brand: string;
  model: string;
  size: number;
  creditKes: number;
  rewearId: string;
}): string {
  return [
    `REWEAR · ${input.sayariId}`,
    `${input.brand} ${input.model} · Size ${input.size}`,
    `Offer accepted · Credit KES ${input.creditKes.toLocaleString("en-KE")}`,
    `Ref: ${input.rewearId.slice(0, 8)}`,
    "",
    "Ready to hand over the pair.",
  ].join("\n");
}

export function nearPlaceMessage(place: string): string {
  return [
    `FOUND — ${place.toUpperCase()}.`,
    "Niko looking near here.",
    "Size? Budget? Vibe?",
    "",
    "Sayari finds the pair.",
  ].join("\n");
}

export function armSizeWatchMessage(input: {
  size: number;
  category?: string | null;
  budgetMaxKes?: number | null;
  query?: string | null;
}): string {
  const lines = [
    `SIZE WATCH · ${input.size}`,
    "Ping me when this lands on the rail.",
  ];
  if (input.category && input.category !== "Anything") {
    lines.push(`Lane: ${input.category}`);
  }
  if (input.budgetMaxKes) {
    lines.push(`Budget up to KES ${input.budgetMaxKes.toLocaleString("en-KE")}`);
  }
  if (input.query?.trim()) lines.push(`Looking for: ${input.query.trim()}`);
  lines.push("", "Don't sleep on it.");
  return lines.join("\n");
}

export function sizeLandedMessage(pair: {
  id: string;
  brand: string;
  model: string;
  size: number;
  price: string;
  found: string;
}): string {
  return [
    `SIZE ${pair.size} JUST LANDED.`,
    `RAIL #${pair.id}`,
    `${pair.brand} ${pair.model}`,
    `${pair.price} · FOUND — ${pair.found}`,
    "",
    "One pair only. Don't sleep.",
  ].join("\n");
}

export function orderReservedMessage(input: {
  code: string;
  railId: string;
  brand: string;
  model: string;
  size: number;
  pickup: string;
  reservedUntil: string;
}): string {
  const until = new Date(input.reservedUntil).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return [
    `HOLD · ${input.code}`,
    `RAIL #${input.railId} · ${input.brand} ${input.model}`,
    `Size ${input.size}`,
    `Pickup: ${input.pickup}`,
    `Hold till ${until}`,
    "",
    "Paying now to lock. One pair only.",
  ].join("\n");
}

export function orderPaidMessage(input: {
  code: string;
  railId: string;
  brand: string;
  model: string;
  pickup: string;
  mpesaRef: string | null;
  stub: boolean;
}): string {
  return [
    `PAID · ${input.code}`,
    `RAIL #${input.railId} · ${input.brand} ${input.model}`,
    `Pickup: ${input.pickup}`,
    input.mpesaRef ? `Ref: ${input.mpesaRef}` : "",
    input.stub ? "(Demo M-Pesa — live Daraja next)" : "",
    "",
    "Ping me when READY for pickup.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function orderReadyMessage(input: {
  code: string;
  brand: string;
  model: string;
  pickup: string;
}): string {
  return [
    `READY · ${input.code}`,
    `${input.brand} ${input.model}`,
    `Pickup: ${input.pickup}`,
    "",
    "Coming through. Sayari ID + order code ready.",
  ].join("\n");
}
