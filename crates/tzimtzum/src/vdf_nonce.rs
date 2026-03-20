//! # VDF-based Challenge Nonce Generation
//!
//! Bridges the VDF crate with Tzimtzum's anti-replay mechanism.
//!
//! ## Purpose
//!
//! The Tzimtzum circuit requires a `challenge_nonce` in its public inputs.
//! This nonce must be:
//!
//! 1. **Unpredictable** — derived from external, time-stamped entropy.
//! 2. **Sequential** — cannot be computed faster than real time (VDF property).
//! 3. **Verifiable** — any party can check the nonce was computed honestly.
//!
//! Using a raw random nonce allows replay: an adversary could reuse an old proof
//! with a new nonce.  A VDF nonce forces honest re-evaluation at each epoch,
//! making old proofs worthless.
//!
//! ## Usage
//!
//! ```rust
//! use tzimtzum::vdf_nonce;
//!
//! let seed = b"epoch-1-seed";
//! let t = 20u64; // time parameter (higher = slower, harder to precompute)
//!
//! // Prover side: generate the nonce (sequential work).
//! let nonce = vdf_nonce::generate(seed, t).expect("VDF evaluation failed");
//!
//! // Verifier side: confirm the nonce is valid for this seed+t.
//! vdf_nonce::verify(seed, t, nonce).expect("VDF nonce mismatch");
//! ```

use num_bigint::BigUint;
use sha2::{Digest, Sha256};

use crate::{Hash256, TzimtzumError, Result};

// ---------------------------------------------------------------------------
// RSA-style modulus for prototype (production: class group)
// ---------------------------------------------------------------------------

