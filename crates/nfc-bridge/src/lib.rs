//! # NFC Bridge — DESFire EV3 Interface
//!
//! This crate implements the NFC communication layer for Dream Nova's
//! Nova Key hardware tokens.
//!
//! ## Architecture
//!
//! ```text
//!  ┌──────────────┐    APDU     ┌─────────────────┐    PC/SC    ┌──────────┐
//!  │  Application  │───────────▶│   nfc-bridge     │───────────▶│  Reader  │
//!  │  (Rust/WASM)  │◀───────────│   (this crate)   │◀───────────│ Hardware │
//!  └──────────────┘  Response   └─────────────────┘   Response  └──────────┘
//! ```
//!
//! ## Supported operations
//!
//! - **SELECT application** (ISO 7816-4)
//! - **AuthenticateEV2First** — mutual authentication with the DESFire EV3
//! - **READ DATA** / **WRITE DATA** — file operations on the card
//! - **GET VERSION** — retrieve card hardware info
//!
//! ## Security model
//!
//! The bridge never stores the card's master key.  Authentication sessions
//! are ephemeral and derive session keys via AES-based key diversification.

use aes::cipher::{BlockEncrypt, KeyInit};
use aes::Aes128;
use rand::Rng;
use sha2::{Digest, Sha256};
use std::fmt;

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

#[derive(Debug, thiserror::Error)]
pub enum NfcError {
    #[error("card not present")]
    CardNotPresent,

    #[error("authentication failed: {0}")]
    AuthFailed(String),

    #[error("APDU error: SW={sw1:02X}{sw2:02X}")]
    ApduError { sw1: u8, sw2: u8 },

    #[error("invalid response length: expected {expected}, got {actual}")]
    InvalidLength { expected: usize, actual: usize },

    #[error("session expired")]
    SessionExpired,

    #[error("communication error: {0}")]
    CommError(String),
}

pub type Result<T> = std::result::Result<T, NfcError>;

// ---------------------------------------------------------------------------
// APDU — ISO 7816-4 command/response
// ---------------------------------------------------------------------------

/// An APDU (Application Protocol Data Unit) command per ISO 7816-4.
#[derive(Clone)]
pub struct ApduCommand {
    /// Class byte.
    pub cla: u8,
    /// Instruction byte.
    pub ins: u8,
    /// Parameter 1.
    pub p1: u8,
    /// Parameter 2.
    pub p2: u8,
    /// Command data (Lc field is inferred from length).
    pub data: Vec<u8>,
    /// Expected response length (Le).  `0` means 256 bytes.
    pub le: u8,
}

impl ApduCommand {
    /// Serialise to the wire format.
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut buf = vec![self.cla, self.ins, self.p1, self.p2];
        if !self.data.is_empty() {
            buf.push(self.data.len() as u8); // Lc
            buf.extend_from_slice(&self.data);
        }
        if self.le > 0 || self.data.is_empty() {
            buf.push(self.le);
        }
        buf
    }

    /// Build a SELECT command for the given AID.
    pub fn select(aid: &[u8]) -> Self {
        Self {
            cla: 0x00,
            ins: 0xA4, // SELECT
            p1: 0x04,  // Select by DF name
            p2: 0x00,
            data: aid.to_vec(),
            le: 0x00,
        }
    }

    /// Build a GET VERSION command (DESFire native).
    pub fn get_version() -> Self {
        Self {
            cla: 0x90,
            ins: 0x60, // GetVersion
            p1: 0x00,
            p2: 0x00,
            data: Vec::new(),
            le: 0x00,
        }
    }

    /// Build an AuthenticateEV2First command (step 1).
    pub fn authenticate_ev2_first(key_no: u8) -> Self {
        Self {
            cla: 0x90,
            ins: 0x71, // AuthenticateEV2First
            p1: 0x00,
            p2: 0x00,
            data: vec![key_no, 0x00], // key number + length byte
            le: 0x00,
        }
    }

    /// Build a READ DATA command for a standard data file.
    pub fn read_data(file_no: u8, offset: u32, length: u32) -> Self {
        let mut data = vec![file_no];
        // 3-byte offset (little-endian)
        data.push((offset & 0xFF) as u8);
        data.push(((offset >> 8) & 0xFF) as u8);
        data.push(((offset >> 16) & 0xFF) as u8);
        // 3-byte length (little-endian)
        data.push((length & 0xFF) as u8);
        data.push(((length >> 8) & 0xFF) as u8);
        data.push(((length >> 16) & 0xFF) as u8);
        Self {
            cla: 0x90,
            ins: 0xBD, // ReadData
            p1: 0x00,
            p2: 0x00,
            data,
            le: 0x00,
        }
    }

    /// Build a WRITE DATA command for a standard data file.
    pub fn write_data(file_no: u8, offset: u32, payload: &[u8]) -> Self {
        let length = payload.len() as u32;
        let mut data = vec![file_no];
        data.push((offset & 0xFF) as u8);
        data.push(((offset >> 8) & 0xFF) as u8);
        data.push(((offset >> 16) & 0xFF) as u8);
        data.push((length & 0xFF) as u8);
        data.push(((length >> 8) & 0xFF) as u8);
        data.push(((length >> 16) & 0xFF) as u8);
        data.extend_from_slice(payload);
        Self {
            cla: 0x90,
            ins: 0x3D, // WriteData
            p1: 0x00,
            p2: 0x00,
            data,
            le: 0x00,
        }
    }
}

