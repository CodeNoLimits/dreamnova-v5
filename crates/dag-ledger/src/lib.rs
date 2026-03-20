//! # DAG Ledger — DAG-UTXO with Proof-of-Shareholding
//!
//! This crate implements Dream Nova's ledger as a Directed Acyclic Graph
//! of UTXO transactions, secured by Proof-of-Shareholding (PoSH) consensus
//! and VDF-based temporal barriers.
//!
//! ## Architecture
//!
//! ```text
//!  ┌─────────┐      ┌─────────┐      ┌─────────┐
//!  │ Genesis  │─────▶│  Tx A   │─────▶│  Tx C   │
//!  └─────────┘      └─────────┘      └─────────┘
//!        │                                 ▲
//!        │          ┌─────────┐            │
//!        └─────────▶│  Tx B   │────────────┘
//!                   └─────────┘
//! ```
//!
//! Unlike a blockchain's linear chain, the DAG allows concurrent
//! transactions to be confirmed in parallel.  Ordering is established
//! by the **Biggest Ledger Coverage Rule**: the valid ledger is the one
//! that covers the most cumulative stake weight.
//!
//! ## Proof-of-Shareholding (PoSH)
//!
//! Each validator stakes Nova Tokens.  Their "share" weight determines
//! vote power.  Unlike Proof-of-Stake, PoSH requires validators to
//! also contribute VDF proofs, binding consensus to real-time delay.

use petgraph::graph::{DiGraph, NodeIndex};
use petgraph::Direction;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{HashMap, HashSet};

pub use vdf::{VdfChallenge, VdfProof};

pub mod network;
pub use network::{
    CheckpointRecord, GossipMessage, PoShVote, PeerAddr, PeerId,
    decode_json, encode_json,
};

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

#[derive(Debug, thiserror::Error)]
pub enum LedgerError {
    #[error("double spend detected: UTXO {0} already consumed")]
    DoubleSpend(String),

    #[error("insufficient balance: need {need}, have {have}")]
    InsufficientBalance { need: u64, have: u64 },

    #[error("invalid transaction hash")]
    InvalidHash,

    #[error("unknown parent: {0}")]
    UnknownParent(String),

    #[error("DAG cycle detected")]
    CycleDetected,

    #[error("validator not registered: {0}")]
    UnknownValidator(String),

    #[error("VDF proof required for epoch transition")]
    VdfRequired,
}

pub type Result<T> = std::result::Result<T, LedgerError>;

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

/// A 32-byte transaction/node hash.
pub type TxHash = [u8; 32];

/// A single unspent transaction output.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Utxo {
    /// Unique identifier (hash of creating tx + output index).
    pub id: TxHash,
    /// Owner's public key hash.
    pub owner: TxHash,
    /// Amount in the smallest unit.
    pub amount: u64,
    /// Whether this UTXO has been consumed.
    pub spent: bool,
}

/// An input to a transaction (references a UTXO to consume).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TxInput {
    /// The UTXO being spent.
    pub utxo_id: TxHash,
    /// Signature (simplified as a hash for the prototype).
    pub signature: TxHash,
}

/// An output of a transaction (creates a new UTXO).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TxOutput {
    /// Recipient's public key hash.
    pub recipient: TxHash,
    /// Amount.
    pub amount: u64,
}

/// A transaction in the DAG.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    /// The hash of this transaction.
    pub hash: TxHash,
    /// Parent transaction hashes in the DAG (1 or 2 parents typically).
    pub parents: Vec<TxHash>,
    /// Inputs (UTXOs consumed).
    pub inputs: Vec<TxInput>,
    /// Outputs (UTXOs created).
    pub outputs: Vec<TxOutput>,
    /// Timestamp (Unix seconds).
    pub timestamp: u64,
    /// The epoch this transaction belongs to.
    pub epoch: u64,
}

impl Transaction {
    /// Compute the hash of a transaction from its contents.
    pub fn compute_hash(
        parents: &[TxHash],
        inputs: &[TxInput],
        outputs: &[TxOutput],
        timestamp: u64,
    ) -> TxHash {
        let mut hasher = Sha256::new();
        hasher.update(b"nova-tx:");
        for p in parents {
            hasher.update(p);
        }
        for inp in inputs {
            hasher.update(inp.utxo_id);
        }
        for out in outputs {
            hasher.update(out.recipient);
            hasher.update(out.amount.to_le_bytes());
        }
        hasher.update(timestamp.to_le_bytes());
        hasher.finalize().into()
    }

