# DREAM NOVA V5 -- Claude Code Project Context

## Overview
DreamNova V5 is a sacred NFC platform. Monorepo with Rust crates (cryptography, zk-SNARKs, polymorphic compilation), a Next.js 16 web app, a Python/MLX entropy monitoring subsystem, and shared TypeScript packages.

**Live URL:** https://dreamnova.vercel.app
**Repository:** https://github.com/CodeNoLimits/dreamnova-v5
**Vercel Project:** dreamnova (team: dream-ais-projects)

## Quick Start

```bash
# Web
cd apps/web && npm install && npm run dev

# Rust
cargo build

# Python Esther AI
cd python && pip install -e ".[dev]"
```

## Directory Structure

```
dreamnova-v5/
  Cargo.toml                   Rust workspace root
  apps/
    web/                       Next.js 16.1.6 + React 19 + TailwindCSS 4
      src/app/
        (marketing)/           Public: /, /nova-key, /source-code, /contact, /privacy, /terms, /refund, /manifesto, /research
        (shop)/                E-commerce: /checkout, /success
        (portal)/              NFC-unlocked: /unlock, /tikkun, /azamra
        (auth)/                Authentication: /login, /register
        (dashboard)/           User: /overview, /orders, /hafatsa, /nfc, /settings
        (docs)/                Docs: /whitepaper, /architecture
        api/
          stripe/              POST checkout + webhook
          contact/             POST contact form
          nfc/                 POST NFC scan tracking
          waitlist/            POST email signup
      src/components/
        marketing/             Landing page components
        shared/                Cross-route shared components
        ui/                    Atomic UI primitives
      src/lib/                 Utility functions, Supabase client, Stripe helpers
      src/types/               Local type definitions
  crates/
    tzimtzum/                  zk-SNARK NFC verification (Halo2)
    evolutrix/                 Polymorphic compiler (AST mutation, ISR, MTD)
    antimatrix/                Hypervisor, entropy control plane
    nova-morph/                Binary transformation engine
    nfc-bridge/                NFC hardware abstraction layer
    vdf/                       Verifiable Delay Function
    dag-ledger/                DAG-based transaction log
  python/
    esther/                    Entropy monitoring + GNN anomaly detection
      __init__.py              Package exports
      config.py                EstherConfig dataclass
      entropy.py               Shannon entropy derivatives (MLX)
      gnn.py                   EstherGNN graph neural network (mlx.nn)
      monitor.py               EstherMonitor async daemon
    pyproject.toml             Python packaging config
  packages/
    core/                      Shared TS types, constants, sacred numbers
      src/index.ts             Package entry point
      src/constants.ts         SACRED_NUMBERS, DESIGN_TOKENS, PRODUCT_TIERS
      src/types.ts             NovaKey, User, Order, etc. interfaces
    crypto/                    Cryptographic utilities (planned)
    ui/                        Shared component library (planned)
  docs/
    whitepaper/                The Source Code of Reality
    architecture/              System design documentation
    patents/                   Patent strategy (PCT/USPTO)
```

## Design System Tokens

```typescript
// Sacred palette
GOLD = "#D4AF37"           // Divine light, premium
GOLD_LIGHT = "#E8C960"
GOLD_DARK = "#B8941F"
CYAN = "#00D4FF"           // Technology, water of Torah
CYAN_LIGHT = "#33DDFF"
CYAN_DARK = "#00A8CC"
BLACK = "#050508"          // Void (Tzimtzum)
BLACK_LIGHT = "#0A0A10"
BLACK_MEDIUM = "#111118"

// Fonts
DISPLAY = "Cinzel"         // Headings
BODY = "Rajdhani"          // Body text
CODE = "Space Mono"        // Code blocks
SACRED = "Cormorant Garamond"  // Sacred text
```

## API Routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/stripe/webhook` | Handle Stripe webhook events |
| POST | `/api/waitlist` | Email waitlist signup |
| POST | `/api/contact` | Contact form submission |
| POST | `/api/nfc` | NFC scan tracking and analytics |

## Sacred Numbers Reference

```typescript
SACRED_NUMBERS = {
  SAG: 63,           // Divine name gematria -> Nova Key price
  NACHMAN: 148,      // Name gematria -> Hafatsa threshold
  PETEK: 491,        // Full phrase gematria -> PRNG seed
  TARYAG: 613,       // Total mitzvot -> Tikkun Master
  SEFIROT: 10,       // Configuration base
  CREATION_DAYS: 7,  // Product tier count
}
```

## Deployment

```bash
# Web to Vercel
cd apps/web
vercel --prod --token=<VERCEL_TOKEN>

# Type check before deploy
npm run type-check

# Rust release
cargo build --release
```

## Key Technical Decisions

1. **Framer Motion**: Always use `as const` on ease strings (e.g., `ease: "easeOut" as const`)
2. **Supabase client**: Must be called inside event handlers, NOT at component top level (SSR prerender)
3. **Stripe API version**: Must be `'2026-01-28.clover'` (Stripe v20.3.x)
4. **TailwindCSS 4**: Uses `@tailwindcss/postcss` plugin, NOT `tailwindcss` directly
5. **MLX (Python)**: Apple Silicon only, uses Metal for GPU acceleration
6. **Rust edition 2024**: Workspace-level edition setting, resolver v3

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=https://dreamnova.vercel.app
RESEND_API_KEY=
```

## Key Files Index

| File | Purpose |
|------|---------|
| `Cargo.toml` | Rust workspace definition, shared deps |
| `apps/web/package.json` | Web app deps and scripts |
| `apps/web/tailwind.config.ts` | Sacred design system colors and animations |
| `apps/web/next.config.ts` | Security headers, image optimization |
| `python/pyproject.toml` | Python packaging, MLX deps |
| `python/esther/entropy.py` | Core entropy derivative computation |
| `python/esther/gnn.py` | Graph neural network anomaly model |
| `python/esther/monitor.py` | Real-time monitoring daemon |
| `packages/core/src/constants.ts` | Sacred numbers, design tokens |
| `packages/core/src/types.ts` | Shared TypeScript interfaces |
