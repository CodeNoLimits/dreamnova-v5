//! # DAG-Ledger Network Layer — Gossip Protocol Message Types
//!
//! Wire format for peer-to-peer gossip in the Nova DAG network.
//!
//! ## Message Flow
//!
//! ```text
//! Peer A                              Peer B
//!   │                                   │
//!   │── NewTransaction(tx) ────────────▶│  (broadcast on submit)
//!   │                                   │
//!   │── RequestTips ───────────────────▶│  (on connect / sync)
//!   │◀─ Tips(hashes) ──────────────────│
//!   │                                   │
//!   │── RequestTransactions(hashes) ───▶│  (fetch unknowns)
//!   │◀─ TransactionBatch(txs) ─────────│
//!   │                                   │
//!   │── VoteFor(hash, stake, sig) ─────▶│  (PoSH vote)
//!   │◀─ VoteFor(hash, stake, sig) ─────│
//!   │                                   │
//!   │── Checkpoint(cp) ───────────────▶│  (epoch boundary)
//!   │◀─ Checkpoint(cp) ───────────────│
//! ```
//!
//! All messages are serialised with `bincode` (length-prefixed) or `serde_json`
//! depending on the transport.  The enum is `#[non_exhaustive]` so future
//! message types do not break existing nodes (unknown variants are ignored).

use serde::{Deserialize, Serialize};

use crate::{Transaction, TxHash};

// ---------------------------------------------------------------------------
// Peer identity
// ---------------------------------------------------------------------------

/// A peer's network address (host + port, UTF-8).
pub type PeerAddr = String;

/// A peer's public-key hash (used as a stable peer ID).
pub type PeerId = TxHash;

// ---------------------------------------------------------------------------
// PoSH vote
// ---------------------------------------------------------------------------

/// A validator's vote for a particular tip/transaction to become the canonical
/// heaviest-ledger choice.
///
/// In production the `signature` field would be an Ed25519 / BLS signature
/// over `(candidate_hash || epoch || stake_weight)`.  Here it is a SHA-256
/// commitment (simulated).
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct PoShVote {
    /// The validator casting this vote.
    pub voter_id: PeerId,
    /// The candidate transaction / tip being endorsed.
    pub candidate_hash: TxHash,
    /// The epoch this vote belongs to.
    pub epoch: u64,
    /// Declared stake weight of the voter (unverified until full PoSH check).
    pub stake_weight: u64,
    /// Proof-of-identity / stake commitment (signature placeholder).
    pub signature: TxHash,
}

// ---------------------------------------------------------------------------
// Checkpoint
// ---------------------------------------------------------------------------

/// A finality checkpoint: signals that all transactions at or before
/// `tip_hash` are irrevocably confirmed in `epoch`.
///
/// Checkpoints are broadcast when a supermajority of stake weight has voted
/// for the same tip.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CheckpointRecord {
    /// The epoch this checkpoint closes.
    pub epoch: u64,
    /// The canonical tip at checkpoint time.
    pub tip_hash: TxHash,
    /// Cumulative stake weight that endorsed this checkpoint.
    pub total_stake: u64,
    /// Aggregated vote signatures (one per participating validator).
    pub aggregate_signature: Vec<TxHash>,
}

// ---------------------------------------------------------------------------
// Gossip message envelope
// ---------------------------------------------------------------------------

/// Every message sent over the gossip network is one of these variants.
///
/// Framing: `u32` big-endian length prefix → `bincode` payload.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[non_exhaustive]
pub enum GossipMessage {
    // ── Handshake ──────────────────────────────────────────────────────────

    /// Initial greeting: peer announces itself and its current tip set.
    Hello {
        /// The sender's stable peer ID.
        peer_id: PeerId,
        /// Listen address others can dial.
        listen_addr: PeerAddr,
        /// The sender's current best-tip hashes (up to 8).
        tips: Vec<TxHash>,
        /// Current epoch the sender is on.
        epoch: u64,
    },

    // ── Transaction propagation ────────────────────────────────────────────

    /// Broadcast a newly submitted / received transaction to all peers.
    NewTransaction(Transaction),

