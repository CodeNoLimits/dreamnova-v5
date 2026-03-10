/**
 * @dreamnova/core — Shared types, constants, and sacred numbers
 *
 * Central package for the DreamNova V5 monorepo. All cross-package
 * type definitions, design tokens, and sacred constants are exported
 * from here.
 *
 * Usage:
 *   import { SACRED_NUMBERS, DESIGN_TOKENS, type User } from "@dreamnova/core";
 */

// Constants
export {
  SACRED_NUMBERS,
  DESIGN_TOKENS,
  PRODUCT_TIERS,
  APP_CONFIG,
  type SacredNumber,
  type ProductTierId as ProductTierKey,
  type ProductTier,
} from "./constants";

// Types
export type {
  // User & Auth
  User,
  UserRole,
  UserProfile,
  SupportedLanguage,

  // NFC
  NovaKey,
  NfcMaterial,
  NovaKeyStatus,
  ProductTierId,
  NfcScanEvent,
  NfcPayload,

  // Orders & Payments
  Order,
  OrderStatus,
  OrderItem,
  ShippingAddress,
  CheckoutRequest,
  CheckoutResponse,
  StripeWebhookEvent,

  // Hafatsa
  HafatsaPoints,
  HafatsaLevel,
  HafatsaTransaction,
  HafatsaTransactionType,

  // Referrals
  Referral,
  ReferralStatus,

  // Waitlist & Contact
  WaitlistEntry,
  ContactFormData,
  ContactCategory,

  // Portal Content
  TikkunContent,
  TikkunContentType,
  AzamraSession,

  // Esther AI
  EstherAlert,
  EstherMonitorStats,

  // API
  ApiResponse,
  ApiError,
  PaginatedResponse,

  // Utility
  WithRequired,
  DeepPartial,
} from "./types";