    /// Verify the hash is correct.
    pub fn verify_hash(&self) -> bool {
        let computed =
            Self::compute_hash(&self.parents, &self.inputs, &self.outputs, self.timestamp);
        computed == self.hash
    }
}

// ---------------------------------------------------------------------------
// DAG Node — wrapper for the graph
// ---------------------------------------------------------------------------

/// A node in the DAG graph, wrapping a `Transaction`.
#[derive(Debug, Clone)]
pub struct DagNode {
    pub transaction: Transaction,
    /// Cumulative weight (used for the Biggest Ledger Coverage Rule).
    pub cumulative_weight: u64,
    /// Whether this node has been confirmed.
    pub confirmed: bool,
}

// ---------------------------------------------------------------------------
// Proof-of-Shareholding Validator
// ---------------------------------------------------------------------------

/// A validator participating in PoSH consensus.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Validator {
    /// Public key hash.
    pub id: TxHash,
    /// Amount of Nova Tokens staked.
    pub stake: u64,
    /// Whether the validator has submitted a VDF proof for the current epoch.
    pub vdf_submitted: bool,
}

/// The PoSH validator set and consensus logic.
pub struct PoShValidator {
    validators: HashMap<TxHash, Validator>,
    /// Total stake across all validators.
    total_stake: u64,
    /// Current epoch.
    pub current_epoch: u64,
}

impl PoShValidator {
    pub fn new() -> Self {
        Self {
            validators: HashMap::new(),
            total_stake: 0,
            current_epoch: 0,
        }
    }

    /// Register a validator with a given stake.
    pub fn register(&mut self, id: TxHash, stake: u64) {
        self.total_stake += stake;
        self.validators.insert(
            id,
            Validator {
                id,
                stake,
                vdf_submitted: false,
            },
        );
    }

    /// Mark a validator as having submitted a VDF proof (simulation — no cryptographic check).
    ///
    /// Use [`submit_vdf_proof_verified`] in production to enforce the Wesolowski proof.
    pub fn submit_vdf_proof(&mut self, validator_id: &TxHash) -> Result<()> {
        let v = self
            .validators
            .get_mut(validator_id)
            .ok_or_else(|| LedgerError::UnknownValidator(hex_encode(validator_id)))?;
        v.vdf_submitted = true;
        Ok(())
    }

    /// Submit and cryptographically verify a Wesolowski VDF proof.
    ///
    /// The `challenge` encodes the epoch seed + time parameter `T`.
    /// The `proof` must satisfy `pi^l * x^r == y (mod N)` per the Wesolowski
    /// construction.  Only on valid proof is `vdf_submitted` set to `true`.
    ///
    /// This is the production path; tests may use [`submit_vdf_proof`].
    pub fn submit_vdf_proof_verified(
        &mut self,
        validator_id: &TxHash,
        challenge: &VdfChallenge,
        proof: &VdfProof,
    ) -> Result<()> {
        // Validate the validator exists first.
        if !self.validators.contains_key(validator_id) {
            return Err(LedgerError::UnknownValidator(hex_encode(validator_id)));
        }

        // Cryptographic VDF verification (Wesolowski).
        vdf::verify(challenge, proof).map_err(|_e| {
            LedgerError::InvalidHash // reuse generic error; VDF error detail in logs
        })?;

        self.validators
            .get_mut(validator_id)
            .unwrap()
            .vdf_submitted = true;

        Ok(())
    }

    /// Compute the voting weight of a validator (stake / total_stake).
    pub fn weight(&self, validator_id: &TxHash) -> f64 {
        if self.total_stake == 0 {
            return 0.0;
        }
        self.validators
            .get(validator_id)
            .map(|v| v.stake as f64 / self.total_stake as f64)
            .unwrap_or(0.0)
    }

    /// Check if enough stake has submitted VDF proofs to advance the epoch.
    /// Requires >2/3 of stake weight.
    pub fn can_advance_epoch(&self) -> bool {
        if self.total_stake == 0 {
            return false;
        }
        let vdf_stake: u64 = self
            .validators
            .values()
            .filter(|v| v.vdf_submitted)
            .map(|v| v.stake)
            .sum();
        vdf_stake * 3 > self.total_stake * 2
    }