    /// Ask a peer for its current DAG tip hashes (leaf nodes with no children).
    RequestTips,

    /// Response to `RequestTips`: the sender's current tip set.
    Tips(Vec<TxHash>),

    /// Ask a peer to send the full `Transaction` for each listed hash.
    ///
    /// Used to fetch unknown parents discovered via `Tips` or `NewTransaction`.
    RequestTransactions(Vec<TxHash>),

    /// Response to `RequestTransactions`: the matching transactions.
    ///
    /// Transactions the peer does not have are silently omitted.
    TransactionBatch(Vec<Transaction>),

    // ── PoSH consensus ─────────────────────────────────────────────────────

    /// A validator broadcasts its PoSH vote for a candidate tip.
    VoteFor(PoShVote),

    /// A validator broadcasts an aggregate checkpoint once quorum is reached.
    Checkpoint(CheckpointRecord),

    // ── Peer management ────────────────────────────────────────────────────

    /// Polite shutdown / disconnect signal.
    Goodbye { reason: String },

    /// Keepalive / liveness ping.
    Ping { nonce: u64 },

    /// Pong response to a `Ping`.
    Pong { nonce: u64 },
}

impl GossipMessage {
    /// Human-readable variant tag (useful for logging without full payload).
    pub fn tag(&self) -> &'static str {
        match self {
            GossipMessage::Hello { .. } => "Hello",
            GossipMessage::NewTransaction(_) => "NewTransaction",
            GossipMessage::RequestTips => "RequestTips",
            GossipMessage::Tips(_) => "Tips",
            GossipMessage::RequestTransactions(_) => "RequestTransactions",
            GossipMessage::TransactionBatch(_) => "TransactionBatch",
            GossipMessage::VoteFor(_) => "VoteFor",
            GossipMessage::Checkpoint(_) => "Checkpoint",
            GossipMessage::Goodbye { .. } => "Goodbye",
            GossipMessage::Ping { .. } => "Ping",
            GossipMessage::Pong { .. } => "Pong",
        }
    }

    /// Whether this message type should be re-broadcast to other peers after
    /// receipt (epidemic / gossip flooding).
    pub fn is_gossipable(&self) -> bool {
        matches!(
            self,
            GossipMessage::NewTransaction(_)
                | GossipMessage::VoteFor(_)
                | GossipMessage::Checkpoint(_)
        )
    }
}

// ---------------------------------------------------------------------------
// Message codec helpers
// ---------------------------------------------------------------------------

/// Serialise a `GossipMessage` to JSON bytes (for debugging / REST transport).
pub fn encode_json(msg: &GossipMessage) -> Result<Vec<u8>, serde_json::Error> {
    serde_json::to_vec(msg)
}

