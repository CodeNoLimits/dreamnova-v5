import type { SacredNumber, PricingTier, Pillar, Phase } from "@/types";

export const SACRED_NUMBERS: Record<string, SacredNumber> = {
  SAG: {
    value: 63,
    name: "SaG",
    meaning: "The filling of the divine name YHVH at the level of Binah (Understanding)",
    hebrew: "סג",
  },
  NACHMAN: {
    value: 148,
    name: "Nachman",
    meaning: "The gematria of Rabbi Nachman (נחמן)",
    hebrew: "נחמן",
  },
  TIKKUN: {
    value: 613,
    name: "Tikkun Master",
    meaning: "Total number of commandments — complete rectification",
    hebrew: "תרי״ג",
  },
  PAIR: {
    value: 99,
    name: "Pair Covenant",
    meaning: "Two souls bound in sacred partnership",
    hebrew: "צט",
  },
  PLATINUM: {
    value: 149,
    name: "Platinum",
    meaning: "Beyond the individual — communal elevation",
    hebrew: "קמט",
  },
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Covenant Pack",
    price: 63,
    currency: "USD",
    description: "Your sacred key to the Nova network. One NFC card, infinite potential.",
    features: [
      "1x Nova Key NFC Card (DESFire EV3)",
      "zk-SNARK Identity Verification",
      "Tikkun HaKlali Portal Access",
      "Azamra OS Lifetime License",
      "Hafatsa Point System Entry",
      "Sacred Geometry Engravings",
      "Priority Community Access",
    ],
    sacredNumber: SACRED_NUMBERS.SAG,
    popular: true,
  },
  {
    name: "Pair Covenant",
    price: 99,
    currency: "USD",
    description: "Two keys, one mission. Share the light with someone you love.",
    features: [
      "2x Nova Key NFC Cards",
      "Everything in Covenant Pack",
      "Shared Hafatsa Dashboard",
      "Pair Meditation Sync",
      "Exclusive Pair Content",
      "Matching Sacred Engravings",
    ],
    sacredNumber: SACRED_NUMBERS.PAIR,
  },
  {
    name: "Platinum Covenant",
    price: 149,
    currency: "USD",
    description: "For the serious seeker. Premium materials, premium access.",
    features: [
      "1x Platinum Nova Key (Stainless Steel)",
      "Everything in Covenant Pack",
      "Private Community Channel",
      "1-on-1 Onboarding Session",
      "Early Access to New Features",
      "Lifetime Priority Support",
      "Research Paper Access",
    ],
    sacredNumber: SACRED_NUMBERS.PLATINUM,
  },
];

export const PILLARS: Pillar[] = [
  {
    name: "Evolutrix",
    icon: "Brain",
    description:
      "Artificial Super Learning engine that evolves with each user interaction. Powered by sacred algorithms derived from Likutey Moharan's 613-layer architecture.",
    features: [
      "Neural pathway mapping based on Torah learning patterns",
      "Adaptive difficulty scaling using Kabbalistic progression",
      "Cross-reference engine spanning 10,000+ sacred texts",
      "Real-time insight generation with source attribution",
    ],
    color: "#D4AF37",
  },
  {
    name: "Antimatrix",
    icon: "Shield",
    description:
      "Zero-knowledge privacy layer ensuring your spiritual journey remains sovereign. No data harvesting, no surveillance capitalism.",
    features: [
      "zk-SNARK identity proofs — verify without revealing",
      "End-to-end encrypted learning sessions",
      "On-device processing for sensitive content",
      "GDPR/EU AI Act compliant by design",
    ],
    color: "#00D4FF",
  },
  {
    name: "Nova Tokenomics",
    icon: "Coins",
    description:
      "Hafatsa Points reward system that turns spiritual growth into measurable impact. Every scan, every share, every prayer counts.",
    features: [
      "Earn points through NFC scans and content sharing",
      "Community leaderboards with sacred level progression",
      "Referral bonuses that multiply your impact",
      "Redeemable for premium content and physical items",
    ],
    color: "#D4AF37",
  },
  {
    name: "Mac M4 Infrastructure",
    icon: "Server",
    description:
      "Built on Apple Silicon M4 Max architecture. 40-core GPU, 128GB unified memory. Edge computing for the sacred.",
    features: [
      "Sub-5ms local inference for RAG queries",
      "FAISS vector store with 50,000+ embeddings",
      "Multi-agent orchestration (CrewAI + LangGraph)",
      "Self-healing infrastructure with PM2 process management",
    ],
    color: "#00D4FF",
  },
];

export const PHASES: Phase[] = [
  {
    number: 1,
    name: "Genesis",
    timeline: "Q1 2026",
    description: "Foundation. Launch Nova Key, establish the covenant network.",
    milestones: [
      "Nova Key NFC card production (1,000 units)",
      "DreamNova.com launch with full e-commerce",
      "Tikkun HaKlali portal activation",
      "Stripe + PayPal payment integration",
      "Community Discord/Telegram launch",
    ],
    status: "active",
  },
  {
    number: 2,
    name: "Exodus",
    timeline: "Q2-Q3 2026",
    description: "Scale. 10,000 Nova Keys distributed worldwide.",
    milestones: [
      "Mobile app launch (iOS + Android)",
      "Breslov RAG SaaS public beta ($49/mo)",
      "University partnerships (Bar-Ilan, Hebrew U)",
      "IIA Pre-Seed Grant application",
      "Multi-language support (HE/EN/FR/ES/RU/AR)",
    ],
    status: "upcoming",
  },
  {
    number: 3,
    name: "Leviticus",
    timeline: "Q4 2026 - Q1 2027",
    description: "Sanctify. DreamOS operating system release.",
    milestones: [
      "DreamOS v1.0 public release",
      "ASL (Artificial Super Learning) patent filing",
      "100,000 Nova Keys milestone",
      "Series A fundraising ($5M target)",
      "Research paper publication",
    ],
    status: "upcoming",
  },
  {
    number: 4,
    name: "Numbers",
    timeline: "2027-2028",
    description: "Count. Build the sacred census of seekers worldwide.",
    milestones: [
      "1M Nova Keys distributed",
      "DreamOS marketplace launch",
      "Institutional partnerships",
      "Revenue target: $10M ARR",
      "Global Hafatsa network operational",
    ],
    status: "upcoming",
  },
  {
    number: 5,
    name: "Deuteronomy",
    timeline: "2028-2033",
    description: "Complete. $63M Hafatsa — the full vision realized.",
    milestones: [
      "10M Nova Keys worldwide",
      "$63M cumulative revenue",
      "ASL standard adopted by major institutions",
      "Self-sustaining Hafatsa network",
      "Na Nach Nachma Nachman MeUman — global reach",
    ],
    status: "upcoming",
  },
];

export const COLORS = {
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
} as const;

export const SITE_CONFIG = {
  name: "Dream Nova",
  tagline: "Stop Calculating. Start Living.",
  description:
    "Sacred NFC technology merging Breslov wisdom with cutting-edge AI. Your key to the Nova network.",
  url: "https://dreamnova.vercel.app",
  ogImage: "/og-image.png",
  creator: "DreamNova Inc.",
  email: "contact@dreamnova.com",
  social: {
    twitter: "https://x.com/dreamnova",
    github: "https://github.com/CodeNoLimits",
    telegram: "https://t.me/dreamnova",
  },
} as const;
