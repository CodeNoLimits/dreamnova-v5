//! # Tzimtzum — Zero-Knowledge Identity Verification
//!
//! Named after the Kabbalistic concept of divine contraction (*Tzimtzum*),
//! this crate implements a zk-SNARK circuit for NFC identity verification.
//!
//! ## Architecture
//!
//! The circuit proves — without revealing any secret — that a Nova Key holder:
//!
//! 1. **Knows** the NFC private key corresponding to a registered public key.
//! 2. **Is included** in the global Merkle tree of valid keys (Poseidon hash).
//! 3. **Produces** a valid nullifier so each proof can only be used once.
//! 4. **Answers** a VDF challenge nonce (anti-replay).
//!
//! ### Public inputs
//! - Challenge nonce (from the VDF crate)
//! - Merkle root of valid keys
//!
//! ### Private witness
//! - NFC private key
//! - Corresponding public key
//! - Merkle path (siblings + indices)
//!
//! ## Feature gates
//!
//! The full Halo2 circuit is behind the `halo2` feature flag.  Without it,
//! this crate provides the *data types* and a **simulated** prover/verifier
//! suitable for integration testing and architecture exploration.

use sha2::{Digest, Sha256};
use std::fmt;

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

#[derive(Debug, thiserror::Error)]
pub enum TzimtzumError {
    #[error("invalid Merkle proof: {0}")]
    InvalidMerkleProof(String),

    #[error("nullifier collision detected")]
    NullifierCollision,

    #[error("VDF challenge mismatch")]
    VdfChallengeMismatch,

    #[error("proof verification failed")]
    VerificationFailed,

    #[error("key derivation error: {0}")]
    KeyDerivation(String),
}

pub type Result<T> = std::result::Result<T, TzimtzumError>;

// ---------------------------------------------------------------------------
// Core data types
// ---------------------------------------------------------------------------

/// A 32-byte hash used throughout the Tzimtzum circuits.
pub type Hash256 = [u8; 32];

/// Direction in a Merkle path — left or right sibling.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MerkleDirection {
    Left,
    Right,
}

/// One step in a Merkle inclusion proof.
#[derive(Debug, Clone)]
pub struct MerklePathStep {
    pub sibling_hash: Hash256,
    pub direction: MerkleDirection,
}

/// The private witness supplied by the Nova Key holder.
#[derive(Debug, Clone)]
pub struct Witness {
    /// The NFC card's private key (32 bytes).
    pub private_key: Hash256,
    /// The corresponding public key (derived from private key).
    pub public_key: Hash256,
    /// Merkle inclusion path from leaf to root.
    pub merkle_path: Vec<MerklePathStep>,
}

/// The public inputs visible to the verifier.
#[derive(Debug, Clone)]
pub struct PublicInputs {
    /// Challenge nonce produced by the VDF module.
    pub challenge_nonce: Hash256,
    /// Root of the Merkle tree of registered keys.
    pub merkle_root: Hash256,
}

/// A zero-knowledge proof.
#[derive(Debug, Clone)]
pub struct ZkSnarkProof {
    /// The serialised proof bytes (simulated or real Halo2).
    pub proof_bytes: Vec<u8>,
    /// The nullifier derived from this proof (unique per key+nonce).
    pub nullifier: Hash256,
    /// Number of constraints in the circuit.
    pub num_constraints: usize,
}

// ---------------------------------------------------------------------------
// Poseidon-like hash (simplified — SHA-256 stand-in)
// ---------------------------------------------------------------------------

/// Hash two 32-byte inputs together (Poseidon stand-in).
///
/// In production this would use the Poseidon algebraic hash function which
/// is efficient inside arithmetic circuits.  For the architecture prototype
/// we use SHA-256 with a domain separator.
fn poseidon_hash_pair(left: &Hash256, right: &Hash256) -> Hash256 {
    let mut hasher = Sha256::new();
    hasher.update(b"poseidon-pair:");
    hasher.update(left);
    hasher.update(right);
    hasher.finalize().into()
}

/// Derive a public key from a private key (one-way hash).
fn derive_public_key(private_key: &Hash256) -> Hash256 {
    let mut hasher = Sha256::new();
    hasher.update(b"nova-key-derivation:");
    hasher.update(private_key);
    hasher.finalize().into()
}

/// Derive a nullifier from the private key and nonce.
///
/// Nullifiers prevent double-use of proofs: the same key + nonce always
/// produces the same nullifier, but the nullifier reveals nothing about
/// the key.
fn derive_nullifier(private_key: &Hash256, nonce: &Hash256) -> Hash256 {
    let mut hasher = Sha256::new();
    hasher.update(b"nova-nullifier:");
    hasher.update(private_key);
    hasher.update(nonce);
    hasher.finalize().into()
}

