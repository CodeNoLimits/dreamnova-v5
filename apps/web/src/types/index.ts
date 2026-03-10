export interface NovaKey {
  id: string;
  serial: string;
  userId: string;
  activated: boolean;
  activatedAt: string | null;
  chipType: "NTAG_215" | "DESFIRE_EV3";
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  stripeSessionId: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "refunded";
  total: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface HafatsaPoints {
  userId: string;
  totalPoints: number;
  level: HafatsaLevel;
  scansGenerated: number;
  referrals: number;
  streakDays: number;
  lastActivity: string;
}

export type HafatsaLevel =
  | "Seeker"
  | "Student"
  | "Practitioner"
  | "Teacher"
  | "Tzaddik"
  | "Tikkun Master";

export interface NfcScan {
  id: string;
  keyId: string;
  scannedAt: string;
  latitude: number | null;
  longitude: number | null;
  userAgent: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  source: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  hebrewName: string | null;
  hafatsaLevel: HafatsaLevel;
  totalPoints: number;
  createdAt: string;
}

export interface SacredNumber {
  value: number;
  name: string;
  meaning: string;
  hebrew: string;
}

export interface PricingTier {
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  sacredNumber: SacredNumber;
  popular?: boolean;
}

export interface Pillar {
  name: string;
  icon: string;
  description: string;
  features: string[];
  color: string;
}

export interface Phase {
  number: number;
  name: string;
  timeline: string;
  description: string;
  milestones: string[];
  status: "completed" | "active" | "upcoming";
}
