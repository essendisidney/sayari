import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  bumpOtpAttempt,
  consumeOtp,
  createSession,
  deleteSession,
  getProfileById,
  getProfileByPhone,
  getSession,
  identityFor,
  markPhoneVerified,
  readOtp,
  saveOtp,
} from "@/lib/store";

export const SESSION_COOKIE = "sayari_session";
const OTP_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

export function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hashesMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function issueOtp(phone: string) {
  const profile = await getProfileByPhone(phone);
  if (!profile) {
    throw new Error("Join Shoeholics first — that number is not on the list.");
  }
  const existing = await readOtp(phone);
  if (existing) {
    const age = Date.now() - Date.parse(existing.createdAt);
    if (age < 30_000) {
      throw new Error("Wait a few seconds before requesting another code.");
    }
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const now = Date.now();
  await saveOtp({
    phone,
    codeHash: hashSecret(code),
    attempts: 0,
    expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
    createdAt: new Date(now).toISOString(),
  });
  return {
    profile,
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  };
}

export async function verifyOtp(phone: string, code: string) {
  const profile = await getProfileByPhone(phone);
  if (!profile) {
    throw new Error("Join Shoeholics first — that number is not on the list.");
  }
  const otp = await readOtp(phone);
  if (!otp || Date.parse(otp.expiresAt) <= Date.now()) {
    throw new Error("That code has expired. Request a new one.");
  }
  if (otp.attempts >= MAX_OTP_ATTEMPTS) {
    await consumeOtp(phone);
    throw new Error("Too many attempts. Request a new code.");
  }
  if (!hashesMatch(otp.codeHash, hashSecret(code.trim()))) {
    await bumpOtpAttempt(phone);
    throw new Error("That code is not right.");
  }
  await consumeOtp(phone);
  const verified = (await markPhoneVerified(profile.id)) ?? profile;
  const token = randomBytes(32).toString("hex");
  await createSession({
    tokenHash: hashSecret(token),
    profileId: verified.id,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    createdAt: new Date().toISOString(),
  });
  return { token, profile: verified };
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(hashSecret(token));
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentProfile() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await getSession(hashSecret(token));
  if (!session || Date.parse(session.expiresAt) <= Date.now()) return null;
  return getProfileById(session.profileId);
}

export async function getCurrentIdentity() {
  const profile = await getCurrentProfile();
  if (!profile) return null;
  return identityFor(profile);
}
