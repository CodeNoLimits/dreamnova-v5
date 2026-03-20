import type { PricingTier, Pillar, Phase, Metric } from "@/types";

// Backward-compatible sacred numbers (used by Nova Key checkout & product pages)
export const SACRED_NUMBERS = {
  SAG: { value: 63, name: "SaG", meaning: "Divine name gematria", hebrew: "\u05E1\u05D2" },
  NACHMAN: { value: 148, name: "Nachman", meaning: "Rabbi Nachman gematria", hebrew: "\u05E0\u05D7\u05DE\u05DF" },
  TIKKUN: { value: 613, name: "Tikkun Master", meaning: "Total commandments", hebrew: "\u05EA\u05E8\u05D9\u05F4\u05D2" },
  PAIR: { value: 99, name: "Pair Covenant", meaning: "Sacred partnership", hebrew: "\u05E6\u05D8" },
  PLATINUM: { value: 149, name: "Platinum", meaning: "Communal elevation", hebrew: "\u05E7\u05DE\u05D8" },
} as const;

// Nova Key consumer tiers (checkout page)
export const NOVA_KEY_TIERS = [
  {
    name: "Covenant Pack",
    price: 63,
    currency: "USD",
    description: "Your key to the Nova network.",
    features: [
      "1x Nova Key NFC Card (DESFire EV3)",
      "Zero-knowledge identity verification",
      "Platform portal access",
      "Lifetime license",
      "Priority community access",
    ],
    sacredNumber: SACRED_NUMBERS.SAG,
    popular: true,
  },
  {
    name: "Pair Covenant",
    price: 99,
    currency: "USD",
    description: "Two keys, one mission.",
    features: [
      "2x Nova Key NFC Cards",
      "Everything in Covenant Pack",
      "Shared dashboard",
      "Pair content access",
    ],
    sacredNumber: SACRED_NUMBERS.PAIR,
  },
  {
    name: "Platinum Covenant",
    price: 149,
    currency: "USD",
    description: "Premium materials, premium access.",
    features: [
      "1x Platinum Nova Key (Stainless Steel)",
      "Everything in Covenant Pack",
      "Private channel access",
      "1-on-1 onboarding session",
      "Lifetime priority support",
    ],
    sacredNumber: SACRED_NUMBERS.PLATINUM,
  },
];

export const METRICS: Metric[] = [
  { value: "< 5ms", label: "Threat Response", sublabel: "Zero-copy proof verification" },
  { value: "99.97%", label: "Detection Rate", sublabel: "GNN anomaly classification" },
  { value: "6", label: "Isolation Levels", sublabel: "Hypervisor sandboxing" },
  { value: "0", label: "Data Exposed", sublabel: "Zero-knowledge architecture" },
];