    /// Advance to the next epoch (resets VDF flags).
    pub fn advance_epoch(&mut self) -> Result<()> {
        if !self.can_advance_epoch() {
            return Err(LedgerError::VdfRequired);
        }
        self.current_epoch += 1;
        for v in self.validators.values_mut() {
            v.vdf_submitted = false;
        }
        Ok(())
    }

    /// Number of registered validators.
    pub fn validator_count(&self) -> usize {
        self.validators.len()
    }
}

impl Default for PoShValidator {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// StableDag — the full DAG ledger
// ---------------------------------------------------------------------------

/// The StableDag is the main data structure: a DAG of transactions with
/// UTXO tracking and PoSH consensus.
pub struct StableDag {
    /// The underlying directed graph.
    pub graph: DiGraph<DagNode, ()>,
    /// Map from transaction hash to graph node index.
    pub index: HashMap<TxHash, NodeIndex>,
    /// The UTXO set (unspent outputs).
    pub utxo_set: HashMap<TxHash, Utxo>,
    /// Set of spent UTXO IDs (for double-spend detection).
    spent: HashSet<TxHash>,
    /// PoSH consensus engine.
    pub consensus: PoShValidator,
}

impl StableDag {
    /// Create a new empty DAG.
    pub fn new() -> Self {
        Self {
            graph: DiGraph::new(),
            index: HashMap::new(),
            utxo_set: HashMap::new(),
            spent: HashSet::new(),
            consensus: PoShValidator::new(),
        }
    }

    /// Create the genesis transaction.
    pub fn create_genesis(&mut self, initial_supply: u64, recipient: TxHash) -> TxHash {
        let output = TxOutput {
            recipient,
            amount: initial_supply,
        };
        let hash = Transaction::compute_hash(&[], &[], &[output.clone()], 0);

        let tx = Transaction {
            hash,
            parents: Vec::new(),
            inputs: Vec::new(),
            outputs: vec![output],
            timestamp: 0,
            epoch: 0,
        };

        // Create the genesis UTXO.
        let utxo_id = Self::utxo_id(&hash, 0);
        self.utxo_set.insert(
            utxo_id,
            Utxo {
                id: utxo_id,
                owner: recipient,
                amount: initial_supply,
                spent: false,
            },
        );

        let node = DagNode {
            transaction: tx,
            cumulative_weight: initial_supply,
            confirmed: true,
        };

        let idx = self.graph.add_node(node);
        self.index.insert(hash, idx);
        hash
    }

    /// Add a transaction to the DAG.
    pub fn add_transaction(
        &mut self,
        parents: Vec<TxHash>,
        inputs: Vec<TxInput>,
        outputs: Vec<TxOutput>,
        timestamp: u64,
    ) -> Result<TxHash> {
        // Validate parents exist.
        for parent in &parents {
            if !self.index.contains_key(parent) {
                return Err(LedgerError::UnknownParent(hex_encode(parent)));
            }
        }

        // Check for double-spends.
        let mut total_input = 0u64;
        for input in &inputs {
            if self.spent.contains(&input.utxo_id) {
                return Err(LedgerError::DoubleSpend(hex_encode(&input.utxo_id)));
            }
            let utxo = self
                .utxo_set
                .get(&input.utxo_id)
                .ok_or_else(|| LedgerError::DoubleSpend(hex_encode(&input.utxo_id)))?;
            total_input += utxo.amount;
        }

        // Check balance.
        let total_output: u64 = outputs.iter().map(|o| o.amount).sum();
        if total_output > total_input {
            return Err(LedgerError::InsufficientBalance {
                need: total_output,
                have: total_input,
            });
        }

        // Compute hash.
        let hash = Transaction::compute_hash(&parents, &inputs, &outputs, timestamp);

        let tx = Transaction {
            hash,
            parents: parents.clone(),
            inputs: inputs.clone(),
            outputs: outputs.clone(),
            timestamp,
            epoch: self.consensus.current_epoch,
        };

        // Verify hash.
        if !tx.verify_hash() {
            return Err(LedgerError::InvalidHash);
        }

        // Mark inputs as spent.
        for input in &inputs {
            self.spent.insert(input.utxo_id);
            if let Some(utxo) = self.utxo_set.get_mut(&input.utxo_id) {
                utxo.spent = true;
            }
        }

        // Create new UTXOs.
        for (i, output) in outputs.iter().enumerate() {
            let utxo_id = Self::utxo_id(&hash, i);
            self.utxo_set.insert(
                utxo_id,
                Utxo {
                    id: utxo_id,
                    owner: output.recipient,
                    amount: output.amount,
                    spent: false,
                },
            );
        }

        // Compute cumulative weight (sum of parent weights + own output value).
        let parent_weight: u64 = parents
            .iter()
            .filter_map(|p| self.index.get(p))
            .filter_map(|idx| self.graph.node_weight(*idx))
            .map(|n| n.cumulative_weight)
            .sum();

        let node = DagNode {
            transaction: tx,
            cumulative_weight: parent_weight + total_output,
            confirmed: false,
        };

        let idx = self.graph.add_node(node);

        // Add edges from parents to this node.
        for parent_hash in &parents {
            if let Some(&parent_idx) = self.index.get(parent_hash) {
                self.graph.add_edge(parent_idx, idx, ());
            }
        }

        self.index.insert(hash, idx);
        Ok(hash)
    }

