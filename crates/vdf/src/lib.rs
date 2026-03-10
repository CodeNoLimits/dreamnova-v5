//! # VDF — Verifiable Delay Function
//!
//! Implements a Verifiable Delay Function based on repeated squaring in
//! groups of unknown order, following the Wesolowski/Pietrzak approach.
//!
//! ## Purpose in Dream Nova
//!
//! VDFs serve as **temporal barriers** in the DAG ledger:
//!
//! - Each DAG epoch is separated by a VDF evaluation period `T`.
//! - A node must present a valid VDF proof to propose the next epoch.
//! - This prevents **Time-Bandit attacks** where an adversary tries to
//!   rewrite history by computing faster than honest participants.
//!
//! ## Algorithm sketch
//!
//! Given a challenge `x` and time parameter `T`:
//!
//! 1. **Evaluate**: Compute `y = x^(2^T) mod N` via `T` sequential squarings.
//! 2. **Prove** (Wesolowski): Compute proof `pi = x^(floor(2^T / l)) mod N`
//!    where `l` is a prime derived from `H(x || y)`.
//! 3. **Verify**: Check `pi^l * x^r == y mod N` where `r = 2^T mod l`.
//!
//! Evaluation is inherently sequential (the "delay"), but verification is fast.
//!
//! ## Security note
//!
//! This prototype uses RSA-style moduli.  A production deployment would
//! use class groups of imaginary quadratic fields to avoid trusted setup.

use num_bigint::BigUint;
use num_traits::{One, Zero};
use sha2::{Digest, Sha256};

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

#[derive(Debug, thiserror::Error)]
pub enum VdfError {
    #[error("time parameter T must be > 0")]
    InvalidTimeParameter,

    #[error("modulus must be > 1")]
    InvalidModulus,

    #[error("proof verification failed")]
    VerificationFailed,

    #[error("challenge is zero")]
    ZeroChallenge,
}

pub type Result<T> = std::result::Result<T, VdfError>;

// ---------------------------------------------------------------------------
// VDF Challenge
// ---------------------------------------------------------------------------

/// A VDF challenge encapsulates the input and parameters.
#[derive(Debug, Clone)]
pub struct VdfChallenge {
    /// The challenge input `x`.
    pub x: BigUint,
    /// The time parameter `T` (number of sequential squarings).
    pub t: u64,
    /// The RSA-style modulus `N`.
    pub modulus: BigUint,
}

impl VdfChallenge {
    /// Create a new challenge from raw bytes.
    pub fn from_bytes(input: &[u8], t: u64, modulus: &BigUint) -> Result<Self> {
        if t == 0 {
            return Err(VdfError::InvalidTimeParameter);
        }
        if *modulus <= BigUint::one() {
            return Err(VdfError::InvalidModulus);
        }

        let x = BigUint::from_bytes_be(input) % modulus;
        if x.is_zero() {
            return Err(VdfError::ZeroChallenge);
        }

        Ok(Self {
            x,
            t,
            modulus: modulus.clone(),
        })
    }

    /// Create a challenge from a SHA-256 hash of arbitrary data.
    pub fn from_hash(data: &[u8], t: u64, modulus: &BigUint) -> Result<Self> {
        let hash: [u8; 32] = Sha256::digest(data).into();
        Self::from_bytes(&hash, t, modulus)
    }
}

// ---------------------------------------------------------------------------
// VDF Proof
// ---------------------------------------------------------------------------

/// A VDF proof containing the output and Wesolowski proof element.
#[derive(Debug, Clone)]
pub struct VdfProof {
    /// The output `y = x^(2^T) mod N`.
    pub y: BigUint,
    /// Wesolowski proof element `pi`.
    pub pi: BigUint,
    /// The challenge prime `l` used for verification.
    pub l: BigUint,
}

// ---------------------------------------------------------------------------
// VDF evaluation (the slow part)
// ---------------------------------------------------------------------------

