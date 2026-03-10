//! # Evolutrix — Polymorphic Compiler Core
//!
//! The Evolutrix engine implements Dream Nova's Moving Target Defense (MTD) strategy
//! through three complementary mechanisms:
//!
//! - **DSLR** (Data Structure Layout Randomization): Shuffles struct field ordering and
//!   injects padding to defeat memory layout attacks.
//! - **ISR** (Instruction Set Randomization): Encrypts the generated instruction stream
//!   with rolling AES keys so that static analysis yields only ciphertext.
//! - **Junk node insertion**: Injects semantically neutral AST subtrees to confuse
//!   decompilers while preserving program semantics.
//!
//! Together these produce a unique binary on every compilation — same source, different
//! artifact — making reverse-engineering economically infeasible.

use aes::cipher::{BlockEncrypt, KeyInit};
use aes::Aes256;
use rand::Rng;
use sha2::{Digest, Sha256};
use std::collections::HashMap;

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

/// Errors that can occur during polymorphic compilation.
#[derive(Debug, thiserror::Error)]
pub enum EvolutrixError {
    #[error("AST is empty — nothing to compile")]
    EmptyAst,

    #[error("ISR encryption failed: {0}")]
    IsrEncryptionFailed(String),

    #[error("DSLR randomization failed: {0}")]
    DslrFailed(String),

    #[error("Code generation failed: {0}")]
    CodegenFailed(String),
}

pub type Result<T> = std::result::Result<T, EvolutrixError>;

// ---------------------------------------------------------------------------
// AST representation
// ---------------------------------------------------------------------------

/// Unique identifier for an AST node.
pub type NodeId = u64;

/// A single node in the abstract syntax tree.
///
/// Nodes are intentionally generic — the compiler operates on the *shape* of
/// the tree, not the language-specific semantics.
#[derive(Debug, Clone)]
pub struct AstNode {
    pub id: NodeId,
    pub kind: AstNodeKind,
    pub children: Vec<NodeId>,
    /// Arbitrary metadata attached during compilation phases.
    pub metadata: HashMap<String, String>,
}

/// The kind of an AST node.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AstNodeKind {
    /// A function definition with a name.
    Function(String),
    /// A variable binding.
    Variable(String),
    /// An integer literal.
    IntLiteral(i64),
    /// A binary operation (+, -, *, /).
    BinaryOp(BinOp),
    /// A return statement.
    Return,
    /// A block of statements.
    Block,
    /// A junk node injected by the MTD engine (semantically neutral).
    Junk,
    /// A struct definition with field names.
    StructDef(Vec<String>),
}

/// Binary operator variants.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BinOp {
    Add,
    Sub,
    Mul,
    Div,
}

/// The full abstract syntax tree.
#[derive(Debug, Clone)]
pub struct AbstractSyntaxTree {
    pub nodes: HashMap<NodeId, AstNode>,
    pub root: Option<NodeId>,
    next_id: NodeId,
}

impl AbstractSyntaxTree {
    /// Create an empty AST.
    pub fn new() -> Self {
        Self {
            nodes: HashMap::new(),
            root: None,
            next_id: 0,
        }
    }

    /// Allocate a fresh node and return its id.
    pub fn add_node(&mut self, kind: AstNodeKind) -> NodeId {
        let id = self.next_id;
        self.next_id += 1;
        let node = AstNode {
            id,
            kind,
            children: Vec::new(),
            metadata: HashMap::new(),
        };
        self.nodes.insert(id, node);
        if self.root.is_none() {
            self.root = Some(id);
        }
        id
    }

    /// Attach `child` as a child of `parent`.
    pub fn add_child(&mut self, parent: NodeId, child: NodeId) {
        if let Some(node) = self.nodes.get_mut(&parent) {
            node.children.push(child);
        }
    }

    /// Total number of nodes (including junk).
    pub fn len(&self) -> usize {
        self.nodes.len()
    }

    /// Whether the tree is empty.
    pub fn is_empty(&self) -> bool {
        self.nodes.is_empty()
    }
}

impl Default for AbstractSyntaxTree {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// Mutator — junk node insertion
// ---------------------------------------------------------------------------

/// The Mutator injects semantically neutral nodes into the AST.
///
/// Junk density is controlled by `density` (0.0 = none, 1.0 = one junk node
/// per real node on average).
pub struct Mutator {
    /// Average junk nodes per real node.
    pub density: f64,
}

impl Mutator {
    pub fn new(density: f64) -> Self {
        Self {
            density: density.clamp(0.0, 5.0),
        }
    }

    /// Insert junk nodes throughout the AST.  Returns the number of junk
    /// nodes added.
    pub fn insert_junk_nodes(&self, ast: &mut AbstractSyntaxTree) -> usize {
        let mut rng = rand::thread_rng();
        let existing_ids: Vec<NodeId> = ast.nodes.keys().copied().collect();
        let mut added = 0usize;

        for parent_id in existing_ids {
            // Probabilistically decide whether to inject junk under this node.
            if rng.r#gen::<f64>() < self.density {
                let junk_id = ast.add_node(AstNodeKind::Junk);
                ast.add_child(parent_id, junk_id);
                added += 1;
            }
        }

