# DreamNova V5 — Guide de publication crates.io

**Préparé par Emunah-102 — 2026-03-20**
**Status**: 7/7 crates dry-run PASS ✅ — prêt à exécuter

---

## Pré-requis (5 minutes)

```bash
# 1. Login crates.io (ouvre le navigateur pour auth)
cargo login

# 2. Vérifier que tout compile
cd ~/Desktop/dreamnova-v5
cargo test --workspace   # doit afficher 94 passed, 0 failed
```

## Publication dans l'ordre (dépendances d'abord)

```bash
cd ~/Desktop/dreamnova-v5

# 1. Crates sans dépendances internes
cargo publish -p nova-morph
cargo publish -p antimatrix
cargo publish -p evolutrix
cargo publish -p vdf          # ← dag-ledger et tzimtzum en dépendent

# 2. Crates qui dépendent de vdf (attendre ~30s que vdf soit indexé)
sleep 30
cargo publish -p nfc-bridge
cargo publish -p tzimtzum     # dépend de vdf
cargo publish -p dag-ledger   # dépend de vdf
```

> **Note**: crates.io a un délai d'indexation de ~30 secondes entre les publications.
> Si tzimtzum ou dag-ledger échouent avec "package not found", attendre 1 minute et réessayer.

## Après publication

```bash
# Vérifier que tout est live
cargo search nova-morph
cargo search antimatrix
```

URLs sur crates.io:
- https://crates.io/crates/nova-morph
- https://crates.io/crates/antimatrix
- https://crates.io/crates/evolutrix
- https://crates.io/crates/tzimtzum
- https://crates.io/crates/vdf
- https://crates.io/crates/nfc-bridge
- https://crates.io/crates/dag-ledger

---

## Ce qui est déjà en place (rien à faire)

- ✅ README.md dans chaque crate
- ✅ LICENSE-MIT + LICENSE-APACHE dans chaque crate
- ✅ keywords + categories dans chaque Cargo.toml
- ✅ readme = "README.md" dans chaque Cargo.toml
- ✅ 94 tests, 0 failures
- ✅ Dry-run PASS sur tous les 7 crates

---

*Emunah-102 — 2026-03-20 16:45*
