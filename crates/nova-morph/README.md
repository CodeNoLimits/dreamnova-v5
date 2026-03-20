# nova-morph

**O(1) arena allocator for AST nodes using [bumpalo](https://crates.io/crates/bumpalo).**

Nova-Morph provides a managed arena for allocating and manipulating Abstract Syntax Tree nodes with:

- **O(1) allocation** -- pointer bump, no free-list traversal
- **O(1) bulk deallocation** -- drop the arena, release everything at once
- **Cache locality** -- nodes allocated close together in time live close together in memory
- **Zero-copy integration** -- references into the arena are ordinary `&` borrows, no clone storms

## Quick start

```rust
use nova_morph::{Arena, NodeKind};

let arena = Arena::new();

// Allocate nodes
let root = arena.alloc_node_mut(NodeKind::Function, Some("main"));
arena.alloc_child(root, NodeKind::Variable, Some("x"));
arena.alloc_child(root, NodeKind::Literal, Some("42"));

assert_eq!(root.subtree_size(), 3);
assert_eq!(arena.node_count(), 3);
```

## Arena with pre-allocated capacity

```rust
use nova_morph::Arena;

// Pre-allocate 1 MB for heavy AST workloads
let arena = Arena::with_capacity(1024 * 1024);
```

## WebAssembly memory pool

For WASM targets where memory grows in 64 KiB pages:

```rust
use nova_morph::{WasmMemoryPool, NodeKind};

let mut pool = WasmMemoryPool::new(4); // 4 WASM pages = 256 KiB
let node = pool.alloc_node(NodeKind::Function, Some("entry"));

println!("Pages used: {}", pool.pages_used());
println!("Allocations: {}", pool.allocation_count());
```

## Node kinds

| Kind | Description |
|------|-------------|
| `Function` | Function declaration |
| `Variable` | Variable reference |
| `Literal` | Literal value |
| `BinaryOp` | Binary operation |
| `Return` | Return statement |
| `Block` | Block scope |
| `Junk` | Semantically neutral filler (for polymorphic transformation) |

## Why not just `Box<Node>`?

Traditional AST implementations allocate each node individually on the heap. With thousands of nodes in a typical compilation unit, this leads to:

1. **Allocation overhead** -- each `Box::new` hits the global allocator
2. **Cache misses** -- nodes scattered across the heap
3. **Slow cleanup** -- each node must be individually freed (recursive `Drop`)

Nova-Morph solves all three: one arena, one pointer bump per node, one bulk free at the end.

## Minimum Rust version

1.85 (edition 2024)

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT License ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option.