export const PILLARS: Pillar[] = [
  {
    name: "Evolutrix",
    icon: "Brain",
    subtitle: "Polymorphic Meta-Language Compiler",
    description:
      "Self-evolving defense that mutates its own instruction set, data layouts, and execution paths every cycle. Attackers reverse-engineer a ghost — the real system has already moved.",
    features: [
      "AMTD — Automated Moving Target Defense with rolling cryptographic keys",
      "DSLR — Data Structure Layout Randomization preventing memory exploitation",
      "ISR — Instruction Set Randomization via polymorphic AST mutation",
      "MTD — Moving Target Decoys with phantom node injection",
    ],
    color: "#D4AF37",
    metric: { value: "10^18", label: "unique configurations per cycle" },
  },
  {
    name: "Antimatrix",
    icon: "Shield",
    subtitle: "AI Confinement Hypervisor",
    description:
      "Formally verified sandboxing for AI workloads. Six isolation levels from standard containerization to complete immolation. Constitutional constraints enforced at the hardware level.",
    features: [
      "CSDD — Constitutional Spec-Driven Development with Z3 SMT verification",
      "6 isolation levels: Standard → Elevated → Quarantine → Containment → Lockdown → Immolation",
      "Real-time resource budgeting with Wasmtime fuel system",
      "Hardware-backed enforcement via Secure Enclave",
    ],
    color: "#00D4FF",
    metric: { value: "100%", label: "formal verification coverage" },
  },
  {
    name: "Tzimtzum",
    icon: "Lock",
    subtitle: "Zero-Knowledge Verification Engine",
    description:
      "Prove identity, compliance, and integrity without exposing a single byte of sensitive data. Halo2 zk-SNARKs deliver cryptographic certainty in under 50 milliseconds.",
    features: [
      "Halo2 zk-SNARKs with Plonkish arithmetization — no trusted setup required",
      "Solid-Liquid state transitions: encrypted on disk, projected to RAM only on valid proof",
      "Merkle-based identity verification without data exposure",
      "VDF time-barriers preventing replay and pre-computation attacks",
    ],
    color: "#D4AF37",
    metric: { value: "< 50ms", label: "proof generation time" },
  },
  {
    name: "Esther AI",
    icon: "Activity",
    subtitle: "Autonomous Threat Intelligence",
    description:
      "Shannon entropy derivatives and Graph Neural Networks detect anomalies invisible to signature-based systems. Phantom FLOP detection catches supply-chain compromises at the silicon level.",
    features: [
      "Shannon entropy derivative analysis for statistical anomaly detection",
      "GNN with multi-head graph attention — learns your network topology",
      "PMU/kperf Phantom FLOP detection for hardware-level supply chain security",
      "Autonomous response daemon with sub-second containment",
    ],
    color: "#00D4FF",
    metric: { value: "1.846 bits", label: "entropy baseline H(F)" },
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Sentinel",
    price: "$250K",
    period: "/year",
    description:
      "Single-site deployment for organizations entering autonomous defense.",
    features: [
      "Up to 500 endpoints",
      "Evolutrix polymorphic defense",
      "Tzimtzum zero-knowledge proofs",
      "Esther AI threat monitoring",
      "Standard isolation (Level 1-3)",
      "8×5 support with 4-hour SLA",
      "Quarterly threat intelligence reports",
    ],
    cta: "Request Demo",
  },
  {
    name: "Fortress",
    price: "$750K",
    period: "/year",
    description:
      "Multi-site deployment with full SOC integration and 24/7 autonomous response.",
    features: [
      "Unlimited endpoints",
      "Full Antimatrix hypervisor (all 6 levels)",
      "SIEM / SOAR / EDR integration suite",
      "DAG-UTXO immutable audit ledger",
      "Dedicated threat hunting team",
      "24/7 support with 1-hour SLA",
      "Custom constitutional policies",
      "On-site deployment engineering",
    ],
    popular: true,
    cta: "Request Demo",
    highlight: "Most Deployed",
  },
  {
    name: "Hegemony",
    price: "Custom",
    period: "",
    description:
      "Full platform sovereignty. Sealed hardware. Dedicated engineering team. Your rules.",
    features: [
      "Everything in Fortress",
      "Hardware-as-a-Service (sealed compute nodes)",
      "Dedicated engineering team (4-8 FTE)",
      "Custom Evolutrix rule engine",
      "Private DAG ledger instance",
      "Board-level security briefings",
      "Patent-protected deployment",
      "Nova silicon integration roadmap",
    ],
    cta: "Contact Sales",
  },
];

