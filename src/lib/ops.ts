import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const OPS_COOKIE = "sayari_ops";

function opsPin(): string {
  return process.env.SAYARI_OPS_PIN ?? "sayari-rail";
}

export function hashOpsPin(pin: string) {
  return createHash("sha256").update(`ops:${pin}`).digest("hex");
}

export function verifyOpsPin(pin: string) {
  const expected = Buffer.from(hashOpsPin(opsPin()));
  const got = Buffer.from(hashOpsPin(pin.trim()));
  if (expected.length !== got.length) return false;
  return timingSafeEqual(expected, got);
}

export async function setOpsSession() {
  const jar = await cookies();
  jar.set(OPS_COOKIE, hashOpsPin(opsPin()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearOpsSession() {
  const jar = await cookies();
  jar.delete(OPS_COOKIE);
}

export async function isOpsAuthed() {
  const jar = await cookies();
  const token = jar.get(OPS_COOKIE)?.value;
  if (!token) return false;
  const expected = hashOpsPin(opsPin());
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
