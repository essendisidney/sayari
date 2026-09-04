import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { orderCodeFromId, splitPayment } from "@/lib/commerce";
import {
  isSpottedLane,
  SPOTTED_SEED,
  type SpottedLane,
} from "@/lib/community";
import {
  persistenceMode,
  readRemoteStore,
  writeRemoteStore,
} from "@/lib/persist";
import { filterRail, formatLastSeen, seedRailIfEmpty } from "@/lib/rail";
import {
  estimateRewear,
  formatKes,
  nextRailId,
  type RewearGradeId,
} from "@/lib/rewear";
import { foundingTier, POINT_AWARDS, sayariIdFromNumber } from "@/lib/taxonomy";
import { normalizeKenyanPhone } from "@/lib/phone";
import type {
  AppNotification,
  ClosetItem,
  ClosetUsage,
  CreditEvent,
  FindRequest,
  FoundingMemberInput,
  GenderPreference,
  NotificationKind,
  Order,
  OrderStatus,
  PointEvent,
  Profile,
  RailPair,
  RewearSubmission,
  SpottedPost,
  StoreData,
  WishlistItem,
} from "@/lib/types";

export { persistenceMode };

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
  rewear: [],
  creditLedger: [],
  orders: [],
  spotted: [],
  spottedVotes: [],
  notifications: [],
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

function hydrateStore(parsed: Partial<StoreData>): StoreData {
  const store: StoreData = {
    ...emptyStore(),
    ...parsed,
    rail: Array.isArray(parsed.rail) ? parsed.rail : [],
    findRequests: Array.isArray(parsed.findRequests) ? parsed.findRequests : [],
    rewear: Array.isArray(parsed.rewear) ? parsed.rewear : [],
    creditLedger: Array.isArray(parsed.creditLedger) ? parsed.creditLedger : [],
    orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    spotted: Array.isArray(parsed.spotted) ? parsed.spotted : [],
    spottedVotes: Array.isArray(parsed.spottedVotes) ? parsed.spottedVotes : [],
    notifications: Array.isArray(parsed.notifications)
      ? parsed.notifications
      : [],
  };
  for (const profile of store.profiles) {
    if (typeof profile.creditKes !== "number") profile.creditKes = 0;
  }
  return store;
}