export const PHASES: Phase[] = [
  {
    number: 1,
    name: "Core Engine",
    timeline: "Q1–Q2 2026",
    description:
      "Rust-native foundation with production-grade proof systems and polymorphic compilation.",
    milestones: [
      "7 Rust crates: Evolutrix, Antimatrix, Tzimtzum, NovaMorph, VDF, NFC-Bridge, DAG-Ledger",
      "103 verified tests across all security modules",
      "Halo2 zk-SNARK circuit with Merkle inclusion proofs",
      "Esther AI entropy monitor with GNN anomaly detection",
      "Shadow Mode deployment for early enterprise partners",
    ],
    status: "active",
  },
  {
    number: 2,
    name: "Enterprise Integration",
    timeline: "Q3–Q4 2026",
    description:
      "SOC-ready connectors and compliance automation for regulated industries.",
    milestones: [
      "SIEM integration (Splunk, Sentinel, QRadar)",
      "SOAR playbook automation",
      "EDR connector framework",
      "SOC 2 Type II certification",
      "ISO 27001 alignment",
    ],
    status: "upcoming",
  },
  {
    number: 3,
    name: "Autonomous Defense",
    timeline: "2027",
    description:
      "Self-healing infrastructure with AI-driven threat response and zero human intervention.",
    milestones: [
      "Autonomous incident response engine",
      "Self-healing network topology",
      "Predictive threat modeling (72-hour horizon)",
      "Cross-tenant threat intelligence sharing",
      "Federal certification (FedRAMP, CMMC)",
    ],
    status: "upcoming",
  },
  {
    number: 4,
    name: "Industry Verticals",
    timeline: "2027–2028",
    description:
      "Purpose-built modules for pharmaceutical, defense, and high-frequency trading.",
    milestones: [
      "Pharma: GxP-compliant data integrity proofs",
      "Defense: ITAR/EAR automated compliance",
      "HFT: Sub-microsecond threat detection",
      "Healthcare: HIPAA zero-knowledge audit",
      "Critical infrastructure: ICS/SCADA protection",
    ],
    status: "upcoming",
  },
  {
    number: 5,
    name: "Hardware Sovereignty",
    timeline: "2028+",
    description:
      "Sealed compute nodes with Nova silicon. The final layer — hardware you can mathematically trust.",
    milestones: [
      "Nova silicon: purpose-built security processor",
      "Sealed compute nodes (tamper-evident HaaS)",
      "DNA-level data storage integration",
      "Global mesh network deployment",
      "Industry standard ratification (IEEE/NIST)",
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
  tagline: "Autonomous Cybersecurity Platform",
  description:
    "Self-evolving polymorphic defense, zero-knowledge verification, and autonomous AI threat response. Enterprise-grade cybersecurity that evolves faster than the threat.",
  url: "https://dreamnova.vercel.app",
  ogImage: "/og-image.png",
  creator: "DreamNova Inc.",
  email: "enterprise@dreamnova.com",
  social: {
    twitter: "https://x.com/dreamnova",
    github: "https://github.com/CodeNoLimits/dreamnova-v5",
    linkedin: "https://linkedin.com/company/dreamnova",
  },
} as const;

export const TERMINAL_LINES = [
  { text: "$ nova deploy --mode=shadow --cluster=primary", color: "white" },
  { text: "", color: "dim" },
  { text: "[EVOLUTRIX] Compiling polymorphic AST...", color: "gold" },
  { text: "[EVOLUTRIX] \u2713 DSLR randomization applied (seed: 0x7A3F)", color: "green" },
  { text: "[EVOLUTRIX] \u2713 ISR rolling key derived (256-bit)", color: "green" },
  { text: "", color: "dim" },
  { text: "[TZIMTZUM] Generating Halo2 zk-SNARK proofs...", color: "cyan" },
  { text: "[TZIMTZUM] \u2713 Proof verified in 4.7ms", color: "green" },
  { text: "", color: "dim" },
  { text: "[ANTIMATRIX] Hypervisor isolation: LEVEL_4_QUARANTINE", color: "yellow" },
  { text: "[ANTIMATRIX] \u2713 Constitutional layers: 6/6 verified", color: "green" },
  { text: "", color: "dim" },
  { text: "[ESTHER] Entropy baseline: H(F) = 1.846 bits", color: "cyan" },
  { text: "[ESTHER] \u2713 GNN anomaly score: 0.023 (nominal)", color: "green" },
  { text: "", color: "dim" },
  { text: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", color: "dim" },
  { text: "\u2713 Shadow Mode ACTIVE \u2014 0 data exposed", color: "gold" },
  { text: "\u2713 1,247 endpoints protected", color: "gold" },
  { text: "\u2713 Autonomous threat response: ARMED", color: "gold" },
] as const;

export const RUST_CODE = `// crates/evolutrix/src/mutator.rs — Line 47
impl Mutator {
    pub fn evolve(&self, ast: &mut AbstractSyntaxTree) {
        // Phase 1: DSLR — Randomize memory layout
        self.randomize_field_order(ast);

        // Phase 2: ISR — Encrypt with rolling key
        let key = self.derive_rolling_key();
        self.encrypt_instructions(ast, &key);

        // Phase 3: MTD — Inject phantom decoys
        self.inject_decoys(ast, DecoyStrategy::Adaptive);

        // The attacker's reverse engineering is obsolete
        // before they finish analyzing the previous cycle
    }
}`;
