# vdf

**Verifiable Delay Function — Wesolowski construction for temporal consensus barriers.**

A VDF proves that a specific amount of sequential computation was performed, without shortcuts. Used in DreamNova's DAG ledger to prevent time-bandit attacks and in Tzimtzum for anti-replay nonce generation.

> Reference: "Efficient Verifiable Delay Functions" — Wesolowski (2019), EUROCRYPT.

## How it works

```
Input: seed x, time parameter T, modulus N

Evaluate:   y  = x^(2^T) mod N          ← T sequential squarings, cannot be parallelised
Prove:      pi = x^(floor(2^T / l)) mod N   where l = H(x || y)  [prime]
Verify:     pi^l * x^r == y mod N        where r = 2^T mod l     ← O(log T), fast
```

Evaluation is inherently sequential (the "delay"). Verification is fast. Anyone can check without re-running the work.

## Quick start

```rust
use vdf::{VdfChallenge, evaluate, prove, verify};
use num_bigint::BigUint;

// Setup: choose modulus (use ≥2048-bit RSA modulus in production)
let modulus = BigUint::from(323u32); // toy value for examples

// Step 1 — Prover: evaluate (sequential work)
let challenge = VdfChallenge::from_hash(b"epoch-seed", 50, &modulus).unwrap();
let y = evaluate(&challenge).unwrap();

// Step 2 — Prover: generate Wesolowski proof
let proof = prove(&challenge, &y).unwrap();

// Step 3 — Verifier: fast O(log T) check
verify(&challenge, &proof).unwrap();
println!("VDF verified: y = {}", proof.y);
```

## Use in DAG-Ledger epoch transitions

```rust
use vdf::{VdfChallenge, evaluate, prove, verify};
use num_bigint::BigUint;

// Each validator must present a valid VDF proof to advance the epoch
let seed = b"nova-epoch-42";
let t = 1_000_000u64; // ~seconds of sequential work at target hardware speed

let modulus = /* ceremony-derived RSA modulus */ BigUint::from(323u32);
let challenge = VdfChallenge::from_hash(seed, t, &modulus).unwrap();
let y = evaluate(&challenge).unwrap();
let proof = prove(&challenge, &y).unwrap();

// All peers can verify cheaply
verify(&challenge, &proof).unwrap();
```

## Use in Tzimtzum anti-replay nonces

```rust
use tzimtzum::vdf_nonce;

// Generate a compact 32-byte nonce from a VDF output
let nonce = vdf_nonce::generate(b"epoch-seed", 20).unwrap();

// Verify nonce was honestly computed
vdf_nonce::verify(b"epoch-seed", 20, nonce).unwrap();
```

## Security note

This prototype uses a small demo modulus. In production:

- Use a **≥2048-bit RSA modulus** from a trusted ceremony (no one knows the factorisation)
- Or use **class groups of imaginary quadratic fields** (no trusted setup required)
- Time parameter `T` should be calibrated so evaluation takes ~10 seconds on target hardware

## API reference

| Function | Description |
|----------|-------------|
| `VdfChallenge::from_hash(seed, t, n)` | Derive challenge `x` from seed via SHA-256 |
| `evaluate(challenge)` | Compute `y = x^(2^T) mod N` — sequential work |
| `prove(challenge, y)` | Compute Wesolowski proof `pi` — fast |
| `verify(challenge, proof)` | Check `pi^l * x^r == y mod N` — O(log T) |

## Status

| Component | Status |
|-----------|--------|
| Sequential evaluation | ✅ Implemented |
| Wesolowski proof generation | ✅ Implemented |
| Wesolowski verification | ✅ Implemented |
| Class-group modulus | 🔜 Planned (removes trusted setup) |
| WASM target | 🔜 Planned |

## License

Licensed under either [MIT](LICENSE-MIT) or [Apache 2.0](LICENSE-APACHE) at your option.
