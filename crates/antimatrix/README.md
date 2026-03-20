# antimatrix

**Formal verification hypervisor for AI-generated code — Constitutional Spec-Driven Development.**

Antimatrix is the security enforcement layer of the DreamNova stack. Every AI output, code mutation, and network message is validated against a **constitutional specification** before being committed. Violations automatically escalate isolation until the system is safe.

> Comparable: Shape Security ($1B) — applied to AI runtime safety.

## Six isolation levels

| Level | Name | Triggered by |
|-------|------|-------------|
| 0 | **Standard** | All checks pass — normal operation |
| 1 | **Probation** | Minor violation — extra audit logging |
| 2 | **Severed** | Moderate violation — network access revoked |
| 3 | **Offline** | Serious violation — all I/O suspended |
| 4 | **Decapitation** | Critical violation — execution halted, core dumped |
| 5 | **Immolation** | Catastrophic — full state wipe + re-attestation |

## Constitutional rules (SEC-NOVA)

| Rule | Description | Severity |
|------|-------------|----------|
| **SEC-NOVA-001** | No private key may appear in any output (PEM pattern scan) | Decapitation |
| **SEC-NOVA-002** | All AI outputs must be deterministically reproducible (hash check) | Probation |
| **SEC-NOVA-003** | Memory allocations must be bounded — 64 MiB max | Severed |
| **SEC-NOVA-004** | Nullifier reuse is forbidden (double-spend prevention) | Decapitation |
| **SEC-NOVA-005** | No shell injection patterns (backticks, `$(...)`, `\| bash`, `; rm`) | Decapitation |
| **SEC-NOVA-006** | No API tokens / bearer credentials (`sk_live_`, `ghp_`, `AKIA`, JWT) | Decapitation |

## Quick start

```rust
use antimatrix::{Hypervisor, IsolationLevel};

let mut hypervisor = Hypervisor::new();

// Submit AI-generated output for constitutional verification
let content = b"fn compute() -> u64 { 42 }";
hypervisor.submit(content).expect("constitutional check failed");

// The hypervisor stays at Standard if all rules pass
assert_eq!(hypervisor.isolation_level(), IsolationLevel::Standard);
```

## Detecting private key leaks (SEC-NOVA-001)

```rust
use antimatrix::Hypervisor;

let mut hypervisor = Hypervisor::new();

// This would trigger SEC-NOVA-001 and escalate isolation
let leaked = b"PRIVATE KEY: 0xdeadbeef...";
let result = hypervisor.submit(leaked);
assert!(result.is_err()); // SecurityViolation returned
```

## Determinism enforcement (SEC-NOVA-002)

```rust
use antimatrix::Hypervisor;

let mut hypervisor = Hypervisor::new();
let content = b"deterministic output";

// First submission establishes the hash baseline
hypervisor.submit(content).unwrap();

// Identical content passes — same hash
hypervisor.submit(content).unwrap();

// Different content would fail SEC-NOVA-002
```

## Architecture

```
AI output / code mutation
         │
         ▼
┌─────────────────────┐
│  Constitutional      │   SEC-NOVA-001: key leak scan
│  Verifier            │   SEC-NOVA-002: determinism hash
│  (stateless rules)   │   SEC-NOVA-003: allocation bounds
│                      │   SEC-NOVA-005: shell injection scan
│                      │   SEC-NOVA-006: API token scan
└──────────┬──────────┘
           │ violation?
           ▼
┌─────────────────────┐
│  Hypervisor          │   tracks isolation level
│  (stateful)          │   escalates on repeat violations
└──────────┬──────────┘
           │
           ▼
   Standard → Probation → Severed → Offline → Decapitation → Immolation
```

## Status

| Component | Status |
|-----------|--------|
| 6 isolation levels | ✅ Implemented |
| SEC-NOVA-001 (key leak) | ✅ Implemented |
| SEC-NOVA-002 (determinism) | ✅ Implemented |
| SEC-NOVA-003 (memory bounds) | ✅ Implemented |
| SEC-NOVA-004 (nullifier reuse) | ✅ Implemented |
| SEC-NOVA-005 (shell injection) | ✅ Implemented |
| SEC-NOVA-006 (API tokens) | ✅ Implemented |
| Halo2 ZKP attestation | 🔜 Planned (ties to `tzimtzum`) |

## Research context

Antimatrix is part of the DreamNova post-quantum AI infrastructure:

- **EVOLUTRIX** — Polymorphic compiler (MTD, DSLR, ISR)
- **TZIMTZUM** — ZK-SNARK identity verification
- **DAG-LEDGER** — DAG ledger with VDF temporal barriers
- **ASL** — Sparse tensor routing (75% VRAM reduction)

## License

Licensed under either [MIT](LICENSE-MIT) or [Apache 2.0](LICENSE-APACHE) at your option.

## Patent

USPTO Provisional Patent Application filed March 2026.
*"Constitutional Specification-Driven Formal Verification System for AI Runtime Safety"*
