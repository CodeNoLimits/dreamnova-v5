//! Identity registry and multi-leaf Merkle tree for Tzimtzum.
//!
//! Provides the higher-level primitives needed to manage a set of registered
//! Nova Key public keys and issue zero-knowledge identity proofs.

use sha2::{Digest, Sha256};
use std::collections::HashMap;

use crate::{
    derive_public_key, Hash256, MerkleDirection, MerklePathStep,
    PublicInputs, Result, TzimtzumCircuit, TzimtzumError, Verifier, Witness, ZkSnarkProof,
};

// ---------------------------------------------------------------------------
// Multi-leaf Merkle tree
// ---------------------------------------------------------------------------

/// A Merkle tree of registered Nova Key public keys.
///
/// Leaves are `SHA-256("merkle-leaf:" || public_key)`.
/// Internal nodes use `poseidon_hash_pair(left, right)` (SHA-256 stand-in).
///
/// The tree is always padded to the next power of two with zero-hash leaves.
#[derive(Debug, Clone)]
pub struct MerkleTree {
    /// The registered public keys (in insertion order).
    leaves: Vec<Hash256>,
    /// Cached tree nodes: `nodes[0]` = root, leaves at the bottom level.
    nodes: Vec<Hash256>,
    /// Number of leaf positions (next power of two ≥ leaves.len()).
    capacity: usize,
}

impl MerkleTree {
    /// Create an empty tree with the given initial capacity (rounded up to power of two).
    pub fn new(initial_capacity: usize) -> Self {
        let capacity = next_power_of_two(initial_capacity.max(1));
        let total_nodes = 2 * capacity; // perfect binary tree
        Self {
            leaves: Vec::new(),
            nodes: vec![[0u8; 32]; total_nodes],
            capacity,
        }
    }

    /// Insert a public key as a new leaf.
    ///
    /// Rebuilds the tree. Returns an error if the tree is full.
    pub fn insert(&mut self, public_key: Hash256) -> Result<usize> {
        if self.leaves.len() >= self.capacity {
            return Err(TzimtzumError::InvalidMerkleProof(
                "tree capacity exceeded".into(),
            ));
        }
        let index = self.leaves.len();
        self.leaves.push(public_key);
        self.rebuild();
        Ok(index)
    }

    /// Current Merkle root.
    pub fn root(&self) -> Hash256 {
        if self.leaves.is_empty() {
            return [0u8; 32];
        }
        self.nodes[1] // 1-indexed: root at index 1
    }

    /// Number of registered keys.
    pub fn len(&self) -> usize {
        self.leaves.len()
    }

    pub fn is_empty(&self) -> bool {
        self.leaves.is_empty()
    }

    /// Generate a Merkle inclusion proof for the leaf at `index`.
    pub fn generate_proof(&self, index: usize) -> Result<Vec<MerklePathStep>> {
        if index >= self.leaves.len() {
            return Err(TzimtzumError::InvalidMerkleProof(
                format!("leaf index {index} out of range (len={})", self.leaves.len()),
            ));
        }

        let mut path = Vec::new();
        // Leaf level: position in nodes[] = capacity + index (1-indexed).
        let mut pos = self.capacity + index; // 1-indexed leaf position

        while pos > 1 {
            // Convention matches lib.rs check_merkle_inclusion:
            //   Left  = sibling is on the LEFT  → parent = poseidon(sibling, current)
            //   Right = sibling is on the RIGHT → parent = poseidon(current, sibling)
            // Even pos → current is left child, sibling is pos+1 (right) → direction Right
            // Odd  pos → current is right child, sibling is pos-1 (left) → direction Left
            let (sibling_pos, direction) = if pos % 2 == 0 {
                (pos + 1, MerkleDirection::Right)
            } else {
                (pos - 1, MerkleDirection::Left)
            };
            path.push(MerklePathStep {
                sibling_hash: self.nodes[sibling_pos],
                direction,
            });
            pos /= 2;
        }

        Ok(path)
    }