async function loadStore(): Promise<StoreData> {
  if (persistenceMode() === "supabase") {
    const remote = await readRemoteStore();
    if (remote) {
      const store = hydrateStore(remote);
      const before = store.rail.length;
      const spottedBefore = store.spotted.length;
      store.rail = seedRailIfEmpty(store.rail);
      if (store.spotted.length === 0) {
        store.spotted = SPOTTED_SEED.map((row) => ({ ...row }));
      }
      pruneExpired(store);
      if (
        (before === 0 && store.rail.length > 0) ||
        (spottedBefore === 0 && store.spotted.length > 0)
      ) {
        await saveStore(store);
      }
      return store;
    }
    const fresh = emptyStore();
    fresh.rail = seedRailIfEmpty(fresh.rail);
    fresh.spotted = SPOTTED_SEED.map((row) => ({ ...row }));
    await saveStore(fresh);
    return fresh;
  }

  try {
    const raw = await readFile(storeFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    const store = hydrateStore(parsed);
    const before = store.rail.length;
    const spottedBefore = store.spotted.length;
    store.rail = seedRailIfEmpty(store.rail);
    if (store.spotted.length === 0) {
      store.spotted = SPOTTED_SEED.map((row) => ({ ...row }));
    }
    await migrateLegacyFounders(store);
    pruneExpired(store);
    if (
      (before === 0 && store.rail.length > 0) ||
      (spottedBefore === 0 && store.spotted.length > 0)
    ) {
      await saveStore(store);
    }
    return store;
  } catch {
    const store = emptyStore();
    store.rail = seedRailIfEmpty(store.rail);
    store.spotted = SPOTTED_SEED.map((row) => ({ ...row }));
    await migrateLegacyFounders(store);
    return store;
  }
}

async function saveStore(store: StoreData) {
  if (persistenceMode() === "supabase") {
    const ok = await writeRemoteStore(store);
    if (!ok) {
      throw new Error("Could not persist Sayari store to Supabase.");
    }
    return;
  }
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
        creditKes: 0,
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
  for (const order of store.orders) {
    if (
      order.status === "RESERVED" &&
      Date.parse(order.reservedUntil) <= now
    ) {
      order.status = "EXPIRED";
      order.updatedAt = new Date().toISOString();
      const pair = store.rail.find((row) => row.id === order.railId);
      if (pair && pair.status === "HOLD" && pair.heldByProfileId === order.profileId) {
        pair.status = "FOUND";
        pair.heldUntil = null;
        pair.heldByProfileId = null;
        pair.lastSeen = formatLastSeen();
      }
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

function pushNote(
  store: StoreData,
  profileId: string,
  input: {
    kind: NotificationKind;
    title: string;
    body: string;
    href?: string | null;
  },
) {
  const note: AppNotification = {
    id: crypto.randomUUID(),
    profileId,
    kind: input.kind,
    title: input.title,
    body: input.body,
    href: input.href ?? null,
    readAt: null,
    createdAt: new Date().toISOString(),
  };
  store.notifications.unshift(note);
}

function notifySizeWatchers(store: StoreData, pair: RailPair) {
  for (const profile of store.profiles) {
    if (profile.shoeSize !== pair.size) continue;
    if (!profile.wantsRecommendations) continue;
    pushNote(store, profile.id, {
      kind: "RAIL",
      title: `Size ${pair.size} just landed`,
      body: `${pair.brand} ${pair.model} · ${pair.price} · Found ${pair.found}`,
      href: `/rail/${pair.id}`,
    });
  }
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
      creditKes: 0,
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
  const rewear = await listRewear(profile.id);
  const orders = await listOrders(profile.id);
  const notifications = await listNotifications(profile.id);
  const unread = notifications.filter((row) => !row.readAt).length;
  return {
    profile: toPublicIdentity(profile, closet.length, wishlist.length, unread),
    closet,
    wishlist,
    rewear,
    orders,
    notifications,
    insight: closetInsight(profile, closet),
  };
}

export function toPublicIdentity(
  profile: Profile,
  closetCount: number,
  wishlistCount: number,
  unreadNotifications = 0,
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
    creditKes: profile.creditKes ?? 0,
    phoneVerified: Boolean(profile.phoneVerifiedAt),
    closetCount,
    wishlistCount,
    unreadNotifications,
  };
}

export function closetInsight(profile: Profile, closet: ClosetItem[]): string {
  const credit = profile.creditKes ?? 0;
  const creditLine =
    credit > 0
      ? ` Sayari credit KES ${credit.toLocaleString("en-KE")} ready for the rail.`
      : "";
  if (closet.length === 0) {
    return `Size ${profile.shoeSize}. ${profile.budgetBand}. Closet is empty — add pairs or ReWear.${creditLine}`;
  }
  const counts = new Map<string, number>();
  for (const item of closet) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return `Size ${profile.shoeSize}. ${closet.length} pair${closet.length === 1 ? "" : "s"}. Mostly ${top[0].toLowerCase()}. ${profile.budgetBand}.${creditLine}`;
}

export async function listRail(filter: {
  size?: number | null;
  budgetMaxKes?: number | null;
  budgetMinKes?: number | null;
  category?: string | null;
  found?: string | null;
  query?: string | null;
  status?: RailPair["status"] | "AVAILABLE" | null;
} = {}): Promise<RailPair[]> {
  return readStore((store) => filterRail(store.rail, filter));
}

export async function listNotifications(
  profileId: string,
): Promise<AppNotification[]> {
  return readStore((store) =>
    store.notifications
      .filter((row) => row.profileId === profileId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 40),
  );
}

export async function markNotificationsRead(profileId: string): Promise<number> {
  return writeStore((store) => {
    const now = new Date().toISOString();
    let count = 0;
    for (const row of store.notifications) {
      if (row.profileId === profileId && !row.readAt) {
        row.readAt = now;
        count += 1;
      }
    }
    return count;
  });
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

export async function listRewear(profileId: string): Promise<RewearSubmission[]> {
  return readStore((store) =>
    store.rewear
      .filter((row) => row.profileId === profileId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
  );
}

export async function listAllRewear(): Promise<RewearSubmission[]> {
  return readStore((store) =>
    [...store.rewear].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    ),
  );
}

export async function createRewearOffer(input: {
  profileId: string;
  closetItemId?: string | null;
  brand: string;
  model: string;
  size: number;
  category: string;
  gradeId: RewearGradeId;
  usage?: ClosetUsage | null;
  foundNeighbourhood: string;
  imageUrl: string;
  notes: string;
}): Promise<RewearSubmission> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === input.profileId);
    if (!profile) throw new Error("Sign in first.");

    let usage = input.usage ?? null;
    let closetItemId = input.closetItemId ?? null;
    if (closetItemId) {
      const closet = store.closetItems.find(
        (row) => row.id === closetItemId && row.profileId === input.profileId,
      );
      if (!closet) throw new Error("That closet pair was not found.");
      usage = closet.usage;
    }

    const quote = estimateRewear({
      brand: input.brand,
      gradeId: input.gradeId,
      usage,
    });

    const now = new Date().toISOString();
    const submission: RewearSubmission = {
      id: crypto.randomUUID(),
      profileId: input.profileId,
      closetItemId,
      brand: input.brand.trim(),
      model: input.model.trim(),
      size: input.size,
      category: input.category,
      gradeId: quote.grade.id,
      gradeLabel: quote.grade.label,
      gradeScore: quote.grade.score,
      usage,
      foundNeighbourhood: input.foundNeighbourhood.trim() || "Nairobi",
      imageUrl: input.imageUrl.trim(),
      notes: input.notes.trim(),
      estimatedValueKes: quote.estimatedValueKes,
      creditKes: quote.creditKes,
      resaleKes: quote.resaleKes,
      status: "OFFERED",
      railId: null,
      createdAt: now,
      updatedAt: now,
    };
    store.rewear.push(submission);
    award(store, profile, `rewear:${submission.id}`, POINT_AWARDS.rewearSubmit);
    profile.updatedAt = now;
    return submission;
  });
}

