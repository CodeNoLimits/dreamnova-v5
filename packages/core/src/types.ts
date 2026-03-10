/**
 * @dreamnova/core — Shared TypeScript interfaces
 *
 * All cross-package type definitions for the DreamNova V5 monorepo.
 * These types are consumed by apps/web, packages/crypto, and packages/ui.
 */

// ---------------------------------------------------------------------------
// User & Auth
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  hafatsaPoints: number;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "user" | "admin" | "tikkun_master";

export interface UserProfile {
  userId: string;
  fullName: string | null;
  phone: string | null;
  address: ShippingAddress | null;
  preferredLanguage: SupportedLanguage;
  nfcKeyCount: number;
  totalScans: number;
  tikkunLevel: number;
}

export type SupportedLanguage = "en" | "he" | "fr" | "es" | "ru" | "ar";

// ---------------------------------------------------------------------------
// NFC Key
// ---------------------------------------------------------------------------

export interface NovaKey {
  id: string;
  userId: string;
  serialNumber: string;
  publicKeyHash: string;
  material: NfcMaterial;
  tier: ProductTierId;
  status: NovaKeyStatus;
  totalScans: number;
  lastScannedAt: string | null;
  activatedAt: string | null;
  createdAt: string;
}

export type NfcMaterial = "stainless-steel" | "bamboo" | "recycled-plastic";

export type NovaKeyStatus = "pending" | "active" | "suspended" | "revoked";

export type ProductTierId = "single" | "pair" | "platinum" | "tikkun-master";

export interface NfcScanEvent {
  id: string;
  novaKeyId: string;
  userId: string | null;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  deviceInfo: string | null;
  verified: boolean;
  proofHash: string | null;
}

export interface NfcPayload {
  version: number;
  serialNumber: string;
  encryptedIdentity: string;
  nonce: string;
  chipType: "NTAG215";
}

// ---------------------------------------------------------------------------
// Orders & Payments
// ---------------------------------------------------------------------------

export interface Order {
  id: string;
  userId: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: string;
  orderId: string;
  tierId: ProductTierId;
  tierName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  material: NfcMaterial;
  engraving: string | null;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
}

// ---------------------------------------------------------------------------
// Stripe
// ---------------------------------------------------------------------------

export interface CheckoutRequest {
  tierId: ProductTierId;
  quantity: number;
  material: NfcMaterial;
  engraving?: string;
  shippingAddress: ShippingAddress;
  referralCode?: string;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

// ---------------------------------------------------------------------------
// Hafatsa (Distribution) Points
// ---------------------------------------------------------------------------

export interface HafatsaPoints {
  userId: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: HafatsaLevel;
  history: HafatsaTransaction[];
}

export type HafatsaLevel =
  | "seeker"
  | "student"
  | "practitioner"
  | "teacher"
  | "master";

export interface HafatsaTransaction {
  id: string;
  userId: string;
  points: number;
  type: HafatsaTransactionType;
  description: string;
  relatedEntityId: string | null;
  createdAt: string;
}

export type HafatsaTransactionType =
  | "nfc_scan"
  | "referral"
  | "daily_tikkun"
  | "azamra_session"
  | "purchase_bonus"
  | "streak_bonus"
  | "admin_grant";

// ---------------------------------------------------------------------------
// Referrals
// ---------------------------------------------------------------------------

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  orderId: string | null;
  pointsAwarded: number;
  status: ReferralStatus;
  createdAt: string;
}

export type ReferralStatus = "pending" | "completed" | "expired";

// ---------------------------------------------------------------------------
// Waitlist
// ---------------------------------------------------------------------------

export interface WaitlistEntry {
  id: string;
  email: string;
  source: string | null;
  referralCode: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: ContactCategory;
}

export type ContactCategory =
  | "general"
  | "support"
  | "partnership"
  | "wholesale"
  | "press";

// ---------------------------------------------------------------------------
// Portal Content (NFC-gated)
// ---------------------------------------------------------------------------

export interface TikkunContent {
  id: string;
  title: string;
  titleHe: string;
  description: string;
  contentType: TikkunContentType;
  body: string;
  audioUrl: string | null;
  requiredLevel: HafatsaLevel;
  sacredReference: string | null;
  createdAt: string;
}

export type TikkunContentType = "prayer" | "meditation" | "teaching" | "story" | "practice";

export interface AzamraSession {
  id: string;
  userId: string;
  date: string;
  pointFound: string;
  reflection: string | null;
  duration: number;
  pointsEarned: number;
  streakDay: number;
}

// ---------------------------------------------------------------------------
// Esther AI (Python bridge types)
// ---------------------------------------------------------------------------

export interface EstherAlert {
  timestamp: number;
  level: "normal" | "warning" | "critical";
  entropyDerivative: number;
  gnnScore: number;
  message: string;
  stateSnapshotHash: string;
}

export interface EstherMonitorStats {
  totalPolls: number;
  totalAlerts: number;
  totalCritical: number;
  uptimeSeconds: number;
  lastEntropy: number;
  lastDerivative: number;
  lastGnnScore: number;
  baselineMean: number;
  baselineStd: number;
}

// ---------------------------------------------------------------------------
// API Response Wrappers
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Utility Types
// ---------------------------------------------------------------------------

/** Make selected keys required while keeping the rest unchanged. */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Extract the resolved type from a Promise. */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/** Deep partial — makes all nested properties optional. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
