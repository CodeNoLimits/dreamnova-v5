//! # Nova-Morph — Arena Allocation Engine
//!
//! Nova-Morph provides an arena-based memory allocator optimised for AST
//! manipulation during polymorphic compilation.
//!
//! ## Design rationale
//!
//! Traditional AST implementations use `Box<Node>` or `Rc<Node>`, incurring
//! per-node heap allocations and reference-counting overhead.  Nova-Morph
//! instead allocates all AST nodes within a **bump arena** (via `bumpalo`),
//! giving:
//!
//! - **O(1) allocation** — a pointer bump, no free-list traversal.
//! - **O(1) bulk deallocation** — drop the arena, release everything at once.
//! - **Cache locality** — nodes allocated close together in time are close
//!   together in memory.
//! - **Zero-copy integration** — references into the arena are ordinary `&`
//!   borrows, avoiding clone storms.
//!
//! The `WasmMemoryPool` abstraction layers the arena for future WebAssembly
//! targets where linear memory management is explicit.

use bumpalo::collections::Vec as BumpVec;
use bumpalo::Bump;
use std::cell::Cell;
use std::fmt;

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

#[derive(Debug, thiserror::Error)]
pub enum NovaMorphError {
    #[error("arena capacity exhausted ({0} bytes requested)")]
    CapacityExhausted(usize),

    #[error("node not found: id {0}")]
    NodeNotFound(u64),
}

pub type Result<T> = std::result::Result<T, NovaMorphError>;

// ---------------------------------------------------------------------------
// AST node types (arena-allocated)
// ---------------------------------------------------------------------------

/// The kind of an arena-allocated AST node.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum NodeKind {
    Function,
    Variable,
    Literal,
    BinaryOp,
    Return,
    Block,
    /// Semantically neutral filler injected by the MTD engine.
    Junk,
}

/// An AST node living inside a `bumpalo` arena.
///
/// Children are stored as a bump-allocated slice of references, avoiding
/// individual heap allocations.
pub struct AstNode<'arena> {
    pub id: u64,
    pub kind: NodeKind,
    pub children: BumpVec<'arena, &'arena AstNode<'arena>>,
    /// Optional payload (e.g., variable name or literal value).
    pub payload: Option<&'arena str>,
}

impl<'arena> AstNode<'arena> {
    /// Number of direct children.
    pub fn child_count(&self) -> usize {
        self.children.len()
    }

    /// Recursively count all descendants (including self).
    pub fn subtree_size(&self) -> usize {
        1 + self
            .children
            .iter()
            .map(|c| c.subtree_size())
            .sum::<usize>()
    }
}

impl fmt::Debug for AstNode<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("AstNode")
            .field("id", &self.id)
            .field("kind", &self.kind)
            .field("children", &self.children.len())
            .field("payload", &self.payload)
            .finish()
    }
}

// ---------------------------------------------------------------------------
// Arena wrapper
// ---------------------------------------------------------------------------

/// A managed arena for AST node allocation.
///
/// Wraps `bumpalo::Bump` with an auto-incrementing node ID counter.
pub struct Arena {
    bump: Bump,
    next_id: Cell<u64>,
}

impl Arena {
    /// Create a new arena with default capacity.
    pub fn new() -> Self {
        Self {
            bump: Bump::new(),
            next_id: Cell::new(0),
        }
    }

    /// Create an arena pre-sized for approximately `capacity` bytes.
    pub fn with_capacity(capacity: usize) -> Self {
        Self {
            bump: Bump::with_capacity(capacity),
            next_id: Cell::new(0),
        }
    }

    /// Allocate a new AST node in the arena.
    pub fn alloc_node<'arena>(
        &'arena self,
        kind: NodeKind,
        payload: Option<&str>,
    ) -> &'arena AstNode<'arena> {
        let id = self.next_id.get();
        self.next_id.set(id + 1);

        let payload_str = payload.map(|s| &*self.bump.alloc_str(s));

        self.bump.alloc(AstNode {
            id,
            kind,
            children: BumpVec::new_in(&self.bump),
            payload: payload_str,
        })
    }

    /// Allocate a node and immediately attach it as a child of `parent`.
    ///
    /// This requires a mutable reference to the parent, which is obtained
    /// via `alloc_node_mut`.
    pub fn alloc_child<'arena>(
        &'arena self,
        parent: &mut AstNode<'arena>,
        kind: NodeKind,
        payload: Option<&str>,
    ) -> &'arena AstNode<'arena> {
        let child = self.alloc_node(kind, payload);
        parent.children.push(child);
        child
    }

    /// Allocate a mutable AST node.
    pub fn alloc_node_mut<'arena>(
        &'arena self,
        kind: NodeKind,
        payload: Option<&str>,
    ) -> &'arena mut AstNode<'arena> {
        let id = self.next_id.get();
        self.next_id.set(id + 1);

        let payload_str = payload.map(|s| &*self.bump.alloc_str(s));

        self.bump.alloc(AstNode {
            id,
            kind,
            children: BumpVec::new_in(&self.bump),
            payload: payload_str,
        })
    }

    /// Number of nodes allocated so far.
    pub fn node_count(&self) -> u64 {
        self.next_id.get()
    }

    /// Total bytes allocated in the arena (including internal fragmentation).
    pub fn allocated_bytes(&self) -> usize {
        self.bump.allocated_bytes()
    }

    /// Reset the arena, releasing all memory.
    ///
    /// After this call every reference obtained from the arena is
    /// invalidated (Rust's borrow checker prevents use-after-free).
    pub fn reset(&mut self) {
        self.bump.reset();
        self.next_id.set(0);
    }
}

