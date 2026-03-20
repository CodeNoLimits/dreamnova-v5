# dag-ledger

**DAG-UTXO ledger with Proof-of-Shareholding consensus and VDF temporal barriers.**

DAG-Ledger is DreamNova's decentralized transaction layer. Unlike a linear blockchain, it processes concurrent transactions in a Directed Acyclic Graph — ordered by cumulative stake weight via the **Biggest Ledger Coverage Rule**.

> Comparable: Nano / IOTA DAG architecture + Chia VDF temporal proofs.

## Key properties

- **Concurrent confirmation** — parallel transactions settle without waiting for a single chain tip
- **Double-spend prevention** — UTXO model with cryptographic spend tracking
- **VDF temporal barriers** — epoch transitions require a Wesolowski proof, preventing time-bandit attacks
- **P2P gossip protocol** — 11-variant wire format for network propagation

## Architecture

```
  ┌─────────┐      ┌─────────┐      ┌─────────┐
  │ Genesis  │─────▶│  Tx A   │─────▶│  Tx C   │
  └─────────┘      └─────────┘      └─────────┘
        │                                 ▲
        │          ┌─────────┐            │
        └─────────▶│  Tx B   │────────────┘
                   └─────────┘

Ordering: Biggest Ledger Coverage Rule (most cumulative stake weight wins)
```

## Quick start

```rust
use dag_ledger::{DagLedger, Transaction};

let mut ledger = DagLedger::new();

// Submit a transaction (genesis has no parents)
let tx = Transaction {
    sender: [0x01u8; 32],
    receiver: [0x02u8; 32],
    amount: 1_000,
    parents: vec![],
    ..Default::default()
};
ledger.submit(tx).expect("transaction rejected");
```

## Proof-of-Shareholding (PoSH)

Validators stake Nova Tokens. Each epoch transition requires a VDF proof binding consensus to real elapsed time:

```rust
use dag_ledger::{PoShValidator, DagLedger};
use vdf::{VdfChallenge, evaluate, prove};
use num_bigint::BigUint;

let mut ledger = DagLedger::new();
let validator_id = [0xAAu8; 32];

// Register validator with 1000 staked tokens
ledger.posh.register_validator(validator_id, 1_000);

// Generate and verify VDF proof for epoch advancement
let modulus = BigUint::from(323u32);
let challenge = VdfChallenge::from_hash(b"epoch-1", 100, &modulus).unwrap();
let y = evaluate(&challenge).unwrap();
let proof = prove(&challenge, &y).unwrap();

ledger.posh.submit_vdf_proof_verified(&validator_id, &challenge, &proof).unwrap();
```

## P2P gossip protocol

11 message variants for network propagation:

```rust
use dag_ledger::{GossipMessage, encode_json, decode_json};

let msg = GossipMessage::Ping { nonce: 42 };
let bytes = encode_json(&msg).unwrap();
let decoded: GossipMessage = decode_json(&bytes).unwrap();

// Other variants:
// Hello { peer_id, listen_addr, tips, epoch }
// NewTransaction(tx)
// RequestTips / Tips(hashes)
// RequestTransactions(hashes) / TransactionBatch(txs)
// VoteFor(PoShVote) / Checkpoint(record)
// Goodbye { reason }
// Ping / Pong { nonce }
```

## Double-spend prevention

```rust
use dag_ledger::DagLedger;

let mut ledger = DagLedger::new();
// ... add genesis tx ...

// Attempting to spend the same UTXO twice returns DoubleSpend error
let result = ledger.submit(duplicate_tx);
assert!(matches!(result, Err(LedgerError::DoubleSpend(_))));
```

## Status

| Component | Status |
|-----------|--------|
| DAG-UTXO core | ✅ Implemented |
| Double-spend detection | ✅ Implemented |
| PoSH consensus (simulated) | ✅ Implemented |
| VDF epoch barriers (Wesolowski) | ✅ Implemented |
| P2P gossip (11 variants, JSON) | ✅ Implemented |
| libp2p transport | 🔜 Planned |
| Cross-shard atomic swaps | 🔜 Planned |

## Research context

- **VDF** — Temporal barrier primitives (this repo, `../vdf`)
- **TZIMTZUM** — ZKP identity for transaction signers
- **ANTIMATRIX** — Constitutional verifier watching the ledger

## License

Licensed under either [MIT](LICENSE-MIT) or [Apache 2.0](LICENSE-APACHE) at your option.

## Patent

USPTO Provisional Patent Application filed March 2026.
*"DAG-UTXO Ledger with Proof-of-Shareholding and VDF Temporal Barrier Consensus"*