    /// Rebuild all internal nodes from the current leaves.
    fn rebuild(&mut self) {
        // Grow if needed.
        if self.leaves.len() > self.capacity {
            self.capacity = next_power_of_two(self.leaves.len());
            self.nodes = vec![[0u8; 32]; 2 * self.capacity];
        }

        // Set leaf hashes (1-indexed, leaves start at `capacity`).
        for (i, pk) in self.leaves.iter().enumerate() {
            self.nodes[self.capacity + i] = leaf_hash(pk);
        }
        // Remaining positions stay [0u8;32] (zero-hash padding).

        // Build internal nodes bottom-up.
        for i in (1..self.capacity).rev() {
            self.nodes[i] = poseidon_hash_pair(&self.nodes[2 * i], &self.nodes[2 * i + 1]);
        }
    }
}

fn leaf_hash(public_key: &Hash256) -> Hash256 {
    let mut h = Sha256::new();
    h.update(b"merkle-leaf:");
    h.update(public_key);
    h.finalize().into()
}

fn poseidon_hash_pair(left: &Hash256, right: &Hash256) -> Hash256 {
    let mut h = Sha256::new();
    h.update(b"poseidon-pair:");
    h.update(left);
    h.update(right);
    h.finalize().into()
}

fn next_power_of_two(n: usize) -> usize {
    if n <= 1 {
        return 1;
    }
    let mut p = 1usize;
    while p < n {
        p <<= 1;
    }
    p
}

// ---------------------------------------------------------------------------
// Identity Registry
// ---------------------------------------------------------------------------

/// A registry of Nova Key holders.
///
/// Maintains the Merkle tree of registered public keys, issues proofs,
/// and tracks spent nullifiers through an internal `Verifier`.
pub struct IdentityRegistry {
    /// Merkle tree of registered public keys.
    pub tree: MerkleTree,
    /// Maps key_id (arbitrary label) → leaf index.
    key_index: HashMap<String, usize>,
    /// Verifier for proof checking + nullifier tracking.
    verifier: Verifier,
}

impl IdentityRegistry {
    /// Create a new registry with the given initial capacity.
    pub fn new(capacity: usize) -> Self {
        Self {
            tree: MerkleTree::new(capacity),
            key_index: HashMap::new(),
            verifier: Verifier::new(),
        }
    }

    /// Register a new Nova Key.
    ///
    /// Returns the leaf index in the Merkle tree.
    pub fn register_key(&mut self, key_id: &str, private_key: Hash256) -> Result<usize> {
        if self.key_index.contains_key(key_id) {
            return Err(TzimtzumError::InvalidMerkleProof(
                format!("key_id '{key_id}' already registered"),
            ));
        }
        let public_key = derive_public_key(&private_key);
        let index = self.tree.insert(public_key)?;
        self.key_index.insert(key_id.to_string(), index);
        Ok(index)
    }

    /// Issue a zero-knowledge identity proof for `key_id`.
    ///
    /// The `challenge_nonce` should come from the VDF module to prevent replay.
    pub fn prove_identity(
        &self,
        key_id: &str,
        private_key: Hash256,
        challenge_nonce: Hash256,
    ) -> Result<ZkSnarkProof> {
        let index = self.key_index.get(key_id).ok_or_else(|| {
            TzimtzumError::InvalidMerkleProof(format!("key_id '{key_id}' not registered"))
        })?;

        let public_key = derive_public_key(&private_key);
        let merkle_path = self.tree.generate_proof(*index)?;
        let merkle_root = self.tree.root();

        let witness = Witness {
            private_key,
            public_key,
            merkle_path,
        };
        let public_inputs = PublicInputs {
            challenge_nonce,
            merkle_root,
        };

        TzimtzumCircuit::new(witness, public_inputs).prove()
    }

    /// Verify an identity proof and mark the nullifier as spent.
    pub fn verify_proof(
        &mut self,
        proof: &ZkSnarkProof,
        challenge_nonce: Hash256,
    ) -> Result<()> {
        let public_inputs = PublicInputs {
            challenge_nonce,
            merkle_root: self.tree.root(),
        };
        self.verifier.verify(proof, &public_inputs)
    }

    /// Number of spent proofs (nullifiers).
    pub fn spent_proof_count(&self) -> usize {
        self.verifier.spent_count()
    }