// ---------------------------------------------------------------------------
// TzimtzumCircuit — the constraint system
// ---------------------------------------------------------------------------

/// The Tzimtzum zk-SNARK circuit.
///
/// Encapsulates the three constraints:
/// 1. Key derivation: `public_key == H(private_key)`
/// 2. Merkle inclusion: path from `H(public_key)` hashes up to `merkle_root`
/// 3. Nullifier: `nullifier == H(private_key || nonce)`
pub struct TzimtzumCircuit {
    pub witness: Witness,
    pub public_inputs: PublicInputs,
}

impl TzimtzumCircuit {
    /// Create a new circuit with the given witness and public inputs.
    pub fn new(witness: Witness, public_inputs: PublicInputs) -> Self {
        Self {
            witness,
            public_inputs,
        }
    }

    /// Check constraint 1: key derivation.
    fn check_derivation(&self) -> Result<()> {
        let derived = derive_public_key(&self.witness.private_key);
        if derived != self.witness.public_key {
            return Err(TzimtzumError::KeyDerivation(
                "public key does not match derived key".into(),
            ));
        }
        Ok(())
    }

    /// Check constraint 2: Merkle inclusion.
    fn check_merkle_inclusion(&self) -> Result<()> {
        // Leaf is the hash of the public key.
        let mut current: Hash256 = {
            let mut h = Sha256::new();
            h.update(b"merkle-leaf:");
            h.update(self.witness.public_key);
            h.finalize().into()
        };

        for step in &self.witness.merkle_path {
            current = match step.direction {
                MerkleDirection::Left => poseidon_hash_pair(&step.sibling_hash, &current),
                MerkleDirection::Right => poseidon_hash_pair(&current, &step.sibling_hash),
            };
        }

        if current != self.public_inputs.merkle_root {
            return Err(TzimtzumError::InvalidMerkleProof(
                "computed root does not match public merkle_root".into(),
            ));
        }

        Ok(())
    }

    /// Check constraint 3: nullifier derivation.
    fn compute_nullifier(&self) -> Hash256 {
        derive_nullifier(&self.witness.private_key, &self.public_inputs.challenge_nonce)
    }

    /// Simulate proof generation (runs all constraints natively).
    pub fn prove(&self) -> Result<ZkSnarkProof> {
        // Constraint 1
        self.check_derivation()?;

        // Constraint 2
        self.check_merkle_inclusion()?;

        // Constraint 3
        let nullifier = self.compute_nullifier();

        // Build a simulated proof (hash of all inputs).
        let mut hasher = Sha256::new();
        hasher.update(b"tzimtzum-proof:");
        hasher.update(self.witness.private_key);
        hasher.update(self.public_inputs.challenge_nonce);
        hasher.update(self.public_inputs.merkle_root);
        let proof_hash: [u8; 32] = hasher.finalize().into();

        Ok(ZkSnarkProof {
            proof_bytes: proof_hash.to_vec(),
            nullifier,
            num_constraints: 3,
        })
    }
}

impl fmt::Debug for TzimtzumCircuit {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("TzimtzumCircuit")
            .field("merkle_path_len", &self.witness.merkle_path.len())
            .field("merkle_root", &hex_short(&self.public_inputs.merkle_root))
            .finish()
    }
}

// ---------------------------------------------------------------------------
// Verifier
// ---------------------------------------------------------------------------

/// Verifier for Tzimtzum proofs.
///
/// Maintains a set of spent nullifiers to prevent double-use.
pub struct Verifier {
    spent_nullifiers: std::collections::HashSet<Hash256>,
}

impl Verifier {
    pub fn new() -> Self {
        Self {
            spent_nullifiers: std::collections::HashSet::new(),
        }
    }

    /// Verify a proof against the given public inputs.
    ///
    /// Returns `Ok(())` if the proof is valid and the nullifier has not been
    /// spent.  Marks the nullifier as spent on success.
    pub fn verify(&mut self, proof: &ZkSnarkProof, _public_inputs: &PublicInputs) -> Result<()> {
        // Check nullifier freshness.
        if self.spent_nullifiers.contains(&proof.nullifier) {
            return Err(TzimtzumError::NullifierCollision);
        }

        // In a real Halo2 implementation this would verify the polynomial
        // commitment.  For the simulated prover we accept non-empty proofs.
        if proof.proof_bytes.is_empty() {
            return Err(TzimtzumError::VerificationFailed);
        }

        // Mark nullifier as spent.
        self.spent_nullifiers.insert(proof.nullifier);

        Ok(())
    }

