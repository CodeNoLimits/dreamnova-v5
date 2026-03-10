/**
 * @dreamnova/core — Sacred constants and design tokens
 *
 * These values permeate the entire DreamNova V5 system, from pricing
 * to cryptographic seeds to UI rendering. They are immutable and
 * carry spiritual significance rooted in Breslov gematria.
 */

// ---------------------------------------------------------------------------
// Sacred Numbers
// ---------------------------------------------------------------------------

export const SACRED_NUMBERS = {
  /** SaG (סג) — Kabbalistic divine name gematria. Nova Key base price. */
  SAG: 63,

  /** Nachman (נחמן) — Name gematria. Hafatsa points threshold. */
  NACHMAN: 148,

  /**
   * Na Nach Nachma Nachman MeUman — Full Petek phrase gematria.
   * Used as PRNG seed for reproducible sacred computations.
   */
  PETEK: 491,

  /** Taryag Mitzvot (תרי"ג מצוות) — Total commandments. Tikkun Master level. */
  TARYAG: 613,

  /** Sefirot — The 10 divine emanations. Configuration base unit. */
  SEFIROT: 10,

  /** Days of Creation — The 7 days. Product tier count. */
  CREATION_DAYS: 7,

  /** Chai (חי) — Life. Minimum Hafatsa points per action. */
  CHAI: 18,

  /** Tzadik (צדיק) — The righteous one. Referral bonus multiplier. */
  TZADIK: 90,

  /** Aleph (א) — The silent letter. Unity. */
  ALEPH: 1,

  /** Echad (אחד) — One. */
  ECHAD: 13,
} as const;

export type SacredNumber = (typeof SACRED_NUMBERS)[keyof typeof SACRED_NUMBERS];

// ---------------------------------------------------------------------------
// Design Tokens
// ---------------------------------------------------------------------------

export const DESIGN_TOKENS = {
  colors: {
    sacred: {
      gold: "#D4AF37",
      goldLight: "#E8C960",
      goldDark: "#B8941F",
      cyan: "#00D4FF",
      cyanLight: "#33DDFF",
      cyanDark: "#00A8CC",
      black: "#050508",
      blackLight: "#0A0A10",
      blackMedium: "#111118",
      white: "#FFFFFF",
      whiteDim: "#E8E8F0",
      gray: "#8888AA",
    },
    status: {
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },

  fonts: {
    /** Display headings — Cinzel serif */
    display: "Cinzel",
    /** Body text — Rajdhani sans-serif */
    body: "Rajdhani",
    /** Code blocks — Space Mono monospace */
    code: "Space Mono",
    /** Sacred text passages — Cormorant Garamond serif */
    sacred: "Cormorant Garamond",
  },

  fontWeights: {
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
  },

  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  shadows: {
    sacred: "0 0 30px rgba(212, 175, 55, 0.15)",
    sacredLg: "0 0 60px rgba(212, 175, 55, 0.25)",
    cyan: "0 0 30px rgba(0, 212, 255, 0.15)",
    card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    cardHover: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },

  gradients: {
    sacred: "linear-gradient(135deg, #D4AF37 0%, #00D4FF 50%, #D4AF37 100%)",
    dark: "radial-gradient(ellipse at center, #0A0A10 0%, #050508 100%)",
    goldShimmer: "linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)",
    cyanGlow: "linear-gradient(135deg, #00A8CC 0%, #00D4FF 50%, #33DDFF 100%)",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  transitions: {
    fast: "150ms ease",
    normal: "300ms ease",
    slow: "500ms ease",
    sacred: "3000ms ease-in-out",
  },

  zIndex: {
    dropdown: 50,
    sticky: 100,
    modal: 200,
    toast: 300,
    tooltip: 400,
  },
} as const;

// ---------------------------------------------------------------------------
// Product Tiers
// ---------------------------------------------------------------------------

export const PRODUCT_TIERS = {
  SINGLE: {
    id: "single",
    name: "Nova Key",
    nameHe: "מפתח נובה",
    price: SACRED_NUMBERS.SAG,
    currency: "USD",
    description: "One sacred NFC key — your gateway to the Source Code",
    quantity: 1,
    features: [
      "NFC-enabled stainless steel card",
      "Access to Tikkun portal",
      "Azamra daily practice",
      "148 Hafatsa points",
    ],
  },

  PAIR: {
    id: "pair",
    name: "Nova Key Pair",
    nameHe: "זוג מפתחות נובה",
    price: 99,
    currency: "USD",
    description: "Two keys — share the light with someone you love",
    quantity: 2,
    features: [
      "2x NFC-enabled stainless steel cards",
      "Access to Tikkun portal",
      "Azamra daily practice",
      "296 Hafatsa points (2x148)",
      "Shared referral bonus",
    ],
  },

  PLATINUM: {
    id: "platinum",
    name: "Nova Key Platinum",
    nameHe: "מפתח נובה פלטינום",
    price: 149,
    currency: "USD",
    description: "Premium edition — engraved with the Petek",
    quantity: 1,
    features: [
      "Engraved stainless steel card",
      "Access to all portals",
      "Priority Hafatsa missions",
      "491 Hafatsa points",
      "Exclusive content library",
      "Direct line to DreamNova team",
    ],
  },

  TIKKUN_MASTER: {
    id: "tikkun-master",
    name: "Tikkun Master Bundle",
    nameHe: "חבילת תיקון מאסטר",
    price: 613,
    currency: "USD",
    description: "613 keys for mass Hafatsa — become a Tikkun Master",
    quantity: 10,
    features: [
      "10x NFC-enabled cards",
      "All portal access",
      "Tikkun Master badge",
      "6130 Hafatsa points (10x613)",
      "Custom engraving on all cards",
      "Monthly strategy call",
      "Lifetime updates",
    ],
  },
} as const;

export type ProductTierId = keyof typeof PRODUCT_TIERS;
export type ProductTier = (typeof PRODUCT_TIERS)[ProductTierId];

// ---------------------------------------------------------------------------
// Application Constants
// ---------------------------------------------------------------------------

export const APP_CONFIG = {
  name: "DreamNova",
  tagline: "Stop Calculating. Start Living.",
  version: "5.0.0",
  url: "https://dreamnova.vercel.app",
  repository: "https://github.com/CodeNoLimits/dreamnova-v5",
  contact: "admin@dreamnova.com",

  stripe: {
    apiVersion: "2026-01-28.clover" as const,
  },

  nfc: {
    chipType: "NTAG215" as const,
    maxPayloadBytes: 888,
    materialOptions: ["stainless-steel", "bamboo", "recycled-plastic"] as const,
  },

  hafatsa: {
    pointsPerScan: SACRED_NUMBERS.CHAI,
    pointsPerReferral: SACRED_NUMBERS.TZADIK,
    dailyCap: SACRED_NUMBERS.TARYAG,
  },

  mission: {
    targetRevenue: 63_000_000,
    targetKeys: 1_000_000,
    timeframeYears: 10,
    motto: "Na Nach Nachma Nachman MeUman",
  },
} as const;
