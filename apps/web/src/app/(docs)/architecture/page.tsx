"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Coins, Server, Layers, Database, Cpu, Network, ArrowRight, Code } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PILLARS, PHASES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Brain, Shield, Coins, Server,
};

const techStack = [
  { category: "Frontend", items: ["Next.js 16", "React 19", "TailwindCSS 4", "Framer Motion 12"] },
  { category: "Backend", items: ["Node.js", "Python (async)", "Stripe API v20.3", "REST + WebSocket"] },
  { category: "Database", items: ["Supabase (PostgreSQL)", "FAISS Vector Store", "Redis Cache", "Edge KV"] },
  { category: "Infrastructure", items: ["Vercel Edge", "Apple M4 Max", "PM2 Process Mgmt", "CrewAI Agents"] },
  { category: "AI/ML", items: ["LangGraph Reasoning", "Custom Hebrew NLP", "RAG Pipeline", "Ollama Local LLM"] },
  { category: "Security", items: ["zk-SNARK Proofs", "AES-128 (NFC)", "TLS 1.3", "GDPR Compliant"] },
];

export default function ArchitecturePage() {
  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-cyan tracking-[0.3em] uppercase mb-4">
            Technical Deep-Dive
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-sacred-white tracking-wide mb-4">
            System{" "}
            <span className="sacred-gradient-text">Architecture</span>
          </h1>
          <p className="font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
            A comprehensive overview of DreamNova&apos;s post-quantum AI infrastructure:
            five modules, 103 tests, six SEC rules, and the five-phase commercialization roadmap.
          </p>
        </motion.div>

        {/* System diagram (text-based) */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide text-center mb-8">
            System Overview
          </h2>
          <Card variant="sacred" padding="lg">
            <pre className="font-mono text-xs text-sacred-gray overflow-x-auto leading-relaxed">
{`
                    ┌─────────────────────────────────────────┐
                    │           DREAM NOVA V5 PLATFORM         │
                    └────────────────────┬────────────────────┘
                                         │
           ┌─────────────────────────────┼─────────────────────────────┐
           │                             │                             │
    ┌──────┴──────┐              ┌───────┴───────┐             ┌──────┴──────┐
    │  FRONTEND   │              │   API LAYER   │             │  SERVICES   │
    │  Next.js 16 │◄────────────►│  REST + WS    │◄───────────►│  Stripe     │
    │  React 19   │              │  Edge Funcs   │             │  Supabase   │
    │  TailwindCSS│              │  Middleware    │             │  NFC Engine │
    └──────┬──────┘              └───────┬───────┘             └──────┬──────┘
           │                             │                             │
           └─────────────────────────────┼─────────────────────────────┘
                                         │
    ┌────────────────────────────────────┼────────────────────────────────────┐
    │                                    │                                    │
    │  ┌─────────┐  ┌──────────┐  ┌─────┴─────┐  ┌──────────┐  ┌─────────┐ │
    │  │EVOLUTRIX│  │ANTIMATRIX│  │  NOVA KEY  │  │ HAFATSA  │  │ AZAMRA  │ │
    │  │  ASL    │  │ zk-SNARK │  │  NFC/RFID  │  │ POINTS   │  │   OS    │ │
    │  │ Engine  │  │ Privacy  │  │  Gateway   │  │ ENGINE   │  │  Agent  │ │
    │  └────┬────┘  └────┬─────┘  └─────┬─────┘  └────┬─────┘  └────┬────┘ │
    │       │             │              │              │              │      │
    │  ┌────┴─────────────┴──────────────┴──────────────┴──────────────┴────┐ │
    │  │                    MAC M4 MAX INFRASTRUCTURE                       │ │
    │  │    40-core GPU │ 128GB Unified │ FAISS │ Ollama │ PM2 │ CrewAI    │ │
    │  └───────────────────────────────────────────────────────────────────┘ │
    └────────────────────────────────────────────────────────────────────────┘
`}
            </pre>
          </Card>
        </motion.div>

        {/* Four pillars detail */}
        <div className="mb-20">
          <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide text-center mb-8">
            The Four Pillars
          </h2>
          <div className="space-y-6">
            {PILLARS.map((pillar, index) => {
              const Icon = iconMap[pillar.icon];
              return (
                <motion.div
                  key={pillar.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                >
                  <Card variant="sacred" hover glow={pillar.color === "#D4AF37" ? "gold" : "cyan"} padding="lg">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/3">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${pillar.color}15`, border: `1px solid ${pillar.color}30` }}
                          >
                            {Icon && <Icon className="w-5 h-5" style={{ color: pillar.color }} />}
                          </div>
                          <h3 className="font-cinzel text-xl" style={{ color: pillar.color }}>
                            {pillar.name}
                          </h3>
                        </div>
                        <p className="font-rajdhani text-sm text-sacred-gray leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                      <div className="lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {pillar.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                              <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: pillar.color }} />
                              <span className="font-rajdhani text-xs text-sacred-gray/80">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tech stack */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide text-center mb-8">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((stack) => (
              <Card key={stack.category} variant="glass" padding="md">
                <h3 className="font-cinzel text-sm text-sacred-gold mb-3">{stack.category}</h3>
                <div className="space-y-2">
                  {stack.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Code className="w-3 h-3 text-sacred-gray/40" />
                      <span className="font-mono text-xs text-sacred-gray">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Five phases */}
        <div className="mb-20">
          <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide text-center mb-8">
            The Five Phases
          </h2>
          <div className="space-y-4">
            {PHASES.map((phase, index) => {
              const statusColors = {
                completed: "border-green-500/20 bg-green-500/5",
                active: "border-sacred-gold/30 bg-sacred-gold/5",
                upcoming: "border-white/10 bg-white/[0.02]",
              };

              return (
                <motion.div
                  key={phase.number}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" as const }}
                >
                  <div className={`p-6 rounded-2xl border ${statusColors[phase.status]}`}>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="lg:w-1/4">
                        <div className="flex items-center gap-3">
                          <span className="font-cinzel text-2xl text-sacred-gold/60">{phase.number}</span>
                          <div>
                            <h3 className="font-cinzel text-lg text-sacred-white">{phase.name}</h3>
                            <p className="font-mono text-xs text-sacred-gray/50">{phase.timeline}</p>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-1/4">
                        <p className="font-rajdhani text-sm text-sacred-gray">{phase.description}</p>
                      </div>
                      <div className="lg:w-1/2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {phase.milestones.map((m) => (
                            <div key={m} className="flex items-start gap-2">
                              <span className={`w-1 h-1 rounded-full mt-2 shrink-0 ${
                                phase.status === "active" ? "bg-sacred-gold" : "bg-sacred-gray/30"
                              }`} />
                              <span className="font-rajdhani text-xs text-sacred-gray/70">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="primary" size="lg" href="/whitepaper" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
            Read the Full Whitepaper
          </Button>
        </div>
      </div>
    </div>
  );
}