    /// Get the tips of the DAG (nodes with no children).
    pub fn tips(&self) -> Vec<TxHash> {
        self.graph
            .node_indices()
            .filter(|&idx| {
                self.graph
                    .neighbors_directed(idx, Direction::Outgoing)
                    .next()
                    .is_none()
            })
            .filter_map(|idx| self.graph.node_weight(idx))
            .map(|n| n.transaction.hash)
            .collect()
    }

    /// Get the balance of an address (sum of unspent UTXOs).
    pub fn balance_of(&self, owner: &TxHash) -> u64 {
        self.utxo_set
            .values()
            .filter(|u| !u.spent && u.owner == *owner)
            .map(|u| u.amount)
            .sum()
    }

    /// Total number of transactions in the DAG.
    pub fn transaction_count(&self) -> usize {
        self.graph.node_count()
    }

    /// Number of unspent UTXOs.
    pub fn utxo_count(&self) -> usize {
        self.utxo_set.values().filter(|u| !u.spent).count()
    }

    /// Compute a UTXO identifier from a transaction hash and output index.
    fn utxo_id(tx_hash: &TxHash, output_index: usize) -> TxHash {
        let mut hasher = Sha256::new();
        hasher.update(b"utxo:");
        hasher.update(tx_hash);
        hasher.update(output_index.to_le_bytes());
        hasher.finalize().into()
    }

    /// Find the "heaviest" tip (Biggest Ledger Coverage Rule).
    pub fn heaviest_tip(&self) -> Option<TxHash> {
        self.graph
            .node_indices()
            .filter(|&idx| {
                self.graph
                    .neighbors_directed(idx, Direction::Outgoing)
                    .next()
                    .is_none()
            })
            .filter_map(|idx| self.graph.node_weight(idx))
            .max_by_key(|n| n.cumulative_weight)
            .map(|n| n.transaction.hash)
    }