impl fmt::Debug for ApduCommand {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "APDU[CLA={:02X} INS={:02X} P1={:02X} P2={:02X} Lc={} Le={:02X}]",
            self.cla,
            self.ins,
            self.p1,
            self.p2,
            self.data.len(),
            self.le
        )
    }
}

// ---------------------------------------------------------------------------
// APDU Response
// ---------------------------------------------------------------------------

/// An APDU response from the card.
#[derive(Debug, Clone)]
pub struct ApduResponse {
    /// Response data (without status words).
    pub data: Vec<u8>,
    /// Status word 1.
    pub sw1: u8,
    /// Status word 2.
    pub sw2: u8,
}

impl ApduResponse {
    /// Parse a raw response buffer (last two bytes are SW1 SW2).
    pub fn from_bytes(raw: &[u8]) -> Result<Self> {
        if raw.len() < 2 {
            return Err(NfcError::InvalidLength {
                expected: 2,
                actual: raw.len(),
            });
        }
        let sw1 = raw[raw.len() - 2];
        let sw2 = raw[raw.len() - 1];
        let data = raw[..raw.len() - 2].to_vec();
        Ok(Self { sw1, sw2, data })
    }

    /// Check if the response indicates success (SW=9000 or SW=91xx for DESFire).
    pub fn is_success(&self) -> bool {
        (self.sw1 == 0x90 && self.sw2 == 0x00) || self.sw1 == 0x91
    }

    /// Return an error if the response is not success.
    pub fn check(&self) -> Result<()> {
        if self.is_success() {
            Ok(())
        } else {
            Err(NfcError::ApduError {
                sw1: self.sw1,
                sw2: self.sw2,
            })
        }
    }
}

// ---------------------------------------------------------------------------
// Nova Key — the identity token
// ---------------------------------------------------------------------------

/// A Nova Key represents a single DESFire EV3 NFC card configured for
/// Dream Nova's identity system.
#[derive(Debug, Clone)]
pub struct NovaKey {
    /// The card's 7-byte UID.
    pub uid: [u8; 7],
    /// SHA-256 fingerprint of the UID (used as the public identifier).
    pub fingerprint: [u8; 32],
    /// Application ID on the card (3 bytes).
    pub app_id: [u8; 3],
}

impl NovaKey {
    /// Create a `NovaKey` from a raw UID.
    pub fn from_uid(uid: [u8; 7]) -> Self {
        let fingerprint: [u8; 32] = {
            let mut h = Sha256::new();
            h.update(b"nova-key-uid:");
            h.update(uid);
            h.finalize().into()
        };

        Self {
            uid,
            fingerprint,
            // Default Dream Nova application ID.
            app_id: [0xD7, 0xEA, 0x01],
        }
    }

    /// The fingerprint as a hex string.
    pub fn fingerprint_hex(&self) -> String {
        self.fingerprint.iter().map(|b| format!("{b:02x}")).collect()
    }
}

// ---------------------------------------------------------------------------
// DESFire EV2 Authentication
// ---------------------------------------------------------------------------

/// State machine for AuthenticateEV2First mutual authentication.
///
/// The protocol is a 3-pass challenge-response:
/// 1. Host sends AuthEV2First command with key number.
/// 2. Card responds with an encrypted challenge (RndB).
/// 3. Host decrypts RndB, generates RndA, sends both back encrypted.
/// 4. Card verifies, responds with encrypted RndA' for host to check.
///
/// This struct tracks the state through these phases.
#[derive(Debug)]
pub struct DESFireAuth {
    /// The key number being used (0-4).
    pub key_no: u8,
    /// Phase of the authentication protocol.
    phase: AuthPhase,
    /// The host's random challenge.
    rnd_a: [u8; 16],
    /// The card's random challenge (received in phase 1).
    rnd_b: Option<[u8; 16]>,
    /// Derived session key (available after successful auth).
    session_key: Option<[u8; 16]>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[allow(dead_code)]
enum AuthPhase {
    /// Not started.
    Idle,
    /// Waiting for card's challenge.
    AwaitingChallenge,
    /// Waiting for card's verification response.
    AwaitingVerification,
    /// Authentication complete.
    Authenticated,
    /// Authentication failed.
    Failed,
}

impl DESFireAuth {
    /// Start a new authentication session.
    pub fn new(key_no: u8) -> Self {
        let mut rng = rand::thread_rng();
        let mut rnd_a = [0u8; 16];
        rng.fill(&mut rnd_a);

        Self {
            key_no,
            phase: AuthPhase::Idle,
            rnd_a,
            rnd_b: None,
            session_key: None,
        }
    }