export async function acceptRewearOffer(
  profileId: string,
  rewearId: string,
): Promise<RewearSubmission> {
  return writeStore((store) => {
    const submission = store.rewear.find(
      (row) => row.id === rewearId && row.profileId === profileId,
    );
    if (!submission) throw new Error("Offer not found.");
    if (submission.status !== "OFFERED") {
      throw new Error("That offer is no longer open.");
    }
    submission.status = "ACCEPTED";
    submission.updatedAt = new Date().toISOString();
    return submission;
  });
}

export async function cancelRewearOffer(
  profileId: string,
  rewearId: string,
): Promise<RewearSubmission> {
  return writeStore((store) => {
    const submission = store.rewear.find(
      (row) => row.id === rewearId && row.profileId === profileId,
    );
    if (!submission) throw new Error("Offer not found.");
    if (submission.status !== "OFFERED" && submission.status !== "ACCEPTED") {
      throw new Error("Cannot cancel that ReWear.");
    }
    submission.status = "CANCELLED";
    submission.updatedAt = new Date().toISOString();
    return submission;
  });
}

export async function confirmRewearIntake(
  rewearId: string,
): Promise<{ submission: RewearSubmission; pair: RailPair; creditKes: number }> {
  return writeStore((store) => {
    const submission = store.rewear.find((row) => row.id === rewearId);
    if (!submission) throw new Error("ReWear not found.");
    if (submission.status === "CREDITED") {
      throw new Error("Already credited.");
    }
    if (submission.status !== "ACCEPTED" && submission.status !== "INTAKE") {
      throw new Error("Member must accept the offer before intake.");
    }

    const profile = store.profiles.find((row) => row.id === submission.profileId);
    if (!profile) throw new Error("Member profile missing.");

    const railId = nextRailId(store.rail.map((row) => row.id));
    const now = new Date().toISOString();
    const pair: RailPair = {
      id: railId,
      brand: submission.brand,
      model: submission.model,
      size: submission.size,
      category: submission.category,
      grade: submission.gradeLabel.split("·")[0]?.trim() || "Very Good",
      gradeScore: submission.gradeScore,
      found: submission.foundNeighbourhood,
      price: formatKes(submission.resaleKes),
      priceKes: submission.resaleKes,
      lastSeen: formatLastSeen(),
      image:
        submission.imageUrl ||
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
      status: "FOUND",
      story: `ReWear from ${profile.sayariId}. ${submission.notes || "Pre-loved, checked, back on the rail."}`,
      heldUntil: null,
      heldByProfileId: null,
    };
    store.rail.unshift(pair);

    profile.creditKes = (profile.creditKes ?? 0) + submission.creditKes;
    const credit: CreditEvent = {
      id: crypto.randomUUID(),
      profileId: profile.id,
      amount: submission.creditKes,
      reason: `ReWear ${submission.brand} ${submission.model}`,
      rewearId: submission.id,
      createdAt: now,
    };
    store.creditLedger.push(credit);
    award(store, profile, `rewear-credit:${submission.id}`, POINT_AWARDS.rewearCredit);
    profile.updatedAt = now;

    if (submission.closetItemId) {
      store.closetItems = store.closetItems.filter(
        (row) => row.id !== submission.closetItemId,
      );
    }

    submission.status = "CREDITED";
    submission.railId = railId;
    submission.updatedAt = now;

    pushNote(store, profile.id, {
      kind: "REWEAR",
      title: "Credit landed",
      body: `KES ${submission.creditKes.toLocaleString("en-KE")} for ${submission.brand} ${submission.model}. Now Rail #${railId}.`,
      href: `/rail/${railId}`,
    });
    notifySizeWatchers(store, pair);

    return { submission, pair, creditKes: submission.creditKes };
  });
}

