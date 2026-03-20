"use client";

import { motion } from "framer-motion";

const ENGINE_CODE = {
  evolutrix: `impl Mutator {
    pub fn evolve(&self, ast: &mut AST) {
        self.randomize_field_order(ast);     // DSLR
        let key = self.derive_rolling_key(); // ISR
        self.encrypt_instructions(ast, &key);
        self.inject_decoys(ast, Adaptive);   // MTD
    }
}`,
  antimatrix: `pub enum IsolationLevel {
    Standard,    // L1: Container sandbox
    Elevated,    // L2: + network isolation
    Quarantine,  // L3: + I/O restriction
    Containment, // L4: + memory encryption
    Lockdown,    // L5: + CPU pinning
    Immolation,  // L6: Complete destruction
}`,
  tzimtzum: `pub fn verify_proof(
    &self,
    proof: &Proof,
    public_inputs: &[Fr],
) -> Result<bool, ZkError> {
    let verifier = Verifier::new(self.params());
    verifier.verify(proof, public_inputs)
    // < 5ms verification, zero data exposed
}`,
  esther: `class EstherMonitor:
    async def detect(self, graph: NetworkGraph):
        entropy = self.shannon_derivative(graph.flow)
        # H(F) = 1.846 bits baseline
        score = self.gnn.predict(graph.adjacency)
        if score > self.threshold:
            await self.daemon.contain(graph.source)`,
};

interface EngineSection {
  num: string;
  name: string;
  subtitle: string;
  color: string;
  colorClass: string;
  metric: { value: string; label: string };
  description: string;
  techSpecs: string[];
  capabilities: string[];
  code: string;
  codeFile: string;
  codeLang: string;
}

