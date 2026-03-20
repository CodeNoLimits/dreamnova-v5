# tzimtzum

**Zero-knowledge identity verification for NFC hardware tokens — Halo2/Plonkish arithmetization.**

Named after the Kabbalistic concept of *Tzimtzum* (divine contraction), this crate proves — without revealing any secret — that a Nova Key holder is a valid, registered participant. Each proof is single-use (nullifier) and anti-replay (VDF nonce).

> Comparable: Aleo ($1.4B) — applied to hardware identity.

## What it proves (without revealing)

1. **Key knowledge** — the holder knows the NFC private key matching a registered public key
2. **Merkle inclusion** — the key is in the global registry (Poseidon hash tree)
3. **Nullifier uniqueness** — this exact proof can only be used once
4. **VDF anti-replay** — the challenge nonce was honestly computed, preventing old-proof reuse

## Quick start

```rust
use tzimtzum::{TzimtzumCircuit, Witness, PublicInputs, Verifier, build_single_leaf_tree};
use tzimtzum::identity::IdentityRegistry;

// --- Prover side ---
let private_key = [0x42u8; 32];
let mut registry = IdentityRegistry::new(4);
registry.register_key("alice", private_key).unwrap();

let nonce = [0xABu8; 32]; // use tzimtzum::vdf_nonce::generate() in production
let proof = registry.prove_identity("alice", private_key, nonce).unwrap();

// --- Verifier side ---
registry.verify_proof(&proof, nonce).unwrap();
assert_eq!(registry.spent_proof_count(), 1);

// A second use of the same proof is rejected (nullifier collision)
assert!(registry.verify_proof(&proof, nonce).is_err());
```

## VDF-backed anti-replay nonces

```rust
use tzimtzum::vdf_nonce;

// Prover: generate an unforgeable epoch nonce (sequential work)
let nonce = vdf_nonce::generate(b"epoch-42", 20).unwrap();

// Verifier: confirm the nonce is valid — fast Wesolowski O(log T) check
let (nonce2, challenge, proof) = vdf_nonce::generate_with_proof(b"epoch-42", 20).unwrap();
vdf_nonce::verify_with_proof(nonce2, &challenge, &proof).unwrap();
```

## Architecture

```
Private Witness (secret)          Public Inputs (visible)
  ├─ NFC private key               ├─ VDF challenge nonce
  ├─ Derived public key            └─ Merkle root of registry
  └─ Merkle path

            ▼  TzimtzumCircuit ▼

Constraint 1: public_key == H(private_key)
Constraint 2: Merkle path from leaf → root matches merkle_root
Constraint 3: nullifier == H(private_key || nonce)  [single-use]

            ▼  ZkSnarkProof ▼

  proof_bytes + nullifier (stored by verifier to prevent reuse)
```

## Multi-key registry

```rust
use tzimtzum::identity::IdentityRegistry;

let mut registry = IdentityRegistry::new(8); // tree depth 8 → up to 256 keys

registry.register_key("alice", [0x01u8; 32]).unwrap();
registry.register_key("bob",   [0x02u8; 32]).unwrap();

// Each user gets their own Merkle proof
let nonce = [0x00u8; 32];
let proof_alice = registry.prove_identity("alice", [0x01u8; 32], nonce).unwrap();
registry.verify_proof(&proof_alice, nonce).unwrap();
```

## Feature flags

| Flag | Description |
|------|-------------|
| *(default)* | Simulated prover — SHA-256 stand-in for Poseidon, suitable for integration tests |
| `halo2` | Full Halo2 Plonkish circuit — real ZK proofs (requires `halo2_proofs`) |

## Status

| Component | Status |
|-----------|--------|
| Key derivation constraint | ✅ Implemented |
| Merkle inclusion constraint | ✅ Implemented |
| Nullifier uniqueness | ✅ Implemented |
| VDF anti-replay nonce | ✅ Implemented |
| Multi-key IdentityRegistry | ✅ Implemented |
| Halo2 arithmetization | 🔜 Behind `halo2` feature flag |
| Poseidon hash (native) | 🔜 Planned (SHA-256 stand-in now) |

## Research context

Tzimtzum is part of the DreamNova post-quantum AI infrastructure:

- **NFC-BRIDGE** — Hardware token interface (DESFire EV3)
- **DAG-LEDGER** — Uses VDF nonces for epoch anti-replay
- **ANTIMATRIX** — Constitutional verifier (SEC-NOVA-004: nullifier reuse)

## License

Licensed under either [MIT](LICENSE-MIT) or [Apache 2.0](LICENSE-APACHE) at your option.

## Patent

USPTO Provisional Patent Application filed March 2026.
*"Zero-Knowledge Proof System for NFC Hardware Token Identity Verification"*