export async function declineRewear(rewearId: string): Promise<RewearSubmission> {
  return writeStore((store) => {
    const submission = store.rewear.find((row) => row.id === rewearId);
    if (!submission) throw new Error("ReWear not found.");
    submission.status = "DECLINED";
    submission.updatedAt = new Date().toISOString();
    return submission;
  });
}

export async function addRailPairManual(input: {
  brand: string;
  model: string;
  size: number;
  category: string;
  grade: string;
  gradeScore: string;
  found: string;
  priceKes: number;
  image: string;
  story: string;
}): Promise<RailPair> {
  return writeStore((store) => {
    const id = nextRailId(store.rail.map((row) => row.id));
    const pair: RailPair = {
      id,
      brand: input.brand.trim(),
      model: input.model.trim(),
      size: input.size,
      category: input.category,
      grade: input.grade,
      gradeScore: input.gradeScore,
      found: input.found.trim() || "Nairobi",
      price: formatKes(input.priceKes),
      priceKes: input.priceKes,
      lastSeen: formatLastSeen(),
      image: input.image.trim(),
      status: "FOUND",
      story: input.story.trim() || "New on the rail.",
      heldUntil: null,
      heldByProfileId: null,
    };
    store.rail.unshift(pair);
    notifySizeWatchers(store, pair);
    return pair;
  });
}

export async function markRailSold(id: string): Promise<RailPair | null> {
  return writeStore((store) => {
    const pair = store.rail.find((row) => row.id.toUpperCase() === id.toUpperCase());
    if (!pair) return null;
    pair.status = "SOLD";
    pair.heldUntil = null;
    pair.heldByProfileId = null;
    pair.lastSeen = formatLastSeen();
    return pair;
  });
}

