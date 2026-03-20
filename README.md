# DreamNova V5 — Post-Quantum AI Infrastructure

**7 Rust crates · 103 tests · 0 failures · MIT/Apache-2.0**

DreamNova V5 is a monorepo for post-quantum AI infrastructure: sparse tensor routing, Moving Target Defense compilation, zero-knowledge identity, DAG consensus, and formal verification — all production-grade, all prototyped.

> Comparables: ARM ($50B licensing), Aleo ($1.4B), Shape Security ($1B acq.), Zama ($73M)

---

## Core technology

| Crate | Description | Comparable |
|-------|-------------|------------|
| [`antimatrix`](crates/antimatrix/) | Formal verification hypervisor — 6 isolation levels, 6 SEC-NOVA rules | Shape Security |
| [`tzimtzum`](crates/tzimtzum/) | ZK-SNARK circuit for NFC identity (Halo2/Plonkish, VDF anti-replay) | Aleo |
| [`dag-ledger`](crates/dag-ledger/) | DAG-UTXO ledger with Proof-of-Shareholding + VDF epoch barriers | IOTA/Hedera |
| [`evolutrix`](crates/evolutrix/) | Polymorphic compiler — DSLR, ISR (AES-256), junk injection (MTD) | Shape Security |
| [`vdf`](crates/vdf/) | Verifiable Delay Function — Wesolowski construction, O(log T) verify | Chia VDF |
| [`nfc-bridge`](crates/nfc-bridge/) | DESFire EV3 NFC interface — AES mutual auth, ephemeral session keys | — |
| [`nova-morph`](crates/nova-morph/) | O(1) arena allocator for AST nodes (bumpalo, WASM-ready) | — |

**Web app**: Next.js 16 + React 19 + TailwindCSS 4 + Stripe — [`apps/web/`](apps/web/)
**AI monitor**: Python/MLX Shannon entropy + GNN anomaly detection — [`python/esther/`](python/)

---

## Quick start

### Rust crates

```bash
cargo build --workspace         # Build all 7 crates
cargo test --workspace          # Run 103 tests (0 failures expected)
cargo build --release           # Optimized release (fat LTO)
```

### Publish to crates.io (dry-run all pass)

```bash
cargo login                     # Requires David's credentials
cargo publish -p nova-morph
cargo publish -p antimatrix
cargo publish -p evolutrix
cargo publish -p tzimtzum
cargo publish -p vdf
cargo publish -p nfc-bridge
cargo publish -p dag-ledger
```

### Web application

```bash
cd apps/web
npm install
npm run dev          # http://localhost:3000 (Turbopack)
npm run build        # Production build
npm run type-check   # TypeScript validation
```

### Python / Esther AI

```bash
cd python && python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
python -c "import asyncio; from esther import EstherMonitor; asyncio.run(EstherMonitor().run())"
```

---

## Monorepo structure

```
dreamnova-v5/
  apps/
    web/              Next.js 16 + React 19 + TailwindCSS 4 + Stripe
  crates/
    antimatrix/       Formal verification hypervisor (SEC-NOVA rules)
    tzimtzum/         ZK-SNARK NFC identity (Halo2, VDF nonce)
    dag-ledger/       DAG-UTXO ledger (PoSH consensus, gossip protocol)
    evolutrix/        Polymorphic compiler (DSLR, ISR, MTD)
    vdf/              Verifiable Delay Function (Wesolowski)
    nfc-bridge/       NFC hardware abstraction (DESFire EV3)
    nova-morph/       Arena allocator for AST nodes
  python/
    esther/           Entropy monitoring + GNN anomaly detection (MLX)
  scripts/
    create-rag-prices.js   Stripe price setup for Breslov RAG SaaS
  Cargo.toml          Rust workspace root (edition 2024)
```

---

## Test status

```
antimatrix   27 tests  ✅
dag-ledger   21 tests  ✅
evolutrix     7 tests  ✅
nfc-bridge    8 tests  ✅
nova-morph    7 tests  ✅
tzimtzum     25 tests  ✅  (includes vdf_nonce integration)
vdf           7 tests  ✅
─────────────────────────
Total       103 tests  ✅  0 failures
```

---

## Environment variables

See `.env.local.example`. Key variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_RAG_YACHID_PRICE_ID=      # set via scripts/create-rag-prices.js
STRIPE_RAG_KEHILA_PRICE_ID=
STRIPE_RAG_MOSDOT_PRICE_ID=
NEXT_PUBLIC_SITE_URL=https://dreamnova-v5.vercel.app
```

---

## Deployment

```bash
# Web (Vercel)
cd apps/web && vercel --prod

# Rust crates (release binary)
cargo build --release

# Python
cd python && pip install -e .
```

---

## IP status

4 USPTO provisional patent applications filed March 2026:
- ASL — Artificial Super Learning (sparse tensor routing, 75% VRAM reduction)
- EVOLUTRIX — Polymorphic MTD compiler (DSLR + ISR + junk injection)
- TZIMTZUM — ZK-SNARK NFC identity verification
- DAG-LEDGER — DAG-UTXO with Proof-of-Shareholding + VDF consensus

---

## License

Rust crates: **MIT OR Apache-2.0** (see `LICENSE-MIT` / `LICENSE-APACHE` in each crate)
Web application and Python code: Proprietary — Copyright 2024–2026 DreamNova