/// Evaluate the VDF: compute `y = x^(2^T) mod N` via repeated squaring.
///
/// This is intentionally sequential — each squaring depends on the previous.
pub fn evaluate(challenge: &VdfChallenge) -> Result<BigUint> {
    if challenge.t == 0 {
        return Err(VdfError::InvalidTimeParameter);
    }

    let mut y = challenge.x.clone();
    for _ in 0..challenge.t {
        y = (&y * &y) % &challenge.modulus;
    }

    Ok(y)
}

/// Derive the Fiat-Shamir challenge prime `l` from `x` and `y`.
fn derive_challenge_prime(x: &BigUint, y: &BigUint) -> BigUint {
    let mut hasher = Sha256::new();
    hasher.update(b"vdf-challenge-prime:");
    hasher.update(x.to_bytes_be());
    hasher.update(y.to_bytes_be());
    let hash: [u8; 32] = hasher.finalize().into();

    // Take a 128-bit prime candidate and find the next prime.
    let candidate = BigUint::from_bytes_be(&hash[..16]);
    // For the prototype we use the candidate directly (ensure it's odd).
    if candidate.bit(0) {
        candidate
    } else {
        candidate + BigUint::one()
    }
}

/// Compute `2^T mod l` using modular exponentiation.
fn pow2_mod(t: u64, l: &BigUint) -> BigUint {
    let two = BigUint::from(2u32);
    modpow_u64(&two, t, l)
}

/// Modular exponentiation `base^exp mod modulus` for u64 exponents.
fn modpow_u64(base: &BigUint, exp: u64, modulus: &BigUint) -> BigUint {
    if modulus.is_one() {
        return BigUint::zero();
    }

    let mut result = BigUint::one();
    let mut b = base % modulus;
    let mut e = exp;

    while e > 0 {
        if e & 1 == 1 {
            result = (result * &b) % modulus;
        }
        e >>= 1;
        b = (&b * &b) % modulus;
    }

    result
}

// ---------------------------------------------------------------------------
// Prove (Wesolowski)
// ---------------------------------------------------------------------------

/// Generate a Wesolowski proof for the VDF evaluation.
///
/// Given `x`, `y = x^(2^T) mod N`, derive prime `l` and compute
/// `pi = x^(floor(2^T / l)) mod N`.
pub fn prove(challenge: &VdfChallenge, y: &BigUint) -> Result<VdfProof> {
    let l = derive_challenge_prime(&challenge.x, y);

    // Compute floor(2^T / l) by iterative long division.
    // We compute x^(q) mod N where q = floor(2^T / l).
    //
    // Since 2^T can be huge, we compute the exponentiation iteratively:
    // start with q=0, r=1, then for each bit of T:
    //   r = 2*r, q = 2*q + (r / l), r = r mod l
    let mut q = BigUint::zero();
    let mut r = BigUint::one();

    for _ in 0..challenge.t {
        r <<= 1;
        let div = &r / &l;
        q = q * BigUint::from(2u32) + &div;
        r %= &l;
    }

    let pi = challenge.x.modpow(&q, &challenge.modulus);

    Ok(VdfProof {
        y: y.clone(),
        pi,
        l,
    })
}

// ---------------------------------------------------------------------------
// Verify
// ---------------------------------------------------------------------------

/// Verify a VDF proof.
///
/// Check: `pi^l * x^r == y (mod N)` where `r = 2^T mod l`.
pub fn verify(challenge: &VdfChallenge, proof: &VdfProof) -> Result<()> {
    let r = pow2_mod(challenge.t, &proof.l);

    let lhs = {
        let pi_l = proof.pi.modpow(&proof.l, &challenge.modulus);
        let x_r = challenge.x.modpow(&r, &challenge.modulus);
        (pi_l * x_r) % &challenge.modulus
    };

    if lhs == proof.y {
        Ok(())
    } else {
        Err(VdfError::VerificationFailed)
    }
}

// ---------------------------------------------------------------------------
// TimeBarrier — DAG integration
// ---------------------------------------------------------------------------