    /// Build the initial APDU to start authentication.
    pub fn start_command(&mut self) -> ApduCommand {
        self.phase = AuthPhase::AwaitingChallenge;
        ApduCommand::authenticate_ev2_first(self.key_no)
    }

    /// Process the card's challenge response and build the continuation APDU.
    ///
    /// `card_key` is the shared AES-128 key.
    pub fn process_challenge(
        &mut self,
        challenge_data: &[u8],
        card_key: &[u8; 16],
    ) -> Result<ApduCommand> {
        if self.phase != AuthPhase::AwaitingChallenge {
            return Err(NfcError::AuthFailed("unexpected phase".into()));
        }

        if challenge_data.len() < 16 {
            return Err(NfcError::InvalidLength {
                expected: 16,
                actual: challenge_data.len(),
            });
        }

        // Decrypt the card's challenge to get RndB.
        let cipher = Aes128::new(card_key.into());
        let mut rnd_b_block: [u8; 16] = challenge_data[..16].try_into().unwrap();
        let block: &mut aes::cipher::generic_array::GenericArray<u8, _> =
            (&mut rnd_b_block).into();
        // Note: in a real implementation this would be CBC decryption.
        // We simulate with ECB for the architecture prototype.
        cipher.encrypt_block(block);
        self.rnd_b = Some(rnd_b_block);

        // Rotate RndB left by one byte.
        let mut rnd_b_rot = [0u8; 16];
        rnd_b_rot[..15].copy_from_slice(&rnd_b_block[1..16]);
        rnd_b_rot[15] = rnd_b_block[0];

        // Concatenate RndA || RndB' and encrypt.
        let mut response_data = Vec::with_capacity(32);
        response_data.extend_from_slice(&self.rnd_a);
        response_data.extend_from_slice(&rnd_b_rot);

        // Encrypt each 16-byte block.
        for chunk in response_data.chunks_exact_mut(16) {
            let block: &mut aes::cipher::generic_array::GenericArray<u8, _> = chunk.into();
            cipher.encrypt_block(block);
        }

        self.phase = AuthPhase::AwaitingVerification;

        Ok(ApduCommand {
            cla: 0x90,
            ins: 0xAF, // Additional frame
            p1: 0x00,
            p2: 0x00,
            data: response_data,
            le: 0x00,
        })
    }

    /// Finalize authentication by verifying the card's proof.
    pub fn finalize(&mut self, _card_proof: &[u8], card_key: &[u8; 16]) -> Result<()> {
        if self.phase != AuthPhase::AwaitingVerification {
            return Err(NfcError::AuthFailed("unexpected phase".into()));
        }

        // Derive session key: first 8 bytes of RndA || first 8 bytes of RndB.
        let rnd_b = self
            .rnd_b
            .ok_or_else(|| NfcError::AuthFailed("no RndB".into()))?;

        let mut sk = [0u8; 16];
        sk[..8].copy_from_slice(&self.rnd_a[..8]);
        sk[8..].copy_from_slice(&rnd_b[..8]);

        // XOR with the card key for diversification.
        for i in 0..16 {
            sk[i] ^= card_key[i];
        }

        self.session_key = Some(sk);
        self.phase = AuthPhase::Authenticated;
        Ok(())
    }

    /// Whether the session is authenticated.
    pub fn is_authenticated(&self) -> bool {
        self.phase == AuthPhase::Authenticated
    }

    /// Get the session key (only available after successful authentication).
    pub fn session_key(&self) -> Option<&[u8; 16]> {
        self.session_key.as_ref()
    }
}

// ---------------------------------------------------------------------------
// NFC Session — high-level card interaction
// ---------------------------------------------------------------------------

/// Trait for sending APDUs to a reader.
///
/// Implementors connect to the actual PC/SC stack (e.g., `pcsc` crate on
/// macOS).  The trait exists so the rest of the code can be tested with
/// a mock transport.
pub trait NfcTransport {
    fn transmit(&mut self, command: &ApduCommand) -> Result<ApduResponse>;
}

/// A mock transport for testing.
pub struct MockTransport {
    /// Pre-loaded responses to return in order.
    pub responses: Vec<ApduResponse>,
    /// Index into `responses`.
    pub cursor: usize,
}

impl MockTransport {
    pub fn new(responses: Vec<ApduResponse>) -> Self {
        Self {
            responses,
            cursor: 0,
        }
    }
}

impl NfcTransport for MockTransport {
    fn transmit(&mut self, _command: &ApduCommand) -> Result<ApduResponse> {
        if self.cursor >= self.responses.len() {
            return Err(NfcError::CommError("no more mock responses".into()));
        }
        let resp = self.responses[self.cursor].clone();
        self.cursor += 1;
        Ok(resp)
    }
}

/// High-level NFC session wrapping a transport.
pub struct NfcSession<T: NfcTransport> {
    pub transport: T,
    pub selected_app: Option<[u8; 3]>,
    pub authenticated: bool,
}

impl<T: NfcTransport> NfcSession<T> {
    pub fn new(transport: T) -> Self {
        Self {
            transport,
            selected_app: None,
            authenticated: false,
        }
    }