export async function listOrders(profileId: string): Promise<Order[]> {
  return readStore((store) =>
    store.orders
      .filter((row) => row.profileId === profileId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
  );
}

export async function listAllOrders(): Promise<Order[]> {
  return readStore((store) =>
    [...store.orders].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    ),
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  return readStore(
    (store) =>
      store.orders.find(
        (row) => row.id === id || row.code.toUpperCase() === id.toUpperCase(),
      ) ?? null,
  );
}

export async function createReservation(input: {
  profileId: string;
  railId: string;
  pickup: string;
  useCredit: boolean;
}): Promise<Order> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === input.profileId);
    if (!profile) throw new Error("Sign in first.");

    const pair = store.rail.find(
      (row) => row.id.toUpperCase() === input.railId.toUpperCase(),
    );
    if (!pair) throw new Error("Pair not on the rail.");
    if (pair.status === "SOLD") throw new Error("Already sold.");
    if (
      pair.status === "HOLD" &&
      pair.heldByProfileId &&
      pair.heldByProfileId !== profile.id
    ) {
      throw new Error("Someone else is holding that pair.");
    }

    const open = store.orders.find(
      (row) =>
        row.railId === pair.id &&
        (row.status === "RESERVED" ||
          row.status === "PAID" ||
          row.status === "READY"),
    );
    if (open && open.profileId !== profile.id) {
      throw new Error("That pair is already reserved.");
    }
    if (open && open.profileId === profile.id) {
      return open;
    }

    const { creditApplied, mpesaDue } = splitPayment({
      priceKes: pair.priceKes,
      creditKes: profile.creditKes ?? 0,
      useCredit: input.useCredit,
    });

    const now = Date.now();
    const id = crypto.randomUUID();
    const order: Order = {
      id,
      code: orderCodeFromId(id),
      profileId: profile.id,
      railId: pair.id,
      brand: pair.brand,
      model: pair.model,
      size: pair.size,
      image: pair.image,
      priceKes: pair.priceKes,
      creditApplied,
      mpesaDue,
      mpesaRef: null,
      paymentMethod: "NONE",
      pickup: input.pickup,
      status: "RESERVED",
      reservedUntil: new Date(now + HOLD_HOURS * 60 * 60 * 1000).toISOString(),
      paidAt: null,
      readyAt: null,
      collectedAt: null,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    };
    store.orders.push(order);

    pair.status = "HOLD";
    pair.heldByProfileId = profile.id;
    pair.heldUntil = order.reservedUntil;
    pair.lastSeen = formatLastSeen();

    award(store, profile, `reserve:${order.id}`, POINT_AWARDS.reserve);
    profile.updatedAt = order.updatedAt;
    return order;
  });
}

export async function payOrder(input: {
  profileId: string;
  orderId: string;
  useCredit: boolean;
  mpesaPhone?: string;
}): Promise<Order> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === input.profileId);
    if (!profile) throw new Error("Sign in first.");

    const order = store.orders.find(
      (row) => row.id === input.orderId && row.profileId === profile.id,
    );
    if (!order) throw new Error("Order not found.");
    if (order.status !== "RESERVED") {
      throw new Error("That order is not awaiting payment.");
    }
    if (Date.parse(order.reservedUntil) <= Date.now()) {
      order.status = "EXPIRED";
      order.updatedAt = new Date().toISOString();
      throw new Error("Reservation expired. Grab it again.");
    }

    const split = splitPayment({
      priceKes: order.priceKes,
      creditKes: profile.creditKes ?? 0,
      useCredit: input.useCredit,
    });
    order.creditApplied = split.creditApplied;
    order.mpesaDue = split.mpesaDue;

    if (split.creditApplied > (profile.creditKes ?? 0)) {
      throw new Error("Not enough Sayari credit.");
    }

    if (split.mpesaDue > 0) {
      // Stub STK — real Daraja wiring later via SAYARI_MPESA_* env.
      const phone = (input.mpesaPhone ?? profile.phone).replace(/\D/g, "");
      order.mpesaRef = `MPX${Date.now().toString().slice(-8)}${phone.slice(-4)}`;
    }

    if (split.creditApplied > 0) {
      profile.creditKes = (profile.creditKes ?? 0) - split.creditApplied;
      store.creditLedger.push({
        id: crypto.randomUUID(),
        profileId: profile.id,
        amount: -split.creditApplied,
        reason: `Order ${order.code}`,
        rewearId: null,
        orderId: order.id,
        createdAt: new Date().toISOString(),
      });
    }

    order.paymentMethod =
      split.creditApplied > 0 && split.mpesaDue > 0
        ? "MIXED"
        : split.creditApplied > 0
          ? "CREDIT"
          : "MPESA";
    order.status = "PAID";
    order.paidAt = new Date().toISOString();
    order.updatedAt = order.paidAt;

    const pair = store.rail.find((row) => row.id === order.railId);
    if (pair) {
      pair.status = "HOLD";
      pair.heldByProfileId = profile.id;
      pair.heldUntil = null;
      pair.lastSeen = formatLastSeen();
    }

    award(store, profile, `purchase:${order.id}`, POINT_AWARDS.purchase);
    profile.updatedAt = order.updatedAt;
    pushNote(store, profile.id, {
      kind: "ORDER",
      title: "Payment received",
      body: `${order.code} · ${order.brand} ${order.model} · pickup ${order.pickup}`,
      href: "/orders",
    });
    return order;
  });
}

