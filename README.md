# DREAM NOVA V5 -- The Source Code of Reality

> **Stop Calculating. Start Living.**

Dream Nova V5 is a sacred NFC platform merging Breslov spirituality with cutting-edge technology. It delivers physical Nova Key cards linked to an on-chain identity layer, a polymorphic compiler for adversarial resilience, zero-knowledge NFC verification, and an entropy-based anomaly detection system -- all unified under a single monorepo.

## Architecture -- Four Pillars

| Pillar | Component | Language | Purpose |
|--------|-----------|----------|---------|
| **Tzimtzum** | `crates/tzimtzum` | Rust | zk-SNARK circuit for NFC identity verification (Plonkish arithmetization via Halo2) |
| **Evolutrix** | `crates/evolutrix` | Rust | Polymorphic compiler core -- AST mutation, ISR, and Moving Target Defense |
| **Esther AI** | `python/esther` | Python/MLX | Shannon entropy monitoring + GNN anomaly detection on Apple Silicon |
| **Nova Web** | `apps/web` | TypeScript | Next.js 16 storefront, NFC portal, and user dashboard |

Supporting crates: `antimatrix` (hypervisor), `nova-morph` (binary transformation), `nfc-bridge` (hardware layer), `vdf` (verifiable delay function), `dag-ledger` (DAG-based transaction log).

## Monorepo Structure

```
dreamnova-v5/
  apps/
    web/              Next.js 16 + React 19 + TailwindCSS 4 + Stripe
    docs/             Documentation site (planned)
  crates/
    tzimtzum/         zk-SNARK NFC verification
    evolutrix/        Polymorphic compiler core
    antimatrix/       Hypervisor and entropy control plane
    nova-morph/       Binary transformation engine
    nfc-bridge/       NFC hardware abstraction
    vdf/              Verifiable Delay Function
    dag-ledger/       DAG-based transaction ledger
  python/
    esther/           Entropy monitoring + GNN anomaly detection (MLX)
    pyproject.toml    Python project configuration
  packages/
    core/             Shared TypeScript types, constants, sacred numbers
    crypto/           Cryptographic utilities (planned)
    ui/               Shared UI component library (planned)
  docs/
    whitepaper/       The Source Code of Reality whitepaper
    architecture/     System architecture documentation
    patents/          Patent strategy and claims
  Cargo.toml          Rust workspace root
```

## Quick Start

### Web Application

```bash
cd apps/web
npm install
npm run dev          # http://localhost:3000 (Turbopack)
npm run build        # Production build
npm run type-check   # TypeScript validation
```

### Rust Crates

```bash
cargo build                    # Build all crates
cargo build -p tzimtzum        # Build only tzimtzum
cargo test                     # Run all tests
cargo build --release          # Optimized release (fat LTO)
```

### Python / Esther AI

```bash
cd python
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

# Run entropy monitor
python -c "
import asyncio
from esther import EstherMonitor
monitor = EstherMonitor()
asyncio.run(monitor.run())
"
```

## Sacred Numbers

These constants permeate the system -- from pricing tiers to cryptographic seeds.

| Number | Meaning | Usage |
|--------|---------|-------|
| **63** | SaG -- Kabbalistic divine name gematria | Nova Key price ($63) |
| **148** | Nachman (gematria of the name) | Hafatsa points threshold |
| **491** | Na Nach Nachma Nachman MeUman | PRNG seed, sacred constant |
| **613** | Total commandments (Taryag Mitzvot) | Tikkun Master level |
| **7** | Days of creation, Sefirot below | Product tier count |
| **10** | Sefirot | Configuration base |

## Design System

- **Gold**: `#D4AF37` -- Sacred, premium, divine light
- **Cyan**: `#00D4FF` -- Technology, innovation, water of Torah
- **Deep Black**: `#050508` -- The void before creation (Tzimtzum)
- **Fonts**: Cinzel (display), Rajdhani (body), Space Mono (code), Cormorant Garamond (sacred text)

## Documentation

- [Whitepaper](docs/whitepaper/) -- The Source Code of Reality
- [Architecture](docs/architecture/) -- System design and data flows
- [Patents](docs/patents/) -- Intellectual property strategy

## Environment Variables

See `.env.local.example` for the complete list. Key variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=https://dreamnova.vercel.app
```

## Deployment

```bash
# Web (Vercel)
cd apps/web && vercel --prod

# Rust (release binary)
cargo build --release

# Python (package)
cd python && pip install -e .
```

## License

Proprietary. All rights reserved. Copyright 2024-2026 DreamNova.

---

Na Nach Nachma Nachman MeUman
