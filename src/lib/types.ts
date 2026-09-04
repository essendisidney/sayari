export type GenderPreference = "Menswear" | "Womenswear" | "Kids" | "All";

export type ClosetUsage =
  | "Frequent"
  | "Work"
  | "Weekend"
  | "Occasion"
  | "Rarely";

export type Profile = {
  id: string;
  sayariId: string;
  phone: string;
  displayName: string;
  shoeSize: number;
  genderPreference: GenderPreference | null;
  categories: string[];
  favouriteBrands: string;
  buyFrequency: string;
  budgetBand: string;
  currentShops: string;
  frustration: string;
  wouldTrade: boolean;
  wantsRecommendations: boolean;
  foundingNumber: number;
  foundingTier: string;
  points: number;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FoundingMemberInput = {
  name: string;
  phone: string;
  shoeSize: number;
  categories: string[];
  favouriteBrands: string;
  buyFrequency: string;
  budgetBand: string;
  currentShops: string;
  frustration: string;
  wouldTrade: boolean;
  wantsRecommendations: boolean;
};

export type ClosetItem = {
  id: string;
  profileId: string;
  name: string;
  brand: string;
  size: number;
  category: string;
  boughtOn: string;
  usage: ClosetUsage;
  createdAt: string;
};

export type WishlistItem = {
  id: string;
  profileId: string;
  name: string;
  notes: string;
  createdAt: string;
};

export type PointEvent = {
  id: string;
  profileId: string;
  reason: string;
  amount: number;
  createdAt: string;
};

export type OtpRecord = {
  phone: string;
  codeHash: string;
  attempts: number;
  expiresAt: string;
  createdAt: string;
};

export type SessionRecord = {
  tokenHash: string;
  profileId: string;
  expiresAt: string;
  createdAt: string;
};

export type RailStatus = "FOUND" | "HOLD" | "SOLD";

export type RailPair = {
  id: string;
  brand: string;
  model: string;
  size: number;
  category: string;
  grade: string;
  gradeScore: string;
  found: string;
  price: string;
  priceKes: number;
  lastSeen: string;
  image: string;
  status: RailStatus;
  story: string;
  heldUntil: string | null;
  heldByProfileId: string | null;
};

export type FindRequest = {
  id: string;
  profileId: string | null;
  size: number;
  budgetMaxKes: number;
  category: string;
  colours: string;
  notes: string;
  matchIds: string[];
  createdAt: string;
};

export type StoreData = {
  profiles: Profile[];
  closetItems: ClosetItem[];
  wishlistItems: WishlistItem[];
  ledger: PointEvent[];
  otps: OtpRecord[];
  sessions: SessionRecord[];
  rail: RailPair[];
  findRequests: FindRequest[];
};

/** Public profile payload — never includes phone in full on the client if we can help it. */
export type PublicIdentity = {
  sayariId: string;
  displayName: string;
  maskedPhone: string;
  shoeSize: number;
  genderPreference: GenderPreference | null;
  categories: string[];
  favouriteBrands: string;
  buyFrequency: string;
  budgetBand: string;
  wouldTrade: boolean;
  wantsRecommendations: boolean;
  foundingNumber: number;
  foundingTier: string;
  points: number;
  phoneVerified: boolean;
  closetCount: number;
  wishlistCount: number;
};

export type IdentityPayload = {
  profile: PublicIdentity;
  closet: ClosetItem[];
  wishlist: WishlistItem[];
  insight: string;
};