impl Default for Arena {
    fn default() -> Self {
        Self::new()
    }
}

impl fmt::Debug for Arena {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Arena")
            .field("node_count", &self.node_count())
            .field("allocated_bytes", &self.allocated_bytes())
            .finish()
    }
}

// ---------------------------------------------------------------------------
// WasmMemoryPool — abstraction for linear memory targets
// ---------------------------------------------------------------------------

/// A memory pool designed for WebAssembly linear memory.
///
/// In WASM, memory grows in 64 KiB pages and cannot be freed individually.
/// `WasmMemoryPool` tracks logical allocations within a bump arena and
/// exposes page-level statistics useful for the WASM runtime.
pub struct WasmMemoryPool {
    /// Underlying arena.
    arena: Arena,
    /// Number of logical allocations (not bytes).
    allocation_count: usize,
    /// WASM page size (64 KiB).
    page_size: usize,
}

impl WasmMemoryPool {
    /// WASM page size: 65536 bytes.
    pub const WASM_PAGE_SIZE: usize = 65536;

    /// Create a new pool with an initial page count.
    pub fn new(initial_pages: usize) -> Self {
        let capacity = initial_pages * Self::WASM_PAGE_SIZE;
        Self {
            arena: Arena::with_capacity(capacity),
            allocation_count: 0,
            page_size: Self::WASM_PAGE_SIZE,
        }
    }

    /// Allocate a node in the WASM memory pool.
    pub fn alloc_node<'a>(
        &'a mut self,
        kind: NodeKind,
        payload: Option<&str>,
    ) -> &'a AstNode<'a> {
        self.allocation_count += 1;
        self.arena.alloc_node(kind, payload)
    }

    /// Number of WASM pages currently in use.
    pub fn pages_used(&self) -> usize {
        (self.arena.allocated_bytes() + self.page_size - 1) / self.page_size
    }

    /// Total logical allocations.
    pub fn allocation_count(&self) -> usize {
        self.allocation_count
    }

    /// Reset the pool, releasing all allocations.
    pub fn reset(&mut self) {
        self.arena.reset();
        self.allocation_count = 0;
    }
}

impl fmt::Debug for WasmMemoryPool {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("WasmMemoryPool")
            .field("pages_used", &self.pages_used())
            .field("allocations", &self.allocation_count)
            .field("bytes", &self.arena.allocated_bytes())
            .finish()
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_arena_alloc() {
        let arena = Arena::new();
        let node = arena.alloc_node(NodeKind::Function, Some("main"));
        assert_eq!(node.id, 0);
        assert_eq!(node.kind, NodeKind::Function);
        assert_eq!(node.payload, Some("main"));
        assert_eq!(arena.node_count(), 1);
    }

    #[test]
    fn test_arena_multiple_nodes() {
        let arena = Arena::new();
        let _a = arena.alloc_node(NodeKind::Function, Some("foo"));
        let _b = arena.alloc_node(NodeKind::Variable, Some("x"));
        let _c = arena.alloc_node(NodeKind::Literal, Some("42"));
        assert_eq!(arena.node_count(), 3);
    }

    #[test]
    fn test_parent_child() {
        let arena = Arena::new();
        let parent = arena.alloc_node_mut(NodeKind::Block, None);
        let _child = arena.alloc_child(parent, NodeKind::Literal, Some("7"));
        assert_eq!(parent.child_count(), 1);
        assert_eq!(parent.subtree_size(), 2);
    }

    #[test]
    fn test_deep_tree() {
        let arena = Arena::new();
        let root = arena.alloc_node_mut(NodeKind::Function, Some("deep"));
        for i in 0..100 {
            let name_str: &str = arena.bump.alloc_str(&format!("var_{i}"));
            let child = arena.alloc_node(NodeKind::Variable, Some(name_str));
            root.children.push(child);
        }
        assert_eq!(root.subtree_size(), 101);
        assert_eq!(arena.node_count(), 101);
    }

    #[test]
    fn test_arena_reset() {
        let mut arena = Arena::new();
        let _a = arena.alloc_node(NodeKind::Junk, None);
        let _b = arena.alloc_node(NodeKind::Junk, None);
        assert_eq!(arena.node_count(), 2);
        arena.reset();
        assert_eq!(arena.node_count(), 0);
    }

    #[test]
    fn test_wasm_pool() {
        let mut pool = WasmMemoryPool::new(1);
        let _node = pool.alloc_node(NodeKind::Function, Some("entry"));
        assert_eq!(pool.allocation_count(), 1);
        // Bumpalo may pre-allocate beyond one page; just verify we have at least one.
        assert!(pool.pages_used() >= 1);
    }

    #[test]
    fn test_wasm_pool_reset() {
        let mut pool = WasmMemoryPool::new(2);
        let _a = pool.alloc_node(NodeKind::Literal, Some("1"));
        let _b = pool.alloc_node(NodeKind::Literal, Some("2"));
        assert_eq!(pool.allocation_count(), 2);
        pool.reset();
        assert_eq!(pool.allocation_count(), 0);
    }
}
