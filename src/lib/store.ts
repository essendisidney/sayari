import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { filterRail, formatLastSeen, seedRailIfEmpty } from "@/lib/rail";
import { foundingTier, POINT_AWARDS, sayariIdFromNumber } from "@/lib/taxonomy";
import { normalizeKenyanPhone } from "@/lib/phone";
import type {
  ClosetItem,
  ClosetUsage,
  FindRequest,
  FoundingMemberInput,
  GenderPreference,
  PointEvent,
  Profile,
  RailPair,
  StoreData,
  WishlistItem,
} from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const storeFile = path.join(dataDir, "store.json");
const legacyFoundersFile = path.join(dataDir, "founders.json");
const HOLD_HOURS = 6;

const emptyStore = (): StoreData => ({
  profiles: [],
  closetItems: [],
  wishlistItems: [],
  ledger: [],
  otps: [],
  sessions: [],
  rail: [],
  findRequests: [],
});

let queue: Promise<unknown> = Promise.resolve();

function withStore<T>(
  fn: (store: StoreData) => Promise<T> | T,
  persist: boolean,
): Promise<T> {
  const run = queue.then(async () => {
    const store = await loadStore();
    pruneExpired(store);
    const result = await fn(store);
    if (persist) await saveStore(store);
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function readStore<T>(fn: (store: StoreData) => Promise<T> | T): Promise<T> {
  return withStore(fn, false);
}

function writeStore<T>(fn: (store: StoreData) => Promise<T> | T): Promise<T> {
  return withStore(fn, true);
}

async function loadStore(): Promise<StoreData> {
  try {
    const raw = await readFile(storeFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    const store: StoreData = {
      ...emptyStore(),
      ...parsed,
      rail: Array.isArray(parsed.rail) ? parsed.rail : [],
      findRequests: Array.isArray(parsed.findRequests) ? parsed.findRequests : [],
    };
    const before = store.rail.length;
    store.rail = seedRailIfEmpty(store.rail);
    await migrateLegacyFounders(store);
    pruneExpired(store);
    if (before === 0 && store.rail.length > 0) await saveStore(store);
    return store;
  } catch {
    const store = emptyStore();
    store.rail = seedRailIfEmpty(store.rail);
    await migrateLegacyFounders(store);
    return store;
  }
}

async function saveStore(store: StoreData) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storeFile, JSON.stringify(store, null, 2), "utf8");
}

async function migrateLegacyFounders(store: StoreData) {
  if (store.profiles.length > 0) return;
  try {
    const raw = await readFile(legacyFoundersFile, "utf8");
    const rows = JSON.parse(raw) as Array<Record<string, unknown>>;
    for (const row of rows) {
      const phone = normalizeKenyanPhone(String(row.phone ?? ""));
      if (!phone) continue;
      const foundingNumber = Number(row.foundingNumber ?? store.profiles.length + 1);
      const now = String(row.createdAt ?? new Date().toISOString());
      store.profiles.push({
        id: String(row.id ?? crypto.randomUUID()),
        sayariId: sayariIdFromNumber(foundingNumber),
        phone,
        displayName: String(row.name ?? "Shoeholic"),
        shoeSize: Number(row.shoeSize ?? 42),
        genderPreference: null,
        categories: Array.isArray(row.categories)
          ? row.categories.map(String)
          : [],
        favouriteBrands: String(row.favouriteBrands ?? ""),
        buyFrequency: String(row.buyFrequency ?? ""),
        budgetBand: String(row.budgetBand ?? ""),
        currentShops: String(row.currentShops ?? ""),
        frustration: String(row.frustration ?? ""),
        wouldTrade: Boolean(row.wouldTrade),
        wantsRecommendations: Boolean(row.wantsRecommendations),
        foundingNumber,
        foundingTier: String(row.foundingTier ?? foundingTier(foundingNumber)),
        points: POINT_AWARDS.join,
        phoneVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch {
    // no legacy file
  }
}

function pruneExpired(store: StoreData) {
  const now = Date.now();
  store.otps = store.otps.filter((row) => Date.parse(row.expiresAt) > now);
  store.sessions = store.sessions.filter((row) => Date.parse(row.expiresAt) > now);
  for (const pair of store.rail) {
    if (
      pair.status === "HOLD" &&
      pair.heldUntil &&
      Date.parse(pair.heldUntil) <= now
    ) {
      pair.status = "FOUND";
      pair.heldUntil = null;
      pair.heldByProfileId = null;
      pair.lastSeen = formatLastSeen();
    }
  }
}

function award(
  store: StoreData,
  profile: Profile,
  reason: string,
  amount: number,
) {
  const already = store.ledger.some(
    (row) => row.profileId === profile.id && row.reason === reason,
  );
  if (already && (reason === "join" || reason === "verify" || reason === "gender")) {
    return;
  }
  profile.points += amount;
  const event: PointEvent = {
    id: crypto.randomUUID(),
    profileId: profile.id,
    reason,
    amount,
    createdAt: new Date().toISOString(),
  };
  store.ledger.push(event);
}

export async function getFounderCount(): Promise<number> {
  return readStore((store) => store.profiles.length);
}

export async function createFounder(input: FoundingMemberInput): Promise<Profile> {
  return writeStore((store) => {
    const existing = store.profiles.find((row) => row.phone === input.phone);
    if (existing) {
      throw new Error("That phone is already on the founding list.");
    }
    const now = new Date().toISOString();
    const foundingNumber = store.profiles.length + 1;
    const profile: Profile = {
      id: crypto.randomUUID(),
      sayariId: sayariIdFromNumber(foundingNumber),
      phone: input.phone,
      displayName: input.name,
      shoeSize: input.shoeSize,
      genderPreference: null,
      categories: input.categories,
      favouriteBrands: input.favouriteBrands,
      buyFrequency: input.buyFrequency,
      budgetBand: input.budgetBand,
      currentShops: input.currentShops,
      frustration: input.frustration,
      wouldTrade: input.wouldTrade,
      wantsRecommendations: input.wantsRecommendations,
      foundingNumber,
      foundingTier: foundingTier(foundingNumber),
      points: 0,
      phoneVerifiedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    award(store, profile, "join", POINT_AWARDS.join);
    store.profiles.push(profile);
    return profile;
  });
}

export async function getProfileByPhone(phone: string): Promise<Profile | null> {
  return readStore(
    (store) => store.profiles.find((row) => row.phone === phone) ?? null,
  );
}

export async function getProfileById(id: string): Promise<Profile | null> {
  return readStore(
    (store) => store.profiles.find((row) => row.id === id) ?? null,
  );
}

export async function saveOtp(record: StoreData["otps"][number]) {
  return writeStore((store) => {
    store.otps = store.otps.filter((row) => row.phone !== record.phone);
    store.otps.push(record);
  });
}

export async function readOtp(phone: string) {
  return readStore(
    (store) => store.otps.find((row) => row.phone === phone) ?? null,
  );
}

export async function bumpOtpAttempt(phone: string) {
  return writeStore((store) => {
    const row = store.otps.find((item) => item.phone === phone);
    if (row) row.attempts += 1;
    return row ?? null;
  });
}

export async function consumeOtp(phone: string) {
  return writeStore((store) => {
    store.otps = store.otps.filter((row) => row.phone !== phone);
  });
}

export async function markPhoneVerified(profileId: string): Promise<Profile | null> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === profileId);
    if (!profile) return null;
    if (!profile.phoneVerifiedAt) {
      profile.phoneVerifiedAt = new Date().toISOString();
      award(store, profile, "verify", POINT_AWARDS.verify);
      profile.updatedAt = new Date().toISOString();
    }
    return profile;
  });
}

export async function createSession(record: StoreData["sessions"][number]) {
  return writeStore((store) => {
    store.sessions.push(record);
  });
}

export async function getSession(tokenHash: string) {
  return readStore(
    (store) => store.sessions.find((row) => row.tokenHash === tokenHash) ?? null,
  );
}

export async function deleteSession(tokenHash: string) {
  return writeStore((store) => {
    store.sessions = store.sessions.filter((row) => row.tokenHash !== tokenHash);
  });
}

export async function updateGender(
  profileId: string,
  genderPreference: GenderPreference,
): Promise<Profile | null> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === profileId);
    if (!profile) return null;
    const firstTime = profile.genderPreference === null;
    profile.genderPreference = genderPreference;
    profile.updatedAt = new Date().toISOString();
    if (firstTime) award(store, profile, "gender", POINT_AWARDS.gender);
    return profile;
  });
}