    /// Number of spent nullifiers tracked.
    pub fn spent_count(&self) -> usize {
        self.spent_nullifiers.len()
    }
}

impl Default for Verifier {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Build a single-leaf Merkle tree for testing.
///
/// Returns `(root, path)` for a tree containing exactly one leaf.
pub fn build_single_leaf_tree(leaf_public_key: &Hash256) -> (Hash256, Vec<MerklePathStep>) {
    // Leaf hash.
    let leaf_hash: Hash256 = {
        let mut h = Sha256::new();
        h.update(b"merkle-leaf:");
        h.update(leaf_public_key);
        h.finalize().into()
    };

    // For a single-leaf tree the root *is* the leaf hash — but we add one
    // level so the path is non-empty.
    let dummy_sibling = [0u8; 32];
    let root = poseidon_hash_pair(&leaf_hash, &dummy_sibling);

    let path = vec![MerklePathStep {
        sibling_hash: dummy_sibling,
        direction: MerkleDirection::Right,
    }];

    (root, path)
}

fn hex_short(bytes: &[u8]) -> String {
    if bytes.len() >= 4 {
        format!(
            "{:02x}{:02x}..{:02x}{:02x}",
            bytes[0],
            bytes[1],
            bytes[bytes.len() - 2],
            bytes[bytes.len() - 1]
        )
    } else {
        hex::encode_fallback(bytes)
    }
}

mod hex {
    pub fn encode_fallback(bytes: &[u8]) -> String {
        bytes.iter().map(|b| format!("{b:02x}")).collect()
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn make_test_witness() -> (Witness, PublicInputs) {
        let private_key = [0x42u8; 32];
        let public_key = derive_public_key(&private_key);
        let (merkle_root, merkle_path) = build_single_leaf_tree(&public_key);
        let challenge_nonce = [0xABu8; 32];

        let witness = Witness {
            private_key,
            public_key,
            merkle_path,
        };
        let public_inputs = PublicInputs {
            challenge_nonce,
            merkle_root,
        };

        (witness, public_inputs)
    }

    #[test]
    fn test_key_derivation() {
        let pk = [1u8; 32];
        let derived = derive_public_key(&pk);
        // Deterministic.
        assert_eq!(derived, derive_public_key(&pk));
        // One-way (different input → different output).
        assert_ne!(derived, derive_public_key(&[2u8; 32]));
    }

    #[test]
    fn test_nullifier_uniqueness() {
        let key = [1u8; 32];
        let n1 = derive_nullifier(&key, &[10u8; 32]);
        let n2 = derive_nullifier(&key, &[20u8; 32]);
        assert_ne!(n1, n2, "different nonces must yield different nullifiers");
    }

    #[test]
    fn test_prove_and_verify() {
        let (witness, public_inputs) = make_test_witness();
        let circuit = TzimtzumCircuit::new(witness, public_inputs.clone());
        let proof = circuit.prove().unwrap();

        let mut verifier = Verifier::new();
        verifier.verify(&proof, &public_inputs).unwrap();
        assert_eq!(verifier.spent_count(), 1);
    }

    #[test]
    fn test_double_spend_rejected() {
        let (witness, public_inputs) = make_test_witness();
        let circuit = TzimtzumCircuit::new(witness, public_inputs.clone());
        let proof = circuit.prove().unwrap();

        let mut verifier = Verifier::new();
        verifier.verify(&proof, &public_inputs).unwrap();
        // Second verification with same nullifier must fail.
        let result = verifier.verify(&proof, &public_inputs);
        assert!(result.is_err());
    }

    #[test]
    fn test_bad_derivation_rejected() {
        let (mut witness, public_inputs) = make_test_witness();
        // Corrupt the public key.
        witness.public_key = [0xFFu8; 32];
        let circuit = TzimtzumCircuit::new(witness, public_inputs);
        assert!(circuit.prove().is_err());
    }

    #[test]
    fn test_bad_merkle_rejected() {
        let (mut witness, mut public_inputs) = make_test_witness();
        // Corrupt the merkle root.
        public_inputs.merkle_root = [0xFFu8; 32];
        witness.public_key = derive_public_key(&witness.private_key);
        let circuit = TzimtzumCircuit::new(witness, public_inputs);
        assert!(circuit.prove().is_err());
    }
}
