"use client";

import { motion } from "framer-motion";
import type { Metadata } from "next";

const sections = [
  {
    number: "I",
    title: "The Problem",
    content: `Every organization deploying AI today faces the same three unsolved problems: models that consume 4× more compute than necessary, AI systems that cannot formally prove their own compliance, and identity infrastructure that will not survive the quantum era.

These are not edge cases. They are the default state of AI deployment in 2026. Every Fortune 500 company, every government agency, every hospital running machine learning is exposed to all three simultaneously.

The industry has responded with patches: quantization trades accuracy for efficiency, policy documents substitute for formal verification, and PKI migrations stretch decades into the future. None of these are solutions. They are deferrals.`,
  },
  {
    number: "II",
    title: "The Vision",
    content: `DreamNova exists to build the missing infrastructure layer — the post-quantum security stack that should have been built before AI scaled to its current footprint.

Our mission is specific and measurable: $63M in licensing revenue over 7-10 years, building ARM-equivalent IP for the AI security era. One million deployments. Every deployment formally verified. Every verification cryptographically sound.

We are not building another cybersecurity product. We are building the foundational primitives — the IP licensing layer — that every serious AI deployment will eventually need to run on.`,
  },
  {
    number: "III",
    title: "The Technology",
    content: `We do not build technology for its own sake. Every system we create solves a precise, measurable problem:

EVOLUTRIX — Polymorphic Moving Target Defense. A compiler that produces structurally unique binaries from identical source code. Reverse engineering a deployed system yields a ghost — the real system has already mutated. 7 tests. Production Rust.

ANTIMATRIX — Constitutional AI Hypervisor. Six isolation levels. Six security rules enforced at the boundary of every AI decision. Formally verified by Z3 SMT solver. EU AI Act Article 9 compliance automated, not claimed. 27 tests. 6 SEC rules.

TZIMTZUM — Zero-Knowledge Proof Engine. Halo2 zk-SNARKs. No trusted setup. Identity verification in under 50 milliseconds without exposing a single byte. Quantum-resistant by construction. 25 tests.

ASL — Alternative Splicing Layer. 75% VRAM reduction. Not by degrading quality — by loading only the 25% of model parameters that are statistically relevant to each inference. 10 USPTO patent claims. Zero prior art.`,
  },
  {
    number: "IV",
    title: "The Method",
    content: `There is a principle we follow in every line of code: find what works, isolate it, build around it. Never rewrite from scratch when you can iterate from a working foundation.

This is not timidity. It is precision engineering. Every cryptographic primitive we use is proven. Every formal verification claim we make is machine-checkable. Every test we ship is deterministic.

We do not optimize for velocity. We optimize for correctness. A 75% VRAM reduction that degrades model quality is worthless. A formal verification claim that holds only in theory is dangerous. We ship numbers we can defend in front of a patent examiner, a DARPA program manager, and a Trail of Bits auditor simultaneously.`,
  },
  {
    number: "V",
    title: "The Standard",
    content: `When an enterprise deploys DreamNova infrastructure, they are not purchasing a product. They are adopting a standard.

A standard that requires every AI output to pass constitutional verification before execution. A standard that proves identity without exposing identity. A standard that deploys models on commodity hardware that previously required datacenter-class GPU.

This standard extends to our codebase: 103 tests, zero clippy warnings, zero unsafe Rust blocks without justification. It extends to our IP: 10 USPTO claims, zero prior art, machine-verified novelty. It extends to our partnerships: we do not co-develop with organizations that would weaponize the technology we build.`,
  },
  {
    number: "VI",
    title: "The Roadmap",
    content: `Five phases. Five commercialization milestones. Five layers of defensibility.

Phase 1 (Q1-Q2 2026): Core Engine — 7 Rust crates, 103 tests, Shadow Mode enterprise pilots.
Phase 2 (Q3-Q4 2026): Enterprise Integration — SIEM/SOAR/EDR connectors, SOC 2 Type II, ISO 27001.
Phase 3 (2027): Autonomous Defense — self-healing network topology, predictive threat modeling.
Phase 4 (2027-2028): Industry Verticals — pharma GxP, defense ITAR, HFT sub-microsecond detection.
Phase 5 (2028+): Hardware Sovereignty — Nova silicon, sealed compute nodes, NIST standard ratification.

We are in Phase 1. The foundation is built. The light is just beginning.`,
  },
];

export default function ManifestoPage() {
  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            Our Declaration
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-sacred-white tracking-wide leading-tight">
            The Dream Nova{" "}
            <span className="sacred-gradient-text">Manifesto</span>
          </h1>
          <div className="mt-6 w-16 h-px bg-sacred-gold/30 mx-auto" />
        </motion.div>

        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.article
              key={section.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.05,
                ease: "easeOut" as const,
              }}
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center">
                  <span className="font-cinzel text-lg text-sacred-gold">
                    {section.number}
                  </span>
                </div>
                <div>
                  <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.split("\n\n").map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="font-rajdhani text-base text-sacred-gray leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" as const }}
        >
          <div className="w-16 h-px bg-sacred-gold/30 mx-auto mb-8" />
          <p className="font-sacred text-xl italic text-sacred-gold/60">
            103 tests. 0 failures. The work continues.
          </p>
          <p className="font-mono text-xs text-sacred-gray/30 mt-4">
            ASL · EVOLUTRIX · ANTIMATRIX · TZIMTZUM
          </p>
        </motion.div>
      </div>
    </div>
  );
}