export async function listCloset(profileId: string): Promise<ClosetItem[]> {
  return readStore((store) =>
    store.closetItems.filter((row) => row.profileId === profileId),
  );
}

export async function addClosetItem(input: {
  profileId: string;
  name: string;
  brand: string;
  size: number;
  category: string;
  boughtOn: string;
  usage: ClosetUsage;
}): Promise<ClosetItem> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === input.profileId);
    if (!profile) throw new Error("Profile not found.");
    const item: ClosetItem = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    store.closetItems.push(item);
    award(store, profile, `closet:${item.id}`, POINT_AWARDS.closet);
    profile.updatedAt = new Date().toISOString();
    return item;
  });
}

export async function removeClosetItem(profileId: string, itemId: string) {
  return writeStore((store) => {
    const before = store.closetItems.length;
    store.closetItems = store.closetItems.filter(
      (row) => !(row.id === itemId && row.profileId === profileId),
    );
    return store.closetItems.length < before;
  });
}

export async function listWishlist(profileId: string): Promise<WishlistItem[]> {
  return readStore((store) =>
    store.wishlistItems.filter((row) => row.profileId === profileId),
  );
}

export async function addWishlistItem(input: {
  profileId: string;
  name: string;
  notes: string;
}): Promise<WishlistItem> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === input.profileId);
    if (!profile) throw new Error("Profile not found.");
    const item: WishlistItem = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    store.wishlistItems.push(item);
    award(store, profile, `wishlist:${item.id}`, POINT_AWARDS.wishlist);
    profile.updatedAt = new Date().toISOString();
    return item;
  });
}