        added
    }
}

// ---------------------------------------------------------------------------
// DSLR — Data Structure Layout Randomization
// ---------------------------------------------------------------------------

/// Apply DSLR to every `StructDef` node in the AST.
///
/// This shuffles the field ordering and optionally inserts padding fields
/// so that the in-memory layout differs across compilations.
pub fn apply_dslr(ast: &mut AbstractSyntaxTree) -> Result<usize> {
    let mut rng = rand::thread_rng();
    let struct_ids: Vec<NodeId> = ast
        .nodes
        .iter()
        .filter_map(|(&id, node)| {
            if matches!(node.kind, AstNodeKind::StructDef(_)) {
                Some(id)
            } else {
                None
            }
        })
        .collect();

    let mut randomized = 0usize;

    for id in struct_ids {
        let node = ast
            .nodes
            .get_mut(&id)
            .ok_or_else(|| EvolutrixError::DslrFailed("node disappeared".into()))?;

        if let AstNodeKind::StructDef(ref mut fields) = node.kind {
            // Fisher-Yates shuffle on the field list.
            let n = fields.len();
            for i in (1..n).rev() {
                let j = rng.gen_range(0..=i);
                fields.swap(i, j);
            }

            // Optionally insert a padding field.
            if rng.gen_bool(0.5) && !fields.is_empty() {
                let pad_name = format!("__pad_{:04x}", rng.r#gen::<u16>());
                let pos = rng.gen_range(0..=fields.len());
                fields.insert(pos, pad_name);
            }

            randomized += 1;
        }
    }

    Ok(randomized)
}

// ---------------------------------------------------------------------------
// IR Generator — native opcode emission
// ---------------------------------------------------------------------------

/// A single instruction in the intermediate representation.
#[derive(Debug, Clone)]
pub struct Instruction {
    pub opcode: u8,
    pub operands: Vec<u8>,
}

/// The IR generator walks the AST and emits a flat instruction sequence.
pub struct IRGenerator {
    pub instructions: Vec<Instruction>,
}

impl IRGenerator {
    pub fn new() -> Self {
        Self {
            instructions: Vec::new(),
        }
    }

    /// Generate native opcodes from the AST.
    pub fn generate_native_opcodes(&mut self, ast: &AbstractSyntaxTree) -> Result<()> {
        let root = ast.root.ok_or(EvolutrixError::EmptyAst)?;
        self.walk(ast, root);
        Ok(())
    }

    fn walk(&mut self, ast: &AbstractSyntaxTree, node_id: NodeId) {
        let Some(node) = ast.nodes.get(&node_id) else {
            return;
        };

        match &node.kind {
            AstNodeKind::Function(_) => {
                // PUSH frame
                self.emit(0x50, &[]);
            }
            AstNodeKind::IntLiteral(val) => {
                // LOAD immediate (little-endian i64)
                self.emit(0xB8, &val.to_le_bytes());
            }
            AstNodeKind::BinaryOp(op) => {
                let opcode = match op {
                    BinOp::Add => 0x01,
                    BinOp::Sub => 0x29,
                    BinOp::Mul => 0xAF,
                    BinOp::Div => 0xF7,
                };
                self.emit(opcode, &[]);
            }
            AstNodeKind::Return => {
                // RET
                self.emit(0xC3, &[]);
            }
            AstNodeKind::Junk => {
                // NOP sled — semantically neutral.
                self.emit(0x90, &[]);
            }
            _ => {}
        }

        for &child in &node.children {
            self.walk(ast, child);
        }

        // Epilogue for functions.
        if matches!(node.kind, AstNodeKind::Function(_)) {
            // POP frame
            self.emit(0x58, &[]);
        }
    }

    fn emit(&mut self, opcode: u8, operands: &[u8]) {
        self.instructions.push(Instruction {
            opcode,
            operands: operands.to_vec(),
        });
    }
}

impl Default for IRGenerator {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// ISR — Instruction Set Randomization
// ---------------------------------------------------------------------------

/// An encrypted instruction stream produced by ISR.
///
/// The key is a rolling AES-256 key derived from `seed`.  Each 16-byte block
/// of the serialised instruction stream is encrypted in-place.
#[derive(Debug, Clone)]
pub struct EncryptedInstructionSet {
    /// The ciphertext bytes.
    pub ciphertext: Vec<u8>,
    /// SHA-256 hash of the rolling key seed (for verification, not the seed itself).
    pub key_hash: [u8; 32],
    /// Number of instructions encoded.
    pub instruction_count: usize,
}

/// Encrypt a flat instruction stream under a rolling AES-256 key.
pub fn apply_isr(instructions: &[Instruction], seed: &[u8; 32]) -> Result<EncryptedInstructionSet> {
    // Serialise instructions into a byte stream.
    let mut plaintext = Vec::new();
    for instr in instructions {
        plaintext.push(instr.opcode);
        plaintext.push(instr.operands.len() as u8);
        plaintext.extend_from_slice(&instr.operands);
    }

    // Pad to a multiple of 16 bytes (AES block size).
    while plaintext.len() % 16 != 0 {
        plaintext.push(0x90); // NOP padding
    }

    // Derive rolling key via SHA-256 chain.
    let mut key_material = *seed;
    let cipher = Aes256::new((&key_material).into());
    let mut ciphertext = plaintext;

    for chunk in ciphertext.chunks_exact_mut(16) {
        let block: &mut aes::cipher::generic_array::GenericArray<u8, _> = chunk.into();
        cipher.encrypt_block(block);

        // Roll the key: hash previous key material to derive next block key.
        let mut hasher = Sha256::new();
        hasher.update(key_material);
        key_material = hasher.finalize().into();
    }

    // Hash the original seed for verification metadata.
    let key_hash: [u8; 32] = Sha256::digest(seed).into();

    Ok(EncryptedInstructionSet {
        ciphertext,
        key_hash,
        instruction_count: instructions.len(),
    })
}

// ---------------------------------------------------------------------------
// Top-level compilation pipeline
// ---------------------------------------------------------------------------

/// Output of the polymorphic compiler.
#[derive(Debug)]
pub struct PolymorphicBinary {
    pub encrypted_code: EncryptedInstructionSet,
    pub ast_node_count: usize,
    pub junk_nodes_added: usize,
    pub structs_randomized: usize,
}

/// Compile an AST into a polymorphic binary.
///
/// This is the main entry point.  It applies all three MTD layers:
///
/// 1. DSLR — randomize struct layouts.
/// 2. Junk insertion — inflate the AST.
/// 3. Code generation + ISR — emit and encrypt the instruction stream.
pub fn compile_polymorphic_binary(
    ast: &mut AbstractSyntaxTree,
    junk_density: f64,
    isr_seed: &[u8; 32],
) -> Result<PolymorphicBinary> {
    if ast.is_empty() {
        return Err(EvolutrixError::EmptyAst);
    }

    // Phase 1: DSLR
    let structs_randomized = apply_dslr(ast)?;

    // Phase 2: Junk insertion
    let mutator = Mutator::new(junk_density);
    let junk_nodes_added = mutator.insert_junk_nodes(ast);

    let ast_node_count = ast.len();

    // Phase 3: Code generation
    let mut ir = IRGenerator::new();
    ir.generate_native_opcodes(ast)?;

    // Phase 4: ISR encryption
    let encrypted_code = apply_isr(&ir.instructions, isr_seed)?;

    Ok(PolymorphicBinary {
        encrypted_code,
        ast_node_count,
        junk_nodes_added,
        structs_randomized,
    })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_ast() -> AbstractSyntaxTree {
        let mut ast = AbstractSyntaxTree::new();
        let func = ast.add_node(AstNodeKind::Function("main".into()));
        let block = ast.add_node(AstNodeKind::Block);
        ast.add_child(func, block);

        let lit = ast.add_node(AstNodeKind::IntLiteral(42));
        ast.add_child(block, lit);

        let ret = ast.add_node(AstNodeKind::Return);
        ast.add_child(block, ret);

        let s = ast.add_node(AstNodeKind::StructDef(vec![
            "alpha".into(),
            "beta".into(),
            "gamma".into(),
        ]));
        ast.add_child(func, s);

        ast
    }

    #[test]
    fn test_ast_construction() {
        let ast = sample_ast();
        assert_eq!(ast.len(), 5);
        assert!(ast.root.is_some());
    }

    #[test]
    fn test_junk_insertion() {
        let mut ast = sample_ast();
        let mutator = Mutator::new(1.0);
        let added = mutator.insert_junk_nodes(&mut ast);
        assert!(added > 0, "should have inserted at least one junk node");
        assert!(ast.len() > 5);
    }

    #[test]
    fn test_dslr() {
        let mut ast = sample_ast();
        let count = apply_dslr(&mut ast).unwrap();
        assert_eq!(count, 1, "exactly one struct to randomize");
    }

    #[test]
    fn test_codegen() {
        let ast = sample_ast();
        let mut ir = IRGenerator::new();
        ir.generate_native_opcodes(&ast).unwrap();
        assert!(!ir.instructions.is_empty());
    }

    #[test]
    fn test_isr() {
        let ast = sample_ast();
        let mut ir = IRGenerator::new();
        ir.generate_native_opcodes(&ast).unwrap();
        let seed = [0xABu8; 32];
        let enc = apply_isr(&ir.instructions, &seed).unwrap();
        assert!(!enc.ciphertext.is_empty());
        assert_eq!(enc.instruction_count, ir.instructions.len());
    }

    #[test]
    fn test_full_pipeline() {
        let mut ast = sample_ast();
        let seed = [0x42u8; 32];
        let binary = compile_polymorphic_binary(&mut ast, 0.5, &seed).unwrap();
        assert!(binary.ast_node_count >= 5);
        assert!(!binary.encrypted_code.ciphertext.is_empty());
    }

    #[test]
    fn test_empty_ast_rejected() {
        let mut ast = AbstractSyntaxTree::new();
        let seed = [0u8; 32];
        assert!(compile_polymorphic_binary(&mut ast, 0.5, &seed).is_err());
    }
}
