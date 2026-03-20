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
cargo test --workspace   # doit afficher 103 passed, 0 failed
```

## Publication dans l'ordre (dépendances d'abord)

**IMPORTANT** : tzimtzum et dag-ledger dépendent de `vdf`. Il FAUT publier `vdf` en premier
et attendre ~60 secondes que crates.io l'indexe avant de publier les dépendants.

```bash
cd ~/Desktop/dreamnova-v5

# ÉTAPE 1 — Crates indépendants (dry-run PASS confirmé)
cargo publish -p nova-morph
cargo publish -p antimatrix
cargo publish -p evolutrix
cargo publish -p nfc-bridge
cargo publish -p vdf          # ← DOIT être publié avant tzimtzum et dag-ledger

# Attendre que crates.io indexe vdf (~60 secondes)
echo "Attente indexation vdf sur crates.io..."
sleep 60

# ÉTAPE 2 — Crates qui dépendent de vdf
cargo publish -p tzimtzum     # dépend de vdf 0.1.0
cargo publish -p dag-ledger   # dépend de vdf 0.1.0
```

> **Si tzimtzum ou dag-ledger échouent** avec "could not find VdfChallenge in vdf",
> c'est que crates.io n'a pas encore indexé vdf. Attendre 2 minutes et réessayer.

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
- ✅ 103 tests, 0 failures
- ✅ Dry-run PASS sur tous les 7 crates

---

*Emunah-102 — 2026-03-20 16:45*