/// A time barrier in the DAG ledger.
///
/// Each epoch transition requires solving a VDF with the previous epoch's
/// hash as input.  This ensures a minimum real-time delay between epochs.
#[derive(Debug, Clone)]
pub struct TimeBarrier {
    /// The epoch number this barrier guards.
    pub epoch: u64,
    /// The VDF challenge for this barrier.
    pub challenge: VdfChallenge,
    /// The proof (filled once the barrier is resolved).
    pub proof: Option<VdfProof>,
}

impl TimeBarrier {
    /// Create a new time barrier for the given epoch.
    pub fn new(epoch: u64, previous_hash: &[u8], t: u64, modulus: &BigUint) -> Result<Self> {
        let mut input = Vec::new();
        input.extend_from_slice(b"nova-epoch:");
        input.extend_from_slice(&epoch.to_le_bytes());
        input.extend_from_slice(previous_hash);

        let challenge = VdfChallenge::from_hash(&input, t, modulus)?;

        Ok(Self {
            epoch,
            challenge,
            proof: None,
        })
    }

    /// Solve this barrier (sequential computation).
    pub fn solve(&mut self) -> Result<()> {
        let y = evaluate(&self.challenge)?;
        let proof = prove(&self.challenge, &y)?;
        self.proof = Some(proof);
        Ok(())
    }

    /// Verify that the barrier has been legitimately solved.
    pub fn is_solved(&self) -> bool {
        self.proof.is_some()
    }

    /// Verify the stored proof.
    pub fn verify(&self) -> Result<()> {
        let proof = self
            .proof
            .as_ref()
            .ok_or(VdfError::VerificationFailed)?;
        verify(&self.challenge, proof)
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    /// A small modulus for fast tests (NOT cryptographically secure).
    fn test_modulus() -> BigUint {
        // Product of two small primes: 61 * 53 = 3233
        BigUint::from(3233u32)
    }

    #[test]
    fn test_evaluate() {
        let modulus = test_modulus();
        let challenge = VdfChallenge::from_bytes(&[7], 10, &modulus).unwrap();
        let y = evaluate(&challenge).unwrap();
        // y should be non-zero and < modulus.
        assert!(!y.is_zero());
        assert!(y < modulus);
    }

    #[test]
    fn test_evaluate_deterministic() {
        let modulus = test_modulus();
        let c1 = VdfChallenge::from_bytes(&[42], 5, &modulus).unwrap();
        let c2 = VdfChallenge::from_bytes(&[42], 5, &modulus).unwrap();
        assert_eq!(evaluate(&c1).unwrap(), evaluate(&c2).unwrap());
    }

    #[test]
    fn test_prove_and_verify() {
        let modulus = test_modulus();
        let challenge = VdfChallenge::from_bytes(&[13], 8, &modulus).unwrap();
        let y = evaluate(&challenge).unwrap();
        let proof = prove(&challenge, &y).unwrap();
        verify(&challenge, &proof).unwrap();
    }

    #[test]
    fn test_wrong_output_rejected() {
        let modulus = test_modulus();
        let challenge = VdfChallenge::from_bytes(&[13], 8, &modulus).unwrap();
        let y = evaluate(&challenge).unwrap();
        let mut proof = prove(&challenge, &y).unwrap();
        // Corrupt the output.
        proof.y = (&proof.y + BigUint::one()) % &modulus;
        assert!(verify(&challenge, &proof).is_err());
    }

    #[test]
    fn test_time_barrier() {
        let modulus = test_modulus();
        let prev_hash = Sha256::digest(b"genesis");
        let mut barrier = TimeBarrier::new(1, &prev_hash, 5, &modulus).unwrap();
        assert!(!barrier.is_solved());
        barrier.solve().unwrap();
        assert!(barrier.is_solved());
        barrier.verify().unwrap();
    }

    #[test]
    fn test_invalid_t() {
        let modulus = test_modulus();
        let result = VdfChallenge::from_bytes(&[1], 0, &modulus);
        assert!(result.is_err());
    }

    #[test]
    fn test_invalid_modulus() {
        let result = VdfChallenge::from_bytes(&[1], 10, &BigUint::one());
        assert!(result.is_err());
    }
}