export async function removeWishlistItem(profileId: string, itemId: string) {
  return writeStore((store) => {
    const before = store.wishlistItems.length;
    store.wishlistItems = store.wishlistItems.filter(
      (row) => !(row.id === itemId && row.profileId === profileId),
    );
    return store.wishlistItems.length < before;
  });
}

export async function identityFor(profile: Profile) {
  const closet = await listCloset(profile.id);
  const wishlist = await listWishlist(profile.id);
  return {
    profile: toPublicIdentity(profile, closet.length, wishlist.length),
    closet,
    wishlist,
    insight: closetInsight(profile, closet),
  };
}

export function toPublicIdentity(
  profile: Profile,
  closetCount: number,
  wishlistCount: number,
) {
  return {
    sayariId: profile.sayariId,
    displayName: profile.displayName,
    maskedPhone: `${profile.phone.slice(0, 6)} *** ${profile.phone.slice(-3)}`,
    shoeSize: profile.shoeSize,
    genderPreference: profile.genderPreference,
    categories: profile.categories,
    favouriteBrands: profile.favouriteBrands,
    buyFrequency: profile.buyFrequency,
    budgetBand: profile.budgetBand,
    wouldTrade: profile.wouldTrade,
    wantsRecommendations: profile.wantsRecommendations,
    foundingNumber: profile.foundingNumber,
    foundingTier: profile.foundingTier,
    points: profile.points,
    phoneVerified: Boolean(profile.phoneVerifiedAt),
    closetCount,
    wishlistCount,
  };
}

export function closetInsight(profile: Profile, closet: ClosetItem[]): string {
  if (closet.length === 0) {
    return `Size ${profile.shoeSize}. ${profile.budgetBand}. Closet is empty — add the pairs you already own.`;
  }
  const counts = new Map<string, number>();
  for (const item of closet) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return `Size ${profile.shoeSize}. ${closet.length} pair${closet.length === 1 ? "" : "s"}. Mostly ${top[0].toLowerCase()}. ${profile.budgetBand}.`;
}

export async function listRail(filter: {
  size?: number | null;
  budgetMaxKes?: number | null;
  category?: string | null;
} = {}): Promise<RailPair[]> {
  return readStore((store) => filterRail(store.rail, filter));
}

export async function getRailPair(id: string): Promise<RailPair | null> {
  const key = id.trim().toUpperCase().replace(/^#/, "");
  return readStore((store) => {
    const exact = store.rail.find((row) => row.id.toUpperCase() === key);
    if (exact) return exact;
    if (/^\d+$/.test(key)) {
      return (
        store.rail.find((row) => row.id.toUpperCase() === `NBO-${key.padStart(3, "0")}`) ??
        null
      );
    }
    return null;
  });
}

export async function holdRailPair(
  id: string,
  profileId: string | null,
): Promise<RailPair | null> {
  return writeStore((store) => {
    const pair = store.rail.find((row) => row.id.toUpperCase() === id.toUpperCase());
    if (!pair || pair.status === "SOLD") return null;
    if (pair.status === "HOLD" && pair.heldByProfileId && pair.heldByProfileId !== profileId) {
      throw new Error("That pair is already on hold.");
    }
    pair.status = "HOLD";
    pair.heldByProfileId = profileId;
    pair.heldUntil = new Date(Date.now() + HOLD_HOURS * 60 * 60 * 1000).toISOString();
    pair.lastSeen = formatLastSeen();
    return pair;
  });
}

export async function createFindRequest(input: {
  profileId: string | null;
  size: number;
  budgetMaxKes: number;
  category: string;
  colours: string;
  notes: string;
}): Promise<{ request: FindRequest; matches: RailPair[] }> {
  return writeStore((store) => {
    const matches = filterRail(store.rail, {
      size: input.size,
      budgetMaxKes: input.budgetMaxKes,
      category: input.category,
    }).slice(0, 5);

    const request: FindRequest = {
      id: crypto.randomUUID(),
      profileId: input.profileId,
      size: input.size,
      budgetMaxKes: input.budgetMaxKes,
      category: input.category,
      colours: input.colours,
      notes: input.notes,
      matchIds: matches.map((row) => row.id),
      createdAt: new Date().toISOString(),
    };
    store.findRequests.push(request);

    if (input.profileId) {
      const profile = store.profiles.find((row) => row.id === input.profileId);
      if (profile) {
        award(store, profile, `find:${request.id}`, POINT_AWARDS.find);
        profile.updatedAt = new Date().toISOString();
      }
    }

    return { request, matches };
  });
}