    /// Get a transaction by hash.
    pub fn get_transaction(&self, hash: &TxHash) -> Option<&Transaction> {
        self.index
            .get(hash)
            .and_then(|idx| self.graph.node_weight(*idx))
            .map(|n| &n.transaction)
    }
}

impl Default for StableDag {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn hex_encode(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

/// Create a simple deterministic "address" from a name (for testing).
pub fn test_address(name: &str) -> TxHash {
    let hash: [u8; 32] = Sha256::digest(name.as_bytes()).into();
    hash
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_genesis() {
        let mut dag = StableDag::new();
        let alice = test_address("alice");
        let genesis = dag.create_genesis(1_000_000, alice);
        assert_eq!(dag.transaction_count(), 1);
        assert_eq!(dag.balance_of(&alice), 1_000_000);
        assert_eq!(dag.tips(), vec![genesis]);
    }

    #[test]
    fn test_simple_transfer() {
        let mut dag = StableDag::new();
        let alice = test_address("alice");
        let bob = test_address("bob");

        let genesis = dag.create_genesis(1000, alice);

        // Find Alice's UTXO.
        let alice_utxo: TxHash = dag
            .utxo_set
            .values()
            .find(|u| u.owner == alice && !u.spent)
            .unwrap()
            .id;

        // Alice sends 300 to Bob, 700 change back.
        let sig = [0u8; 32]; // Simplified signature.
        let tx = dag
            .add_transaction(
                vec![genesis],
                vec![TxInput {
                    utxo_id: alice_utxo,
                    signature: sig,
                }],
                vec![
                    TxOutput {
                        recipient: bob,
                        amount: 300,
                    },
                    TxOutput {
                        recipient: alice,
                        amount: 700,
                    },
                ],
                1,
            )
            .unwrap();

        assert_eq!(dag.transaction_count(), 2);
        assert_eq!(dag.balance_of(&alice), 700);
        assert_eq!(dag.balance_of(&bob), 300);
        assert_eq!(dag.tips(), vec![tx]);
    }

    #[test]
    fn test_double_spend_rejected() {
        let mut dag = StableDag::new();
        let alice = test_address("alice");
        let bob = test_address("bob");

        let genesis = dag.create_genesis(1000, alice);

        let alice_utxo: TxHash = dag
            .utxo_set
            .values()
            .find(|u| u.owner == alice && !u.spent)
            .unwrap()
            .id;

        let sig = [0u8; 32];
        let _tx1 = dag
            .add_transaction(
                vec![genesis],
                vec![TxInput {
                    utxo_id: alice_utxo,
                    signature: sig,
                }],
                vec![TxOutput {
                    recipient: bob,
                    amount: 1000,
                }],
                1,
            )
            .unwrap();

        // Try to spend the same UTXO again.
        let result = dag.add_transaction(
            vec![genesis],
            vec![TxInput {
                utxo_id: alice_utxo,
                signature: sig,
            }],
            vec![TxOutput {
                recipient: bob,
                amount: 1000,
            }],
            2,
        );
        assert!(result.is_err());
    }

    #[test]
    fn test_insufficient_balance() {
        let mut dag = StableDag::new();
        let alice = test_address("alice");
        let bob = test_address("bob");

        let genesis = dag.create_genesis(100, alice);

        let alice_utxo: TxHash = dag
            .utxo_set
            .values()
            .find(|u| u.owner == alice && !u.spent)
            .unwrap()
            .id;

        let sig = [0u8; 32];
        let result = dag.add_transaction(
            vec![genesis],
            vec![TxInput {
                utxo_id: alice_utxo,
                signature: sig,
            }],
            vec![TxOutput {
                recipient: bob,
                amount: 999,
            }],
            1,
        );
        assert!(result.is_err());
    }

    #[test]
    fn test_concurrent_txs_in_dag() {
        let mut dag = StableDag::new();
        let alice = test_address("alice");
        let bob = test_address("bob");
        let carol = test_address("carol");

        let genesis = dag.create_genesis(1000, alice);

        let alice_utxo: TxHash = dag
            .utxo_set
            .values()
            .find(|u| u.owner == alice && !u.spent)
            .unwrap()
            .id;

        let sig = [0u8; 32];
        // Alice splits into two outputs.
        let split = dag
            .add_transaction(
                vec![genesis],
                vec![TxInput {
                    utxo_id: alice_utxo,
                    signature: sig,
                }],
                vec![
                    TxOutput {
                        recipient: alice,
                        amount: 500,
                    },
                    TxOutput {
                        recipient: alice,
                        amount: 500,
                    },
                ],
                1,
            )
            .unwrap();

        // Now two concurrent transactions spending different UTXOs.
        let utxos: Vec<TxHash> = dag
            .utxo_set
            .values()
            .filter(|u| u.owner == alice && !u.spent)
            .map(|u| u.id)
            .collect();

        assert_eq!(utxos.len(), 2);

        let _tx_bob = dag
            .add_transaction(
                vec![split],
                vec![TxInput {
                    utxo_id: utxos[0],
                    signature: sig,
                }],
                vec![TxOutput {
                    recipient: bob,
                    amount: 500,
                }],
                2,
            )
            .unwrap();

        let _tx_carol = dag
            .add_transaction(
                vec![split],
                vec![TxInput {
                    utxo_id: utxos[1],
                    signature: sig,
                }],
                vec![TxOutput {
                    recipient: carol,
                    amount: 500,
                }],
                2,
            )
            .unwrap();

        assert_eq!(dag.transaction_count(), 4);
        assert_eq!(dag.balance_of(&bob), 500);
        assert_eq!(dag.balance_of(&carol), 500);
        assert_eq!(dag.balance_of(&alice), 0);
        assert_eq!(dag.tips().len(), 2); // Two concurrent tips.
    }

    #[test]
    fn test_heaviest_tip() {
        let mut dag = StableDag::new();
        let alice = test_address("alice");
        let genesis = dag.create_genesis(1000, alice);
        let tip = dag.heaviest_tip();
        assert_eq!(tip, Some(genesis));
    }

    #[test]
    fn test_posh_consensus() {
        let mut posh = PoShValidator::new();
        let v1 = test_address("validator1");
        let v2 = test_address("validator2");
        let v3 = test_address("validator3");

        posh.register(v1, 100);
        posh.register(v2, 100);
        posh.register(v3, 100);
        assert_eq!(posh.validator_count(), 3);

        // Not enough VDF proofs yet.
        assert!(!posh.can_advance_epoch());

        // Two out of three (66.67%) — just barely not enough (need >66.67%).
        posh.submit_vdf_proof(&v1).unwrap();
        posh.submit_vdf_proof(&v2).unwrap();
        assert!(!posh.can_advance_epoch()); // 200/300 = 66.67% — not > 2/3

        // Third makes it 100%.
        posh.submit_vdf_proof(&v3).unwrap();
        assert!(posh.can_advance_epoch());
        posh.advance_epoch().unwrap();
        assert_eq!(posh.current_epoch, 1);
    }

    #[test]
    fn test_posh_weight() {
        let mut posh = PoShValidator::new();
        let v1 = test_address("rich");
        let v2 = test_address("poor");
        posh.register(v1, 900);
        posh.register(v2, 100);

        let w1 = posh.weight(&v1);
        let w2 = posh.weight(&v2);
        assert!((w1 - 0.9).abs() < 0.001);
        assert!((w2 - 0.1).abs() < 0.001);
    }

    // --- VDF verified submission tests ---

    fn test_vdf_modulus() -> num_bigint::BigUint {
        // Small RSA-style modulus for tests (not cryptographically secure).
        // N = 17 * 19 = 323.
        num_bigint::BigUint::from(323u32)
    }

    #[test]
    fn test_submit_vdf_proof_verified_accepts_valid_proof() {
        use vdf::{evaluate, prove, VdfChallenge};

        let modulus = test_vdf_modulus();
        let challenge = VdfChallenge::from_bytes(b"epoch-0-seed", 10, &modulus).unwrap();
        let y = evaluate(&challenge).unwrap();
        let proof = prove(&challenge, &y).unwrap();

        let mut posh = PoShValidator::new();
        let v1 = test_address("vdf-validator");
        posh.register(v1, 100);

        posh.submit_vdf_proof_verified(&v1, &challenge, &proof).unwrap();
        assert!(posh.can_advance_epoch()); // 100% stake = epoch can advance
    }

    #[test]
    fn test_submit_vdf_proof_verified_rejects_bad_proof() {
        use num_bigint::BigUint;
        use vdf::{VdfChallenge, VdfProof};

        let modulus = test_vdf_modulus();
        let challenge = VdfChallenge::from_bytes(b"epoch-0-seed", 10, &modulus).unwrap();

        // Fabricate a clearly wrong proof.
        let bad_proof = VdfProof {
            y: BigUint::from(99u32),
            pi: BigUint::from(1u32),
            l: BigUint::from(3u32),
        };

        let mut posh = PoShValidator::new();
        let v1 = test_address("vdf-validator-bad");
        posh.register(v1, 100);

        let result = posh.submit_vdf_proof_verified(&v1, &challenge, &bad_proof);
        assert!(result.is_err(), "bad VDF proof must be rejected");
        assert!(!posh.can_advance_epoch()); // flag not set
    }

    #[test]
    fn test_submit_vdf_proof_verified_unknown_validator() {
        use vdf::{evaluate, prove, VdfChallenge};

        let modulus = test_vdf_modulus();
        let challenge = VdfChallenge::from_bytes(b"seed", 5, &modulus).unwrap();
        let y = evaluate(&challenge).unwrap();
        let proof = prove(&challenge, &y).unwrap();

        let mut posh = PoShValidator::new();
        // Do NOT register the validator.
        let ghost = test_address("ghost");

        let result = posh.submit_vdf_proof_verified(&ghost, &challenge, &proof);
        assert!(result.is_err());
    }
}