/// Deserialise a `GossipMessage` from JSON bytes.
pub fn decode_json(bytes: &[u8]) -> Result<GossipMessage, serde_json::Error> {
    serde_json::from_slice(bytes)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn dummy_hash(b: u8) -> TxHash {
        [b; 32]
    }

    fn dummy_tx() -> Transaction {
        use crate::{TxInput, TxOutput};
        let parents = vec![dummy_hash(0x01)];
        let inputs = vec![TxInput {
            utxo_id: dummy_hash(0x10),
            signature: dummy_hash(0x11),
        }];
        let outputs = vec![TxOutput {
            recipient: dummy_hash(0x20),
            amount: 1_000,
        }];
        let timestamp = 1_700_000_000u64;
        let hash = Transaction::compute_hash(&parents, &inputs, &outputs, timestamp);
        Transaction {
            hash,
            parents,
            inputs,
            outputs,
            timestamp,
            epoch: 1,
        }
    }

    #[test]
    fn test_gossip_message_tag() {
        assert_eq!(GossipMessage::RequestTips.tag(), "RequestTips");
        assert_eq!(GossipMessage::Tips(vec![]).tag(), "Tips");
        assert_eq!(GossipMessage::NewTransaction(dummy_tx()).tag(), "NewTransaction");
    }

    #[test]
    fn test_is_gossipable() {
        assert!(GossipMessage::NewTransaction(dummy_tx()).is_gossipable());
        assert!(!GossipMessage::RequestTips.is_gossipable());
        assert!(!GossipMessage::Ping { nonce: 42 }.is_gossipable());
    }

    #[test]
    fn test_json_roundtrip_request_tips() {
        let msg = GossipMessage::RequestTips;
        let bytes = encode_json(&msg).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        assert_eq!(decoded.tag(), "RequestTips");
    }

    #[test]
    fn test_json_roundtrip_new_transaction() {
        let tx = dummy_tx();
        let msg = GossipMessage::NewTransaction(tx.clone());
        let bytes = encode_json(&msg).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        if let GossipMessage::NewTransaction(decoded_tx) = decoded {
            assert_eq!(decoded_tx.hash, tx.hash);
            assert_eq!(decoded_tx.epoch, 1);
        } else {
            panic!("wrong variant after roundtrip");
        }
    }

    #[test]
    fn test_json_roundtrip_tips() {
        let tips = vec![dummy_hash(0xAA), dummy_hash(0xBB)];
        let msg = GossipMessage::Tips(tips.clone());
        let bytes = encode_json(&msg).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        if let GossipMessage::Tips(decoded_tips) = decoded {
            assert_eq!(decoded_tips, tips);
        } else {
            panic!("wrong variant after roundtrip");
        }
    }

    #[test]
    fn test_json_roundtrip_vote_for() {
        let vote = PoShVote {
            voter_id: dummy_hash(0x01),
            candidate_hash: dummy_hash(0x02),
            epoch: 5,
            stake_weight: 1_000_000,
            signature: dummy_hash(0x03),
        };
        let msg = GossipMessage::VoteFor(vote.clone());
        let bytes = encode_json(&msg).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        if let GossipMessage::VoteFor(decoded_vote) = decoded {
            assert_eq!(decoded_vote, vote);
        } else {
            panic!("wrong variant after roundtrip");
        }
    }

    #[test]
    fn test_json_roundtrip_checkpoint() {
        let cp = CheckpointRecord {
            epoch: 3,
            tip_hash: dummy_hash(0x42),
            total_stake: 5_000_000,
            aggregate_signature: vec![dummy_hash(0xA1), dummy_hash(0xA2)],
        };
        let msg = GossipMessage::Checkpoint(cp.clone());
        let bytes = encode_json(&msg).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        if let GossipMessage::Checkpoint(decoded_cp) = decoded {
            assert_eq!(decoded_cp, cp);
        } else {
            panic!("wrong variant after roundtrip");
        }
    }

    #[test]
    fn test_json_roundtrip_transaction_batch() {
        let txs = vec![dummy_tx(), dummy_tx()];
        let msg = GossipMessage::TransactionBatch(txs.clone());
        let bytes = encode_json(&msg).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        if let GossipMessage::TransactionBatch(decoded_txs) = decoded {
            assert_eq!(decoded_txs.len(), 2);
            assert_eq!(decoded_txs[0].hash, txs[0].hash);
        } else {
            panic!("wrong variant after roundtrip");
        }
    }

    #[test]
    fn test_json_roundtrip_hello() {
        let msg = GossipMessage::Hello {
            peer_id: dummy_hash(0xEE),
            listen_addr: "127.0.0.1:7777".to_string(),
            tips: vec![dummy_hash(0x01)],
            epoch: 7,
        };
        let bytes = encode_json(&msg).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        assert_eq!(decoded.tag(), "Hello");
    }

    #[test]
    fn test_json_roundtrip_ping_pong() {
        let ping = GossipMessage::Ping { nonce: 12345 };
        let bytes = encode_json(&ping).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        if let GossipMessage::Ping { nonce } = decoded {
            assert_eq!(nonce, 12345);
        } else {
            panic!("expected Ping");
        }

        let pong = GossipMessage::Pong { nonce: 12345 };
        let bytes = encode_json(&pong).unwrap();
        let decoded = decode_json(&bytes).unwrap();
        if let GossipMessage::Pong { nonce } = decoded {
            assert_eq!(nonce, 12345);
        } else {
            panic!("expected Pong");
        }
    }
}
