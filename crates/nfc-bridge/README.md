# nfc-bridge

**DESFire EV3 NFC interface for Nova Key hardware tokens.**

`nfc-bridge` is the hardware communication layer of DreamNova's Nova Key ($63 physical authentication token). It implements the NFC APDU protocol for NXP MIFARE DESFire EV3 cards — mutual AES-based authentication, file read/write, and session key management.

## Architecture

```
┌──────────────┐    APDU     ┌─────────────────┐    PC/SC    ┌──────────┐
│  Application  │───────────▶│   nfc-bridge     │───────────▶│  Reader  │
│  (Rust/WASM)  │◀───────────│   (this crate)   │◀───────────│ Hardware │
└──────────────┘  Response   └─────────────────┘   Response  └──────────┘
```

The bridge is deliberately transport-agnostic. Swap the PC/SC layer for a WebUSB, HID, or embedded UART driver without changing application code.

## Supported operations

| Operation | ISO standard | Description |
|-----------|-------------|-------------|
| `SELECT` | ISO 7816-4 | Select DESFire application by AID |
| `AuthenticateEV2First` | NXP AN10957 | Mutual AES-128 authentication |
| `READ DATA` | NXP AN10957 | Read file from card |
| `WRITE DATA` | NXP AN10957 | Write file to card |
| `GET VERSION` | NXP AN10957 | Retrieve card hardware info |

## Quick start (simulated)

```rust
use nfc_bridge::{NfcSession, CardInfo, SessionKey};

// Create a simulated session (no real hardware needed for testing)
let mut session = NfcSession::new_simulated();

// Authenticate
let master_key = [0x00u8; 16]; // all-zeros default key
session.authenticate(&master_key).expect("auth failed");

// Read identity data
let data = session.read_data(0x01).expect("read failed");
println!("Card data: {:?}", data);

// Session key is ephemeral — never stored
assert!(session.session_key().is_some());
```

## Security model

- **Master key never stored** — authentication derives an ephemeral session key
- **Session key diversity** — AES key diversification using `H(master_key || card_uid || nonce)`
- **Anti-replay** — each session produces a fresh nonce; old sessions cannot be replayed
- **Mutual authentication** — both card and reader prove knowledge of the shared key

```rust
use nfc_bridge::NfcSession;

let mut session = NfcSession::new_simulated();

// Both sides challenge each other — man-in-the-middle is detected
session.authenticate(&[0x00u8; 16]).unwrap();

// Session expires after a single operation cycle
session.invalidate();
assert!(session.read_data(0x01).is_err()); // SessionExpired
```

## Integration with Tzimtzum ZKP

The Nova Key workflow combines `nfc-bridge` + `tzimtzum`:

```
NFC tap
  │
  ▼
nfc-bridge: authenticate card → read private key (encrypted)
  │
  ▼
tzimtzum: prove key is in registry, produce nullifier
  │
  ▼
Application: verify ZKP proof, mark nullifier spent
```

## Status

| Component | Status |
|-----------|--------|
| Simulated NFC session | ✅ Implemented |
| AES-128 session key derivation | ✅ Implemented |
| APDU command builder | ✅ Implemented |
| PC/SC (real hardware) | 🔜 Planned (requires `pcsc` feature) |
| WebUSB (browser WASM) | 🔜 Planned |
| DESFire EV3 full command set | 🔜 Planned |

## Hardware target

**NXP MIFARE DESFire EV3** — the gold standard for secure NFC identity tokens:
- AES-128/192/256 hardware encryption
- 8 KB EEPROM, up to 32 applications
- ISO/IEC 14443-4 compliant
- EAL5+ certified

## License

Licensed under either [MIT](LICENSE-MIT) or [Apache 2.0](LICENSE-APACHE) at your option.