export async function cancelOrder(
  profileId: string,
  orderId: string,
): Promise<Order> {
  return writeStore((store) => {
    const order = store.orders.find(
      (row) => row.id === orderId && row.profileId === profileId,
    );
    if (!order) throw new Error("Order not found.");
    if (order.status !== "RESERVED") {
      throw new Error("Only unpaid reservations can be cancelled.");
    }
    order.status = "CANCELLED";
    order.updatedAt = new Date().toISOString();
    const pair = store.rail.find((row) => row.id === order.railId);
    if (pair && pair.heldByProfileId === profileId) {
      pair.status = "FOUND";
      pair.heldUntil = null;
      pair.heldByProfileId = null;
      pair.lastSeen = formatLastSeen();
    }
    return order;
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: Extract<OrderStatus, "READY" | "COLLECTED" | "CANCELLED">,
): Promise<Order> {
  return writeStore((store) => {
    const order = store.orders.find((row) => row.id === orderId);
    if (!order) throw new Error("Order not found.");

    const now = new Date().toISOString();
    if (status === "READY") {
      if (order.status !== "PAID" && order.status !== "READY") {
        throw new Error("Order must be paid first.");
      }
      order.status = "READY";
      order.readyAt = now;
      pushNote(store, order.profileId, {
        kind: "ORDER",
        title: "Ready for pickup",
        body: `${order.code} · ${order.brand} ${order.model} at ${order.pickup}`,
        href: "/orders",
      });
    } else if (status === "COLLECTED") {
      if (order.status !== "READY" && order.status !== "PAID") {
        throw new Error("Mark ready before collected.");
      }
      order.status = "COLLECTED";
      order.collectedAt = now;
      const pair = store.rail.find((row) => row.id === order.railId);
      if (pair) {
        pair.status = "SOLD";
        pair.heldUntil = null;
        pair.heldByProfileId = null;
        pair.lastSeen = formatLastSeen();
      }
      const profile = store.profiles.find((row) => row.id === order.profileId);
      if (profile) {
        const exists = store.closetItems.some(
          (row) =>
            row.profileId === profile.id &&
            row.brand === order.brand &&
            row.name === order.model,
        );
        if (!exists) {
          store.closetItems.push({
            id: crypto.randomUUID(),
            profileId: profile.id,
            name: order.model,
            brand: order.brand,
            size: order.size,
            category: "Sneakers",
            boughtOn: now.slice(0, 7),
            usage: "Frequent",
            createdAt: now,
          });
        }
        pushNote(store, profile.id, {
          kind: "ORDER",
          title: "Collected — karibu",
          body: `${order.brand} ${order.model} is in your closet now.`,
          href: "/id",
        });
      }
    } else if (status === "CANCELLED") {
      if (order.status === "COLLECTED") {
        throw new Error("Already collected.");
      }
      if (order.status === "PAID" || order.status === "READY") {
        const profile = store.profiles.find((row) => row.id === order.profileId);
        if (profile && order.creditApplied > 0) {
          profile.creditKes = (profile.creditKes ?? 0) + order.creditApplied;
          store.creditLedger.push({
            id: crypto.randomUUID(),
            profileId: profile.id,
            amount: order.creditApplied,
            reason: `Refund ${order.code}`,
            rewearId: null,
            orderId: order.id,
            createdAt: now,
          });
        }
      }
      order.status = "CANCELLED";
      const pair = store.rail.find((row) => row.id === order.railId);
      if (pair && pair.status !== "SOLD") {
        pair.status = "FOUND";
        pair.heldUntil = null;
        pair.heldByProfileId = null;
        pair.lastSeen = formatLastSeen();
      }
    }
    order.updatedAt = now;
    return order;
  });
}

export async function listSpotted(): Promise<SpottedPost[]> {
  return readStore((store) =>
    [...store.spotted].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.votes - a.votes || Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }),
  );
}

