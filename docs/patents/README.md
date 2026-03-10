# DreamNova V5 -- Patent Strategy

## Overview

DreamNova's intellectual property centers on three novel claims at the intersection of cryptography, adversarial machine learning, and NFC identity systems. The filing strategy targets both USPTO (US patent) and PCT (international protection) paths.

## Core Claims

### Claim 1: Entropy-Derivative Anomaly Detection via Graph Neural Networks

**Title:** System and Method for Real-Time Anomaly Detection Using Shannon Entropy Time-Derivatives and Graph Neural Network Topology Scoring

**Abstract:** A method for detecting adversarial state manipulation in computational systems by monitoring the time derivative of Shannon entropy over system memory state vectors. A Graph Neural Network treats memory regions as graph nodes and data flow paths as edges, learning to score topology changes that indicate unauthorized state transitions. The system achieves sub-100ms detection latency on consumer hardware via 4-bit quantized inference on Apple Metal GPU.

**Novel elements:**
- Entropy derivative as a universal, domain-agnostic anomaly signal
- GNN-based topology scoring without requiring labeled anomaly training data
- 4-bit quantized inference for memory-constrained edge deployment
- Integration with a polymorphic runtime (Evolutrix) for correlated defense

**Prior art gap:** Existing entropy-based IDS systems use static entropy thresholds on network packets. No published work combines entropy time-derivatives with GNN topology scoring for memory-level anomaly detection.

### Claim 2: Polymorphic Compilation with Deterministic Semantic Preservation

**Title:** Method for Deterministic Polymorphic Binary Generation with Semantic Lattice Rewriting and Instruction Set Randomization

**Abstract:** A compilation method that produces semantically identical but structurally unique binaries on each compilation cycle. The method applies three mutation passes -- AST-level structural randomization, instruction set randomization (ISR) at the intermediate representation level, and dynamic semantic lattice rewriting (DSLR) -- while maintaining deterministic reproducibility through a seeded PRNG. The resulting Moving Target Defense makes static binary analysis computationally infeasible for adversaries.

**Novel elements:**
- Three-pass mutation pipeline (AST + ISR + DSLR) applied at compile time
- Deterministic reproducibility despite polymorphism (seeded PRNG)
- Integration with entropy monitoring for polymorphism-aware anomaly baselines
- Rust MIR-level ISR (no prior art at this IR level)

**Prior art gap:** Existing MTD systems operate at the binary or OS level. No published work applies deterministic polymorphic mutation at the Rust MIR intermediate representation level with semantic lattice rewriting.

### Claim 3: Zero-Knowledge NFC Identity Verification

**Title:** System for Privacy-Preserving NFC Card Authentication Using Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge

**Abstract:** An NFC card authentication system where card ownership is verified using a zk-SNARK proof. The card holder generates a proof that they possess the card's secret key without revealing it. The proof is verified server-side, granting access to gated content without storing or transmitting the card's private identity. The circuit uses Plonkish arithmetization (Halo2) optimized for the NTAG 215 NFC chip's constraint set.

**Novel elements:**
- zk-SNARK proof generation for NFC NTAG 215 card authentication
- Client-side proof generation via Web NFC API + WASM verifier
- Plonkish circuit optimized for NFC payload constraints (< 888 bytes)
- Integration with on-chain identity layer (dag-ledger)

**Prior art gap:** Existing NFC authentication uses challenge-response or PKI. No published system uses zk-SNARKs for NFC card identity verification with client-side proof generation.

## Filing Strategy

### Phase 1: Provisional Patents (USPTO)

| Claim | Filing Target | Estimated Cost |
|-------|--------------|----------------|
| Claim 1 (Entropy/GNN) | Q2 2026 | $2,500 |
| Claim 2 (Polymorphic) | Q2 2026 | $2,500 |
| Claim 3 (ZK NFC) | Q3 2026 | $2,500 |

Provisional patents secure priority date for 12 months at lower cost. This allows continued development while protection begins.

### Phase 2: Non-Provisional + PCT

| Action | Timeline | Estimated Cost |
|--------|----------|----------------|
| Convert provisionals to non-provisional | Q2 2027 | $8,000/each |
| PCT international filing | Q2 2027 | $4,000/each |
| National phase entry (IL, EU, US, JP) | Q4 2028 | $5,000/jurisdiction |

### Phase 3: Continuation Patents

File continuation patents for derivative innovations discovered during development:
- Entropy-aware auto-scaling
- Cross-chain ZK NFC bridging
- Polymorphic API gateway

## Timeline

```
2026 Q2  Provisional filing: Claims 1 + 2
2026 Q3  Provisional filing: Claim 3
2026 Q4  Prior art search validation
2027 Q1  Patent attorney review + claims refinement
2027 Q2  Non-provisional conversion + PCT filing
2027 Q4  USPTO examination begins
2028 Q2  Respond to office actions
2028 Q4  National phase entry (target jurisdictions)
2029+    Patent grants (estimated 18-36 months from filing)
```

## Defensive Publications

To prevent competitors from patenting obvious extensions, publish defensive disclosures for:
- Entropy monitoring applied to smart contract execution
- Polymorphic compilation for WebAssembly targets
- Multi-card ZK proof aggregation

## Legal Notes

- All code in this repository is trade secret until patent filing
- Contributors must sign IP assignment agreements
- Patent counsel: TBD (budget: $25K-40K total for 3 claims through PCT)
