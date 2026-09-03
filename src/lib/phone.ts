const KENYA_MOBILE = /^(\+?254|0)7\d{8}$/;

export function normalizeKenyanPhone(raw: string): string | null {
  const phone = raw.replace(/[\s-]/g, "");
  if (!KENYA_MOBILE.test(phone)) return null;
  const digits = phone.replace(/^\+/, "");
  if (digits.startsWith("254")) return `+${digits}`;
  return `+254${digits.slice(1)}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 8) return phone;
  return `${phone.slice(0, 6)} *** ${phone.slice(-3)}`;
}