export async function laneLeaders(): Promise<
  Array<{ lane: string; post: SpottedPost | null }>
> {
  const posts = await listSpotted();
  const lanes = [
    "Best Find",
    "Best Fit",
    "Best Bargain",
    "Unexpected",
  ] as const;
  return lanes.map((lane) => {
    const inLane = posts.filter((row) => row.lane === lane);
    return { lane, post: inLane[0] ?? null };
  });
}

export async function createSpottedPost(input: {
  profileId: string;
  caption: string;
  neighbourhood: string;
  lane: SpottedLane;
  imageUrl: string;
  railId: string | null;
}): Promise<SpottedPost> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === input.profileId);
    if (!profile) throw new Error("Sign in first.");
    if (!isSpottedLane(input.lane)) throw new Error("Pick a lane.");
    if (!input.imageUrl.trim()) throw new Error("Add a photo URL.");
    if (!input.caption.trim()) throw new Error("Add a caption.");

    if (input.railId) {
      const pair = store.rail.find(
        (row) => row.id.toUpperCase() === input.railId!.toUpperCase(),
      );
      if (!pair) throw new Error("That rail pair was not found.");
    }

    const post: SpottedPost = {
      id: crypto.randomUUID(),
      profileId: profile.id,
      sayariId: profile.sayariId,
      displayName: profile.displayName,
      caption: input.caption.trim().slice(0, 180),
      neighbourhood: input.neighbourhood.trim() || "Nairobi",
      lane: input.lane,
      imageUrl: input.imageUrl.trim(),
      railId: input.railId,
      votes: 0,
      featured: false,
      createdAt: new Date().toISOString(),
    };
    store.spotted.unshift(post);
    award(store, profile, `spotted:${post.id}`, POINT_AWARDS.spotted);
    profile.updatedAt = post.createdAt;
    return post;
  });
}

export async function voteSpotted(
  profileId: string,
  postId: string,
): Promise<SpottedPost> {
  return writeStore((store) => {
    const profile = store.profiles.find((row) => row.id === profileId);
    if (!profile) throw new Error("Sign in to vote.");
    const post = store.spotted.find((row) => row.id === postId);
    if (!post) throw new Error("Post not found.");
    if (post.profileId === profileId) {
      throw new Error("You cannot vote your own fit.");
    }
    const already = store.spottedVotes.find(
      (row) => row.postId === postId && row.profileId === profileId,
    );
    if (already) throw new Error("Already voted.");

    store.spottedVotes.push({
      id: crypto.randomUUID(),
      postId,
      profileId,
      createdAt: new Date().toISOString(),
    });
    post.votes += 1;
    award(store, profile, `vote:${postId}`, POINT_AWARDS.spottedVote);
    profile.updatedAt = new Date().toISOString();
    return post;
  });
}

export async function featureSpotted(postId: string): Promise<SpottedPost> {
  return writeStore((store) => {
    const post = store.spotted.find((row) => row.id === postId);
    if (!post) throw new Error("Post not found.");
    for (const row of store.spotted) row.featured = false;
    post.featured = true;
    post.lane = "Shoe of the Week";
    return post;
  });
}