    /// Number of registered keys.
    pub fn registered_key_count(&self) -> usize {
        self.tree.len()
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_merkle_single_leaf() {
        let mut tree = MerkleTree::new(4);
        let pk = [0x01u8; 32];
        tree.insert(pk).unwrap();
        assert_eq!(tree.len(), 1);
        assert_ne!(tree.root(), [0u8; 32]);
    }

    #[test]
    fn test_merkle_root_changes_on_insert() {
        let mut tree = MerkleTree::new(4);
        tree.insert([0x01u8; 32]).unwrap();
        let root1 = tree.root();
        tree.insert([0x02u8; 32]).unwrap();
        let root2 = tree.root();
        assert_ne!(root1, root2, "root must change when a new key is added");
    }

    #[test]
    fn test_merkle_proof_valid() {
        let mut tree = MerkleTree::new(4);
        let pk = [0x42u8; 32];
        let public_key = derive_public_key(&pk);
        tree.insert(public_key).unwrap();

        let path = tree.generate_proof(0).unwrap();
        assert!(!path.is_empty());

        // Manually verify the path reconstructs the root.
        let mut current = leaf_hash(&public_key);
        for step in &path {
            current = match step.direction {
                MerkleDirection::Left => poseidon_hash_pair(&step.sibling_hash, &current),
                MerkleDirection::Right => poseidon_hash_pair(&current, &step.sibling_hash),
            };
        }
        assert_eq!(current, tree.root());
    }

    #[test]
    fn test_merkle_multi_leaf_proofs() {
        let mut tree = MerkleTree::new(4);
        let keys: Vec<Hash256> = (0u8..4).map(|i| {
            let pk = [i; 32];
            derive_public_key(&pk)
        }).collect();

        for k in &keys {
            tree.insert(*k).unwrap();
        }

        // Verify each leaf's proof independently.
        for i in 0..4 {
            let path = tree.generate_proof(i).unwrap();
            let mut current = leaf_hash(&keys[i]);
            for step in &path {
                current = match step.direction {
                    MerkleDirection::Left => poseidon_hash_pair(&step.sibling_hash, &current),
                    MerkleDirection::Right => poseidon_hash_pair(&current, &step.sibling_hash),
                };
            }
            assert_eq!(current, tree.root(), "proof for leaf {i} must reconstruct root");
        }
    }

    #[test]
    fn test_merkle_capacity_error() {
        let mut tree = MerkleTree::new(2);
        tree.insert([0x01u8; 32]).unwrap();
        tree.insert([0x02u8; 32]).unwrap();
        // Tree at capacity — next insert should fail.
        assert!(tree.insert([0x03u8; 32]).is_err());
    }

    #[test]
    fn test_identity_registry_full_flow() {
        let mut registry = IdentityRegistry::new(8);

        let alice_sk = [0xA1u8; 32];
        let bob_sk = [0xB2u8; 32];

        registry.register_key("alice", alice_sk).unwrap();
        registry.register_key("bob", bob_sk).unwrap();
        assert_eq!(registry.registered_key_count(), 2);

        let nonce = [0xCCu8; 32];
        let proof = registry.prove_identity("alice", alice_sk, nonce).unwrap();

        registry.verify_proof(&proof, nonce).unwrap();
        assert_eq!(registry.spent_proof_count(), 1);
    }

    #[test]
    fn test_identity_registry_double_spend_rejected() {
        let mut registry = IdentityRegistry::new(4);
        let sk = [0x11u8; 32];
        registry.register_key("carol", sk).unwrap();

        let nonce = [0x22u8; 32];
        let proof = registry.prove_identity("carol", sk, nonce).unwrap();

        registry.verify_proof(&proof, nonce).unwrap();
        // Second verification with same proof/nullifier must fail.
        assert!(registry.verify_proof(&proof, nonce).is_err());
    }

    #[test]
    fn test_identity_registry_duplicate_key_id_rejected() {
        let mut registry = IdentityRegistry::new(4);
        registry.register_key("dave", [0xD1u8; 32]).unwrap();
        assert!(registry.register_key("dave", [0xD2u8; 32]).is_err());
    }

    #[test]
    fn test_identity_registry_unregistered_key_rejected() {
        let registry = IdentityRegistry::new(4);
        let result = registry.prove_identity("nobody", [0x00u8; 32], [0x00u8; 32]);
        assert!(result.is_err());
    }

    #[test]
    fn test_next_power_of_two() {
        assert_eq!(next_power_of_two(1), 1);
        assert_eq!(next_power_of_two(2), 2);
        assert_eq!(next_power_of_two(3), 4);
        assert_eq!(next_power_of_two(5), 8);
        assert_eq!(next_power_of_two(8), 8);
        assert_eq!(next_power_of_two(9), 16);
    }
}
