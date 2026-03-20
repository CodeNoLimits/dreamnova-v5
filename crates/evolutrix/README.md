# evolutrix

**Polymorphic compiler core — Moving Target Defense for binary executables.**

Evolutrix implements DreamNova's Moving Target Defense (MTD) strategy: the same source code produces a **structurally unique binary on every compilation**, making reverse engineering economically infeasible.

> Comparable: Shape Security ($1B acquisition) — for compilers.

## How it works

Three complementary mechanisms produce binary uniqueness:

| Mechanism | What it does |
|-----------|-------------|
| **DSLR** — Data Structure Layout Randomization | Shuffles struct field ordering and injects padding to defeat memory layout attacks |
| **ISR** — Instruction Set Randomization | Encrypts generated instruction streams with rolling AES-256 keys |
| **Junk Node Injection** | Inserts semantically neutral AST subtrees to confuse decompilers |

Every output binary is functionally identical to the source but structurally unique — verified by SHA-256 hashing of each output artifact.

## Quick start

```rust
use evolutrix::{Compiler, AstNode, NodeKind};

let mut compiler = Compiler::new();

// Build an AST
let root = compiler.ast.add_node(AstNode {
    kind: NodeKind::Function,
    name: "main".to_string(),
    value: None,
    children: vec![],
});

// Compile — produces a unique binary descriptor each time
let output = compiler.compile()?;

println!("Binary hash: {}", output.hash);
println!("Unique: {} (changes every compilation)", output.unique);
assert!(output.verified); // semantic equivalence confirmed
```

## Architecture

```
Source AST
    │
    ├── DSLR (field randomization)
    ├── ISR  (instruction encryption, AES-256)
    └── Junk injection
    │
    ▼
Unique Binary Descriptor
    │
    └── SHA-256 hash (differs per compilation)
```

## Status

| Component | Status |
|-----------|--------|
| DSLR | ✅ Implemented |
| ISR (AES-256) | ✅ Implemented |
| Junk injection | ✅ Implemented |
| x86 codegen | 🔧 Toy opcodes (8 instructions) |
| LLVM backend | 🔜 Planned |
| ARM backend | 🔜 Planned |

**Current**: Architecture validated, toy x86 codegen. LLVM backend is the next milestone for real-program compilation.

## Research context

Evolutrix is part of the DreamNova post-quantum AI infrastructure portfolio:

- **ASL** — Sparse tensor routing (75% VRAM reduction)
- **TZIMTZUM** — ZK-SNARK identity verification
- **DAG-LEDGER** — Decentralized ledger with VDF barriers
- **ANTIMATRIX** — Formal verification hypervisor for AI

## License

Licensed under either [MIT](LICENSE-MIT) or [Apache 2.0](LICENSE-APACHE) at your option.

## Patent

USPTO Provisional Patent Application filed March 2026.
*"System and Method for Generating Functionally Equivalent but Structurally Unique Binary Executables"*