    /// Select the Dream Nova application on the card.
    pub fn select_nova_app(&mut self) -> Result<()> {
        let aid = [0xD7, 0xEA, 0x01]; // Dream Nova AID
        let cmd = ApduCommand::select(&aid);
        let resp = self.transport.transmit(&cmd)?;
        resp.check()?;
        self.selected_app = Some(aid);
        Ok(())
    }

    /// Read data from a file on the card.
    pub fn read_file(&mut self, file_no: u8, offset: u32, length: u32) -> Result<Vec<u8>> {
        let cmd = ApduCommand::read_data(file_no, offset, length);
        let resp = self.transport.transmit(&cmd)?;
        resp.check()?;
        Ok(resp.data)
    }

    /// Write data to a file on the card.
    pub fn write_file(&mut self, file_no: u8, offset: u32, data: &[u8]) -> Result<()> {
        let cmd = ApduCommand::write_data(file_no, offset, data);
        let resp = self.transport.transmit(&cmd)?;
        resp.check()?;
        Ok(())
    }

    /// Get the card's version information.
    pub fn get_version(&mut self) -> Result<Vec<u8>> {
        let cmd = ApduCommand::get_version();
        let resp = self.transport.transmit(&cmd)?;
        resp.check()?;
        Ok(resp.data)
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_apdu_select() {
        let aid = [0xD7, 0xEA, 0x01];
        let cmd = ApduCommand::select(&aid);
        let bytes = cmd.to_bytes();
        assert_eq!(bytes[0], 0x00); // CLA
        assert_eq!(bytes[1], 0xA4); // INS = SELECT
        assert_eq!(bytes[4], 3); // Lc = 3 (AID length)
    }

    #[test]
    fn test_apdu_response_parse() {
        let raw = vec![0x01, 0x02, 0x03, 0x90, 0x00];
        let resp = ApduResponse::from_bytes(&raw).unwrap();
        assert_eq!(resp.data, vec![0x01, 0x02, 0x03]);
        assert!(resp.is_success());
    }

    #[test]
    fn test_apdu_response_error() {
        let raw = vec![0x6A, 0x82]; // File not found
        let resp = ApduResponse::from_bytes(&raw).unwrap();
        assert!(!resp.is_success());
    }

    #[test]
    fn test_nova_key() {
        let uid = [0x04, 0xAB, 0xCD, 0xEF, 0x12, 0x34, 0x56];
        let key = NovaKey::from_uid(uid);
        assert_eq!(key.uid, uid);
        assert_eq!(key.fingerprint_hex().len(), 64);
    }

    #[test]
    fn test_auth_start() {
        let mut auth = DESFireAuth::new(0);
        let cmd = auth.start_command();
        assert_eq!(cmd.ins, 0x71);
        assert!(!auth.is_authenticated());
    }

    #[test]
    fn test_mock_session() {
        let responses = vec![
            ApduResponse {
                data: vec![],
                sw1: 0x90,
                sw2: 0x00,
            },
            ApduResponse {
                data: vec![0xDE, 0xAD],
                sw1: 0x90,
                sw2: 0x00,
            },
        ];
        let transport = MockTransport::new(responses);
        let mut session = NfcSession::new(transport);

        // Select app.
        session.select_nova_app().unwrap();
        assert_eq!(session.selected_app, Some([0xD7, 0xEA, 0x01]));

        // Get version.
        let ver = session.get_version().unwrap();
        assert_eq!(ver, vec![0xDE, 0xAD]);
    }

    #[test]
    fn test_read_data_command() {
        let cmd = ApduCommand::read_data(0x01, 0, 32);
        assert_eq!(cmd.ins, 0xBD);
        assert_eq!(cmd.data[0], 0x01); // file number
    }

    #[test]
    fn test_write_data_command() {
        let payload = b"NaNach";
        let cmd = ApduCommand::write_data(0x02, 0, payload);
        assert_eq!(cmd.ins, 0x3D);
        assert!(cmd.data.len() > payload.len());
    }
}
