"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, Shield, Lock, FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const researchAreas = [
  {
    title: "ASL: Sparse Tensor Routing",
    subtitle: "75% VRAM reduction — USPTO provisional filing in progress",
    description:
      "Artificial Super Learning (ASL) implements adaptive sparse routing for neural network inference. A bank of N=148 exon matrices is maintained on CPU storage; a lightweight router selects the top-K=37 indices per input token and transfers only those matrices to the compute device per forward pass. Validated benchmark: 75.0% VRAM reduction at all tested model sizes (d∈{256,512,1024}). The term 'Artificial Super Learning' is unclaimed in academic literature (verified Google Scholar + arXiv, March 2026).",
    stats: [
      { label: "VRAM Reduction", value: "75.0%" },
      { label: "USPTO Claims", value: "10 pending" },
      { label: "Prior Art", value: "Zero" },
    ],
    icon: Brain,
    link: "/architecture",
    color: "#00D4FF",
  },
  {
    title: "Antimatrix: Constitutional Verification",
    subtitle: "6 SEC rules — EU AI Act compliant hypervisor",
    description:
      "Antimatrix is a formal verification hypervisor for AI-generated code. Every output is submitted to a stateless constitutional verifier with six rules: no private key material (SEC-001), deterministic reproducibility (SEC-002), memory bounds 64 MiB (SEC-003), nullifier reuse prevention (SEC-004), shell injection detection (SEC-005), and API token detection (SEC-006). Violations trigger deterministic isolation escalation across 6 levels (Standard → Immolation). Implementation: 103 unit tests, pure Rust, 0 clippy warnings.",
    stats: [
      { label: "SEC Rules", value: "6 active" },
      { label: "Tests", value: "103 / 103" },
      { label: "Isolation Levels", value: "6" },
    ],
    icon: Shield,
    link: "/architecture",
    color: "#D4AF37",
  },
  {
    title: "Breslov RAG Engine",
    subtitle: "Sub-5ms vector retrieval — FAISS local inference",
    description:
      "Retrieval-Augmented Generation engine providing sub-5ms local inference across 50,000+ embeddings from Breslov literature with custom Hebrew tokenization. Built on FAISS with multilingual support (HE/EN/FR). Powers the Breslov AI SaaS (yachid $9/mo, kehila $49/mo, mosdot $149/mo) with Stripe subscription lifecycle management.",
    stats: [
      { label: "Embeddings", value: "50,000+" },
      { label: "Latency", value: "< 5ms" },
      { label: "Languages", value: "HE/EN/FR" },
    ],
    icon: BarChart3,
    link: "/rag",
    color: "#D4AF37",
  },
  {
    title: "Tzimtzum: ZKP Identity (Halo2)",
    subtitle: "Prove membership without revealing identity",
    description:
      "Tzimtzum implements a zk-SNARK Merkle membership circuit using the Halo2 proof system (no trusted setup). A prover demonstrates they hold a leaf in a validated key set without disclosing which leaf or any personal data. Applications: privacy-preserving KYC, anonymous access control, GDPR-compliant identity verification. NFC DESFire EV3 hardware integration via nova-morph bridge.",
    stats: [
      { label: "Proof System", value: "Halo2" },
      { label: "Setup", value: "Transparent" },
      { label: "GDPR Art. 25", value: "Compliant" },
    ],
    icon: Lock,
    link: "/architecture",
    color: "#00D4FF",
  },
];

const publications = [
  {
    title: "ASL: Sparse Tensor Routing for 75% VRAM Reduction in Neural Network Inference",
    venue: "Target — arXiv cs.LG + cs.AI | NeurIPS 2026",
    date: "Q2 2026",
    status: "in-progress",
  },
  {
    title: "Constitutional Spec-Driven Formal Verification for AI Runtime Safety",
    venue: "Target — IEEE S&P 2026 Workshop on AI Security",
    date: "Q2 2026",
    status: "in-progress",
  },
  {
    title: "The Source Code of Reality: Information-Theoretic Analysis of Likutey Moharan",
    venue: "Under Review — EAJS Congress 2026 (DH Sheffield) + nachman-science.vercel.app",
    date: "March 2026",
    status: "submitted",
  },
  {
    title: "Zero-Knowledge Identity for Privacy-Preserving Authentication: Halo2/Poseidon Implementation",
    venue: "Target — IEEE S&P Workshop",
    date: "Q3 2026",
    status: "planned",
  },
];

const statusBadge = {
  submitted: { bg: "bg-sacred-gold/10", text: "text-sacred-gold", label: "Submitted" },
  "in-progress": { bg: "bg-sacred-cyan/10", text: "text-sacred-cyan", label: "In Progress" },
  planned: { bg: "bg-sacred-gray/10", text: "text-sacred-gray", label: "Planned" },
};

export default function ResearchPage() {
  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            Technical Research
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide">
            Research &{" "}
            <span className="sacred-gradient-text">Benchmarks</span>
          </h1>
          <p className="mt-4 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
            Post-quantum AI infrastructure research: sparse tensor routing, constitutional verification, ZKP identity systems, and polymorphic compilation. 103 automated tests. USPTO provisional filings in progress.
          </p>
        </motion.div>

        {/* Research areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" as const }}
            >
              <Card variant="sacred" hover glow={area.color === "#D4AF37" ? "gold" : "cyan"} padding="lg" className="h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${area.color}15`,
                      border: `1px solid ${area.color}30`,
                    }}
                  >
                    <area.icon className="w-6 h-6" style={{ color: area.color }} />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg text-sacred-white">{area.title}</h3>
                    <p className="font-mono text-xs text-sacred-gray/60 mt-1">{area.subtitle}</p>
                  </div>
                </div>
                <p className="font-rajdhani text-sm text-sacred-gray leading-relaxed mb-6">
                  {area.description}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {area.stats.map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="font-mono text-xs text-sacred-gold">{stat.value}</p>
                      <p className="font-rajdhani text-[10px] text-sacred-gray/50 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={area.link}
                  className="inline-flex items-center gap-2 font-rajdhani text-sm text-sacred-gold hover:text-sacred-gold-light transition-colors"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Publications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide mb-8 text-center">
            Publications & Papers
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {publications.map((pub) => {
              const badge = statusBadge[pub.status as keyof typeof statusBadge];
              return (
                <Card key={pub.title} variant="glass" padding="md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-rajdhani text-sm text-sacred-white font-semibold">
                        {pub.title}
                      </h3>
                      <p className="font-mono text-xs text-sacred-gray/60 mt-1">
                        {pub.venue} | {pub.date}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider shrink-0 ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" href="/whitepaper" icon={<ExternalLink className="w-4 h-4" />} iconPosition="right">
            Read the Whitepaper
          </Button>
        </div>
      </div>
    </div>
  );
}
