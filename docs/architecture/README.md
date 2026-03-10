# DreamNova V5 -- Architecture Documentation

## System Overview

```
                          +-------------------+
                          |   Nova Web App    |
                          | (Next.js 16/React)|
                          +--------+----------+
                                   |
                          +--------v----------+
                          |    API Layer       |
                          | Stripe | Supabase  |
                          | NFC    | Waitlist  |
                          +--------+----------+
                                   |
              +--------------------+--------------------+
              |                    |                    |
    +---------v--------+  +-------v--------+  +--------v--------+
    |  @dreamnova/core |  |  Esther AI     |  |  Rust Crates    |
    |  (TS Types +     |  |  (Python/MLX)  |  |  (Crypto/ZK/    |
    |   Constants)     |  |  Entropy + GNN |  |   Compiler)     |
    +------------------+  +-------+--------+  +--------+--------+
                                  |                    |
                          +-------v--------+  +--------v--------+
                          |  Antimatrix    |  |   Tzimtzum      |
                          |  Hypervisor    |  |   zk-SNARK      |
                          |  (IPC Socket)  |  |   Circuit       |
                          +----------------+  +-----------------+
```

## Component Interaction Map

### Web to API Flow

```
Browser -> Next.js Server Components -> Supabase (auth + data)
Browser -> Next.js Route Handlers -> Stripe (payments)
Browser -> NFC Web API -> Route Handler -> nfc_scans table
```

### Esther AI to Antimatrix Flow

```
System State -> EstherMonitor.poll_once()
  -> compute_entropy_derivative() [MLX GPU]
  -> EstherGNN.anomaly_score() [MLX GPU]
  -> AlertEvent
  -> Unix Socket IPC -> Antimatrix Hypervisor
  -> [Action: quarantine | alert | log]
```

### NFC Verification Flow (Tzimtzum)

```
Physical NFC Card (NTAG 215)
  -> Phone NFC Reader (Web NFC API)
  -> Raw NDEF payload
  -> nfc-bridge crate (parse + validate)
  -> tzimtzum crate (zk-SNARK proof generation)
  -> Proof submitted to API
  -> Verifier confirms without seeing card secret
  -> Portal content unlocked
```

### Polymorphic Compilation Flow (Evolutrix)

```
Source AST -> Evolutrix compiler
  -> Semantic analysis (preserve behavior)
  -> AST mutation pass (randomize structure)
  -> ISR pass (instruction set randomization)
  -> DSLR pass (dynamic semantic lattice rewriting)
  -> Unique binary output
  -> Binary hash logged to dag-ledger
```

## Data Flow Descriptions

### User Purchase

1. User selects Nova Key tier on `/nova-key` page
2. Client calls `POST /api/stripe/checkout` with tier + quantity
3. Server creates Stripe Checkout Session with line items
4. User completes payment on Stripe-hosted page
5. Stripe fires webhook to `POST /api/stripe/webhook`
6. Server creates order in `orders` table, generates NFC key record in `nfc_keys`
7. User redirected to `/success` with order confirmation
8. Physical Nova Key card shipped with pre-programmed NTAG 215

### NFC Scan

1. User taps Nova Key card to phone
2. Web NFC API reads NDEF record containing encrypted identity payload
3. Frontend sends payload to `POST /api/nfc`
4. Server decrypts, validates against `nfc_keys` table
5. Scan logged to `nfc_scans` table with geolocation + timestamp
6. User gains access to portal content (`/tikkun`, `/azamra`)
7. Hafatsa points awarded to the card owner

### Entropy Monitoring

1. EstherMonitor polls system state at configured interval (default 100ms)
2. State vector ingested into sliding window buffer
3. Shannon entropy computed for each timestep via MLX
4. Finite-difference derivative calculated
5. GNN builds topology graph from state buffer
6. Anomaly score computed via learned attention patterns
7. If z-score exceeds threshold: AlertEvent dispatched
8. Alert sent to registered handlers + Antimatrix IPC socket

## Security Model

### Defense in Depth Layers

| Layer | Component | Protection |
|-------|-----------|------------|
| 1 - Perimeter | Next.js headers | XSS, clickjacking, MIME sniffing |
| 2 - Authentication | Supabase Auth + RLS | Row-level access control |
| 3 - Identity | Tzimtzum zk-SNARK | Zero-knowledge NFC verification |
| 4 - Runtime | Evolutrix MTD | Polymorphic binary mutation |
| 5 - Monitoring | Esther AI | Entropy anomaly detection |
| 6 - Control | Antimatrix | Automated incident response |
| 7 - Audit | dag-ledger | Immutable transaction log |

### HTTP Security Headers

All responses include:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(self), nfc=(self)`

### Cryptographic Primitives

- **Hashing**: SHA-256 (via `sha2` crate)
- **Encryption**: AES-256 (via `aes` crate)
- **ZK Proofs**: Halo2 Plonkish arithmetization (optional dep)
- **VDF**: Repeated squaring in RSA group (via `vdf` crate)
- **Randomness**: `rand` crate (ChaCha20 CSPRNG)

## Database Schema

```
profiles         User profiles (linked to Supabase Auth)
orders           Purchase records
order_items      Individual items per order
nfc_keys         Registered NFC card identities
nfc_scans        Scan event log (timestamp, location, device)
waitlist         Pre-launch email signups
hafatsa_points   Spiritual distribution point balances
referrals        Referral tracking (r/CODE system)
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Entropy detection latency | < 100ms |
| zk-SNARK proof generation | < 2s |
| Rust release binary size | < 10MB |