/// Default modulus for the VDF (1024-bit RSA-style, hardcoded for prototype).
///
/// In production this would be a class-group discriminant or a trusted-setup
/// RSA modulus from a ceremony.  For the prototype, we use a well-known
/// safe-prime product: N = p * q where p, q are hardcoded primes.
///
/// **Security note**: this prototype modulus is NOT cryptographically secure.
/// Replace with a ≥2048-bit RSA modulus or a class-group element in production.
fn default_modulus() -> BigUint {
    // Use a large enough modulus that fits in 256 bits for test speed.
    // N = 2^255 - 19 (Curve25519 prime) — not a product of two primes but
    // sufficient as a simulation modulus for the prototype.
    let mut bytes = [0xffu8; 32];
    bytes[0] = 0x7f; // clear top bit: 2^255 - 1
    // Subtract 19: adjust last byte
    let n = BigUint::from_bytes_be(&bytes) - BigUint::from(19u32);
    n
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/// Generate a VDF-based challenge nonce from an epoch seed.
///
/// Runs the VDF sequential evaluation (`y = seed^(2^t) mod N`), then hashes
/// the output to produce a compact 32-byte nonce suitable for `PublicInputs`.
///
/// # Arguments
/// * `seed` — arbitrary epoch identifier bytes (e.g., epoch number + block hash)
/// * `t`    — time parameter controlling sequential work (higher = more delay)
///
/// # Returns
/// A 32-byte nonce `H("vdf-nonce:" || y_bytes)`.
pub fn generate(seed: &[u8], t: u64) -> Result<Hash256> {
    let modulus = default_modulus();
    let challenge = vdf::VdfChallenge::from_hash(seed, t, &modulus)
        .map_err(|e| TzimtzumError::KeyDerivation(e.to_string()))?;

    let y = vdf::evaluate(&challenge)
        .map_err(|e| TzimtzumError::KeyDerivation(e.to_string()))?;

    Ok(hash_vdf_output(&y))
}

/// Verify that a nonce was honestly computed for the given seed and time parameter.
///
/// Re-evaluates the VDF from scratch and checks `H(y) == nonce`.
/// Returns [`TzimtzumError::VdfChallengeMismatch`] if the nonce is stale or forged.
pub fn verify(seed: &[u8], t: u64, nonce: Hash256) -> Result<()> {
    let expected = generate(seed, t)?;
    if expected != nonce {
        return Err(TzimtzumError::VdfChallengeMismatch);
    }
    Ok(())
}

/// Generate a VDF proof for the given seed (allows fast third-party verification).
///
/// Returns `(nonce, challenge, proof)`. The verifier can call `vdf::verify()`
/// in O(log T) time instead of re-evaluating the full VDF.
pub fn generate_with_proof(
    seed: &[u8],
    t: u64,
) -> Result<(Hash256, vdf::VdfChallenge, vdf::VdfProof)> {
    let modulus = default_modulus();
    let challenge = vdf::VdfChallenge::from_hash(seed, t, &modulus)
        .map_err(|e| TzimtzumError::KeyDerivation(e.to_string()))?;

    let y = vdf::evaluate(&challenge)
        .map_err(|e| TzimtzumError::KeyDerivation(e.to_string()))?;

    let proof = vdf::prove(&challenge, &y)
        .map_err(|e| TzimtzumError::KeyDerivation(e.to_string()))?;

    let nonce = hash_vdf_output(&y);
    Ok((nonce, challenge, proof))
}

/// Fast-path verification using a pre-computed Wesolowski proof (O(log T)).
///
/// Verifies the proof first, then checks `H(y) == nonce`.
pub fn verify_with_proof(
    nonce: Hash256,
    challenge: &vdf::VdfChallenge,
    proof: &vdf::VdfProof,
) -> Result<()> {
    vdf::verify(challenge, proof)
        .map_err(|_| TzimtzumError::VdfChallengeMismatch)?;

    let expected = hash_vdf_output(&proof.y);
    if expected != nonce {
        return Err(TzimtzumError::VdfChallengeMismatch);
    }
    Ok(())
}

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

fn hash_vdf_output(y: &BigUint) -> Hash256 {
    let mut h = Sha256::new();
    h.update(b"vdf-nonce:");
    h.update(y.to_bytes_be());
    h.finalize().into()
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    const T: u64 = 15; // small T for fast tests

    #[test]
    fn test_generate_is_deterministic() {
        let n1 = generate(b"epoch-1", T).unwrap();
        let n2 = generate(b"epoch-1", T).unwrap();
        assert_eq!(n1, n2, "same seed+t must yield same nonce");
    }

    #[test]
    fn test_different_seeds_different_nonces() {
        let n1 = generate(b"epoch-1", T).unwrap();
        let n2 = generate(b"epoch-2", T).unwrap();
        assert_ne!(n1, n2, "different seeds must yield different nonces");
    }

    #[test]
    fn test_different_t_different_nonces() {
        let n1 = generate(b"seed", T).unwrap();
        let n2 = generate(b"seed", T + 1).unwrap();
        assert_ne!(n1, n2, "different t must yield different nonces");
    }

    #[test]
    fn test_verify_accepts_correct_nonce() {
        let nonce = generate(b"test-epoch", T).unwrap();
        verify(b"test-epoch", T, nonce).unwrap();
    }

    #[test]
    fn test_verify_rejects_wrong_nonce() {
        let nonce = generate(b"test-epoch", T).unwrap();
        let mut bad_nonce = nonce;
        bad_nonce[0] ^= 0xFF; // flip bits
        let result = verify(b"test-epoch", T, bad_nonce);
        assert!(
            matches!(result, Err(TzimtzumError::VdfChallengeMismatch)),
            "corrupted nonce must trigger VdfChallengeMismatch"
        );
    }

    #[test]
    fn test_verify_rejects_stale_seed() {
        let nonce = generate(b"epoch-1", T).unwrap();
        // Use nonce from epoch-1 but claim it's for epoch-2.
        let result = verify(b"epoch-2", T, nonce);
        assert!(
            matches!(result, Err(TzimtzumError::VdfChallengeMismatch)),
            "nonce from wrong seed must be rejected"
        );
    }

    #[test]
    fn test_generate_with_proof_roundtrip() {
        let (nonce, challenge, proof) = generate_with_proof(b"epoch-proof", T).unwrap();
        // Fast-path verification.
        verify_with_proof(nonce, &challenge, &proof).unwrap();
    }

    #[test]
    fn test_verify_with_proof_rejects_bad_proof() {
        use num_bigint::BigUint;
        let (nonce, challenge, _proof) = generate_with_proof(b"epoch-proof", T).unwrap();
        let bad_proof = vdf::VdfProof {
            y: BigUint::from(42u32),
            pi: BigUint::from(1u32),
            l: BigUint::from(3u32),
        };
        let result = verify_with_proof(nonce, &challenge, &bad_proof);
        assert!(matches!(result, Err(TzimtzumError::VdfChallengeMismatch)));
    }

    #[test]
    fn test_nonce_usable_in_identity_registry() {
        use crate::identity::IdentityRegistry;

        // Generate a VDF nonce as the verifier would.
        let epoch_seed = b"nova-epoch-0";
        let nonce = generate(epoch_seed, T).unwrap();

        // Use the VDF nonce in the full ZKP identity flow.
        let mut registry = IdentityRegistry::new(4);
        let sk = [0x42u8; 32];
        registry.register_key("vdf-user", sk).unwrap();

        let proof = registry.prove_identity("vdf-user", sk, nonce).unwrap();
        registry.verify_proof(&proof, nonce).unwrap();
        assert_eq!(registry.spent_proof_count(), 1);
    }
}