const ENGINES: EngineSection[] = [
  {
    num: "01",
    name: "Evolutrix",
    subtitle: "Self-Evolving Polymorphic Meta-Language Compiler",
    color: "#D4AF37",
    colorClass: "gold",
    metric: { value: "10^18", label: "unique configurations per cycle" },
    description:
      "Evolutrix is a polymorphic compiler that mutates its own instruction set, data structures, and execution paths on every clock cycle. By the time an attacker reverse-engineers the current state, the system has already evolved into something entirely different. This is not obfuscation — it is a mathematically provable moving target defense operating at the AST level.",
    techSpecs: [
      "AMTD — Automated Moving Target Defense with rolling 256-bit cryptographic keys",
      "DSLR — Data Structure Layout Randomization prevents memory exploitation by shuffling field order at compile time",
      "ISR — Instruction Set Randomization via polymorphic AST mutation using NovaMorph arena allocator (bumpalo O(1))",
      "MTD — Moving Target Decoys inject phantom nodes that absorb and report reconnaissance attempts",
    ],
    capabilities: [
      "Compiles to WebAssembly for cross-platform deployment",
      "Integrates with Antimatrix for sandboxed evolution",
      "Entropy-verified by Esther AI after each mutation cycle",
      "Full audit trail via DAG-UTXO immutable ledger",
    ],
    code: ENGINE_CODE.evolutrix,
    codeFile: "crates/evolutrix/src/mutator.rs",
    codeLang: "rust",
  },
  {
    num: "02",
    name: "Antimatrix",
    subtitle: "AI Confinement Hypervisor with Formal Verification",
    color: "#00D4FF",
    colorClass: "cyan",
    metric: { value: "100%", label: "formal verification coverage" },
    description:
      "Antimatrix is a formally verified hypervisor specifically designed to confine AI workloads. Six isolation levels — from standard containerization to complete immolation — are enforced through Constitutional Spec-Driven Development (CSDD) verified by Z3 SMT solver at compile time. The system physically cannot deviate from its constitutional constraints.",
    techSpecs: [
      "CSDD — Constitutional Spec-Driven Development with Z3 SMT formal verification at compile time",
      "6 isolation levels: Standard → Elevated → Quarantine → Containment → Lockdown → Immolation",
      "Wasmtime fuel system for real-time resource budgeting with deterministic termination",
      "Hardware-backed enforcement via Apple Secure Enclave / Intel SGX",
    ],
    capabilities: [
      "Autonomous escalation based on threat assessment",
      "Integrates with Esther AI for anomaly-triggered isolation",
      "Z3 proofs are stored on DAG-UTXO ledger for audit",
      "EU AI Act compliance through constitutional constraints",
    ],
    code: ENGINE_CODE.antimatrix,
    codeFile: "crates/antimatrix/src/hypervisor.rs",
    codeLang: "rust",
  },
  {
    num: "03",
    name: "Tzimtzum",
    subtitle: "Zero-Knowledge Verification Engine (Halo2 zk-SNARKs)",
    color: "#D4AF37",
    colorClass: "gold",
    metric: { value: "< 50ms", label: "proof generation time" },
    description:
      "Tzimtzum implements Halo2 zk-SNARKs with Plonkish arithmetization — no trusted setup required. The system proves identity, compliance, and data integrity without exposing a single byte of sensitive information. The 'Solid-Liquid' state transition model keeps data encrypted on disk and projects it into RAM only upon valid cryptographic proof.",
    techSpecs: [
      "Halo2 zk-SNARKs with Plonkish arithmetization — no trusted setup, no toxic waste",
      "Solid-Liquid state transitions: data remains encrypted (solid) until a valid proof decrypts it to RAM (liquid)",
      "Merkle tree-based identity verification without exposing underlying data",
      "VDF (Verifiable Delay Function) time-barriers prevent replay and pre-computation attacks",
    ],
    capabilities: [
      "NFC-Bridge integration for hardware-backed key ceremonies",
      "SOC 2 Type II compliance proofs generated automatically",
      "Cross-chain proof anchoring for tamper evidence",
      "HIPAA/GxP-compatible zero-knowledge audit trails",
    ],
    code: ENGINE_CODE.tzimtzum,
    codeFile: "crates/tzimtzum/src/verifier.rs",
    codeLang: "rust",
  },
  {
    num: "04",
    name: "Esther AI",
    subtitle: "Autonomous Threat Intelligence with GNN + Shannon Entropy",
    color: "#00D4FF",
    colorClass: "cyan",
    metric: { value: "1.846 bits", label: "entropy baseline H(F)" },
    description:
      "Esther AI uses Shannon entropy derivatives and Graph Neural Networks (GNN with multi-head graph attention) to detect anomalies that are invisible to signature-based systems. The Phantom FLOP detection system monitors CPU performance counters (PMU/kperf) to catch supply-chain compromises at the silicon level — detecting unauthorized computations hidden in legitimate instruction flows.",
    techSpecs: [
      "Shannon entropy derivative analysis: measures information-theoretic deviations from established baseline H(F) = 1.846 bits",
      "GNN with multi-head graph attention: learns your network topology and detects structural anomalies in real-time",
      "PMU/kperf Phantom FLOP detection: catches hidden computations in CPU instruction flow via hardware performance counters",
      "MLX acceleration on Apple Silicon (Metal GPU) for real-time inference at edge",
    ],
    capabilities: [
      "Autonomous response daemon with sub-second containment",
      "Predictive threat modeling with 72-hour horizon",
      "Feeds anomaly data to Antimatrix for isolation escalation",
      "Integrates with Evolutrix to trigger defensive mutation cycles",
    ],
    code: ENGINE_CODE.esther,
    codeFile: "python/esther/monitor.py",
    codeLang: "python",
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden">
      {/* Section header */}
      <div className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-[#020205]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <p className="font-mono text-xs text-[#D4AF37] tracking-[0.4em] uppercase mb-6">
              The Platform
            </p>
            <h2 className="font-cinzel font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
              Four Engines.{" "}
              <span className="sacred-gradient-text">One Architecture.</span>
            </h2>
            <p className="mt-6 font-rajdhani text-xl text-[#8888AA] max-w-3xl mx-auto leading-relaxed">
              Each component is a standalone breakthrough backed by compiled,
              tested code. Together, they form the first cybersecurity platform
              that evolves autonomously — with no human in the loop.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Engine sections — full-width alternating layout */}
      {ENGINES.map((engine, index) => {
        const isReversed = index % 2 !== 0;
        const isGold = engine.colorClass === "gold";

        return (
          <div key={engine.name} className="relative">
            {/* Unique background per engine */}
            <div className="absolute inset-0 bg-[#020205]" />
            {isGold ? (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(212,175,55,0.03)_0%,_transparent_50%)]" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(0,212,255,0.03)_0%,_transparent_50%)]" />
            )}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
              <div
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-start gap-12 lg:gap-20`}
              >
                {/* Text content */}
                <motion.div
                  className="flex-1 max-w-2xl"
                  initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut" as const,
                  }}
                >
                  {/* Number + Name */}
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className="font-mono text-5xl font-bold opacity-15"
                      style={{ color: engine.color }}
                    >
                      {engine.num}
                    </span>
                    <div>
                      <h3
                        className="font-cinzel font-bold text-3xl sm:text-4xl tracking-tight"
                        style={{ color: engine.color }}
                      >
                        {engine.name}
                      </h3>
                      <p className="font-mono text-[11px] text-[#8888AA]/70 tracking-wider uppercase mt-1">
                        {engine.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Metric */}
                  <div
                    className="inline-flex items-baseline gap-3 px-5 py-3 rounded-xl mb-8"
                    style={{
                      backgroundColor: `${engine.color}08`,
                      border: `1px solid ${engine.color}20`,
                    }}
                  >
                    <span
                      className="font-mono text-3xl font-bold"
                      style={{ color: engine.color }}
                    >
                      {engine.metric.value}
                    </span>
                    <span className="font-rajdhani text-sm text-[#8888AA]">
                      {engine.metric.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-rajdhani text-lg text-[#8888AA] leading-relaxed mb-8">
                    {engine.description}
                  </p>

                  {/* Technical Specifications */}
                  <div className="mb-8">
                    <h4
                      className="font-rajdhani font-bold text-sm tracking-wider uppercase mb-4"
                      style={{ color: engine.color }}
                    >
                      Technical Specifications
                    </h4>
                    <ul className="space-y-3">
                      {engine.techSpecs.map((spec) => (
                        <li key={spec} className="flex items-start gap-3">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"
                            style={{ backgroundColor: engine.color }}
                          />
                          <span className="font-rajdhani text-sm text-[#8888AA]/90 leading-relaxed">
                            {spec}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Capabilities */}
                  <div>
                    <h4 className="font-rajdhani font-bold text-sm text-white/40 tracking-wider uppercase mb-4">
                      Integration & Compliance
                    </h4>
                    <ul className="space-y-2">
                      {engine.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-3">
                          <span className="w-1 h-1 rounded-full bg-white/20 mt-2.5 shrink-0" />
                          <span className="font-rajdhani text-sm text-[#8888AA]/60 leading-relaxed">
                            {cap}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Code + visual side */}
                <motion.div
                  className="w-full lg:w-[440px] lg:sticky lg:top-28 shrink-0"
                  initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                    ease: "easeOut" as const,
                  }}
                >
                  {/* Code block */}
                  <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#080810]">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.04]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/70" />
                      </div>
                      <span className="font-mono text-[10px] text-white/20 ml-2">
                        {engine.codeFile}
                      </span>
                      <span
                        className="ml-auto font-mono text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider"
                        style={{
                          color: engine.color,
                          backgroundColor: `${engine.color}10`,
                        }}
                      >
                        {engine.codeLang}
                      </span>
                    </div>
                    <pre className="p-5 font-mono text-[11px] leading-[1.8] overflow-x-auto">
                      <code>
                        {engine.code.split("\n").map((line, i) => {
                          let color = "text-[#8888AA]/70";
                          if (line.includes("//") || line.includes("#"))
                            color = "text-[#8888AA]/35 italic";
                          if (
                            line.includes("pub fn") ||
                            line.includes("pub enum") ||
                            line.includes("impl ") ||
                            line.includes("class ") ||
                            line.includes("async def") ||
                            line.includes("def ")
                          )
                            color = "text-[#00D4FF]";
                          if (
                            line.includes("self.") ||
                            line.includes("self,")
                          )
                            color = "text-[#D4AF37]";
                          if (
                            line.includes("let ") ||
                            line.includes("await ")
                          )
                            color = "text-[#00D4FF]/80";
                          if (
                            line.includes("Standard") ||
                            line.includes("Elevated") ||
                            line.includes("Quarantine") ||
                            line.includes("Containment") ||
                            line.includes("Lockdown") ||
                            line.includes("Immolation") ||
                            line.includes("Adaptive") ||
                            line.includes("Verifier")
                          )
                            color = "text-[#D4AF37]";
                          return (
                            <span key={i} className={`block ${color}`}>
                              {line}
                            </span>
                          );
                        })}
                      </code>
                    </pre>
                  </div>

                  {/* Stats below code */}
                  <div
                    className="mt-4 grid grid-cols-2 gap-3"
                  >
                    {engine.codeLang === "rust" ? (
                      <>
                        <div
                          className="p-4 rounded-xl"
                          style={{
                            backgroundColor: `${engine.color}06`,
                            border: `1px solid ${engine.color}12`,
                          }}
                        >
                          <span
                            className="block font-mono text-xl font-bold"
                            style={{ color: engine.color }}
                          >
                            {engine.name === "Evolutrix"
                              ? "2,400+"
                              : engine.name === "Antimatrix"
                                ? "1,900+"
                                : "1,600+"}
                          </span>
                          <span className="block font-rajdhani text-xs text-[#8888AA]/50 mt-1">
                            Lines of Rust
                          </span>
                        </div>
                        <div
                          className="p-4 rounded-xl"
                          style={{
                            backgroundColor: `${engine.color}06`,
                            border: `1px solid ${engine.color}12`,
                          }}
                        >
                          <span
                            className="block font-mono text-xl font-bold"
                            style={{ color: engine.color }}
                          >
                            {engine.name === "Evolutrix"
                              ? "7"
                              : engine.name === "Antimatrix"
                                ? "27"
                                : "25"}
                          </span>
                          <span className="block font-rajdhani text-xs text-[#8888AA]/50 mt-1">
                            Verified Tests
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="p-4 rounded-xl"
                          style={{
                            backgroundColor: `${engine.color}06`,
                            border: `1px solid ${engine.color}12`,
                          }}
                        >
                          <span
                            className="block font-mono text-xl font-bold"
                            style={{ color: engine.color }}
                          >
                            1,200+
                          </span>
                          <span className="block font-rajdhani text-xs text-[#8888AA]/50 mt-1">
                            Lines of Python
                          </span>
                        </div>
                        <div
                          className="p-4 rounded-xl"
                          style={{
                            backgroundColor: `${engine.color}06`,
                            border: `1px solid ${engine.color}12`,
                          }}
                        >
                          <span
                            className="block font-mono text-xl font-bold"
                            style={{ color: engine.color }}
                          >
                            10
                          </span>
                          <span className="block font-rajdhani text-xs text-[#8888AA]/50 mt-1">
                            Verified Tests
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
