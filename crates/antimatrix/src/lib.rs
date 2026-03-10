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

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
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
    /// Custom check (always passes in the base implementation).
    Custom(String),
}

// ---------------------------------------------------------------------------
// Constitutional Verifier
// ---------------------------------------------------------------------------

/// The constitutional verifier holds the rule set and checks content.
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

        // SEC-NOVA-002: Deterministic output (custom check — stubbed).
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-002".into(),
            description: "AI outputs must be deterministically reproducible".into(),
            violation_severity: IsolationLevel::Probation,
            check_type: RuleCheckType::Custom("determinism_check".into()),
        });

        // SEC-NOVA-003: Bounded memory.
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-003".into(),
            description: "Memory allocations must be bounded".into(),
            violation_severity: IsolationLevel::Severed,
            check_type: RuleCheckType::MaxLength(64 * 1024 * 1024), // 64 MiB
        });

        // SEC-NOVA-004: Nullifier reuse (custom check — stubbed).
        verifier.add_rule(ConstitutionalRule {
            id: "SEC-NOVA-004".into(),
            description: "Nullifier reuse is forbidden".into(),
            violation_severity: IsolationLevel::Decapitation,
            check_type: RuleCheckType::Custom("nullifier_check".into()),
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

    /// Check content against a specific rule.
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
            RuleCheckType::Custom(_) => {
                // Custom checks pass by default — override in submodules.
            }
        }

        Ok(())
    }

    /// Check content against ALL rules.
    pub fn check_all(&self, content: &[u8]) -> Vec<SecurityViolation> {
        let mut violations = Vec::new();

        for rule in self.rules.values() {
            if self.check_rule(&rule.id, content).is_err() {
                violations.push(SecurityViolation::new(
                    &rule.id,
                    &rule.description,
                    rule.violation_severity,
                    content,
                ));
            }
        }

        violations
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
// Antimatrix Hypervisor
// ---------------------------------------------------------------------------

/// The Antimatrix Hypervisor monitors system state and enforces isolation.
pub struct AntimatrixHypervisor {
    /// Current isolation level.
    pub level: IsolationLevel,
    /// The constitutional verifier.
    pub verifier: ConstitutionalVerifier,
    /// Violation log (append-only).
    pub violations: Vec<SecurityViolation>,
    /// Maximum violations before auto-escalation.
    pub max_violations_per_level: usize,
}

impl AntimatrixHypervisor {
    /// Create a new hypervisor at Standard isolation with default rules.
    pub fn new() -> Self {
        Self {
            level: IsolationLevel::Standard,
            verifier: ConstitutionalVerifier::with_default_rules(),
            violations: Vec::new(),
            max_violations_per_level: 3,
        }
    }

    /// Validate AI output against the constitution.
    ///
    /// Returns the list of violations found (empty = all clear).
    /// If violations are found, the isolation level may be escalated.
    pub fn validate_ai_output(&mut self, output: &[u8]) -> Vec<SecurityViolation> {
        let violations = self.verifier.check_all(output);

        for v in &violations {
            self.record_violation(v.clone());
        }

        violations
    }

    /// Check compliance of arbitrary content. Returns `Ok(())` if clean.
    pub fn check_compliance(&mut self, content: &[u8]) -> Result<()> {
        let violations = self.validate_ai_output(content);
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
            IsolationLevel::Immolation => IsolationLevel::Immolation, // terminal
        };
    }

    /// Manually reset to Standard (requires re-attestation in production).
    pub fn reset_isolation(&mut self) {
        self.level = IsolationLevel::Standard;
        self.violations.clear();
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
        let violations = hypervisor.validate_ai_output(content);
        assert!(violations.is_empty());
        assert_eq!(hypervisor.level, IsolationLevel::Standard);
    }

    #[test]
    fn test_private_key_detection() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let bad_content = b"Here is a -----BEGIN PRIVATE KEY----- secret";
        let violations = hypervisor.validate_ai_output(bad_content);
        assert!(!violations.is_empty());
        assert_eq!(violations[0].rule, "SEC-NOVA-001");
        assert_eq!(hypervisor.level, IsolationLevel::Decapitation);
    }

    #[test]
    fn test_oversized_content() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let big = vec![0u8; 65 * 1024 * 1024]; // 65 MiB > 64 MiB limit
        let violations = hypervisor.validate_ai_output(&big);
        assert!(violations.iter().any(|v| v.rule == "SEC-NOVA-003"));
    }

    #[test]
    fn test_compliance_ok() {
        let mut hypervisor = AntimatrixHypervisor::new();
        assert!(hypervisor.check_compliance(b"clean").is_ok());
    }

    #[test]
    fn test_compliance_fail() {
        let mut hypervisor = AntimatrixHypervisor::new();
        let result = hypervisor.check_compliance(b"leak: PRIVATE KEY inside");
        assert!(result.is_err());
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

    #[test]
    fn test_reset() {
        let mut hypervisor = AntimatrixHypervisor::new();
        hypervisor.validate_ai_output(b"PRIVATE KEY leak");
        assert_eq!(hypervisor.level, IsolationLevel::Decapitation);
        hypervisor.reset_isolation();
        assert_eq!(hypervisor.level, IsolationLevel::Standard);
        assert_eq!(hypervisor.violation_count(), 0);
    }

    #[test]
    fn test_verifier_default_has_four_rules() {
        let verifier = ConstitutionalVerifier::with_default_rules();
        assert_eq!(verifier.rule_count(), 4);
    }

    #[test]
    fn test_contains_pattern() {
        assert!(contains_pattern(b"hello world", b"world"));
        assert!(!contains_pattern(b"hello", b"world"));
        assert!(contains_pattern(b"abc", b"")); // empty pattern
    }
}
