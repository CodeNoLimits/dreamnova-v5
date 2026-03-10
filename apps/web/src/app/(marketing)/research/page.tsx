"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, BarChart3, Brain, FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const researchAreas = [
  {
    title: "The Source Code of Reality",
    subtitle: "Information-theoretic analysis of Likutey Moharan",
    description:
      "We discovered that Rabbi Nachman's magnum opus, Likutey Moharan, exhibits an information entropy of H(F) = 1.846 bits — a value that places it in a unique category among all analyzed sacred and philosophical texts. This suggests a deliberate structural encoding that transcends ordinary composition.",
    stats: [
      { label: "Entropy", value: "H(F) = 1.846 bits" },
      { label: "References", value: "185+" },
      { label: "Competition", value: "Zero (novel field)" },
    ],
    icon: BookOpen,
    link: "/source-code",
    color: "#D4AF37",
  },
  {
    title: "Artificial Super Learning (ASL)",
    subtitle: "Patent-pending cognitive architecture",
    description:
      "ASL is our proprietary learning framework that models the 613-layer structure of Torah commandments as a neural network architecture. Each layer corresponds to a specific type of knowledge acquisition, from basic pattern recognition (Malchut) to abstract conceptual synthesis (Keter).",
    stats: [
      { label: "USPTO Claims", value: "10 pending" },
      { label: "Layers", value: "613" },
      { label: "Term Status", value: "Unclaimed" },
    ],
    icon: Brain,
    link: "/architecture",
    color: "#00D4FF",
  },
  {
    title: "Breslov RAG Engine",
    subtitle: "Vector retrieval over 50,000+ sacred text embeddings",
    description:
      "Our Retrieval-Augmented Generation engine provides sub-5ms local inference across 50,000+ embeddings from Breslov literature, Talmud, Zohar, and related commentaries. Built on FAISS with custom Hebrew tokenization that preserves gematria relationships between terms.",
    stats: [
      { label: "Embeddings", value: "50,000+" },
      { label: "Latency", value: "< 5ms" },
      { label: "Languages", value: "HE/EN/FR" },
    ],
    icon: BarChart3,
    link: "/whitepaper",
    color: "#D4AF37",
  },
  {
    title: "Sacred Geometry in NFC Design",
    subtitle: "Physical encodings of Kabbalistic structures",
    description:
      "Each Nova Key card features laser-engraved sacred geometry based on the Tree of Life (Etz Chaim). The physical layout of the ten Sefirot corresponds to functional zones on the NFC chip, creating a bridge between the physical and digital sacred spaces.",
    stats: [
      { label: "Sefirot Mapped", value: "10/10" },
      { label: "Engraving", value: "Laser 50um" },
      { label: "Material", value: "SS 304" },
    ],
    icon: FileText,
    link: "/nova-key",
    color: "#00D4FF",
  },
];

const publications = [
  {
    title: "The Source Code of Reality: Information-Theoretic Analysis of Likutey Moharan",
    venue: "Under Review — DH Sheffield 2026",
    date: "March 2026",
    status: "submitted",
  },
  {
    title: "Artificial Super Learning: A 613-Layer Cognitive Architecture for Knowledge Acquisition",
    venue: "Target — EAJS Congress 2026",
    date: "March 2026",
    status: "in-progress",
  },
  {
    title: "Zero-Knowledge Sacred Identity: Privacy-Preserving Authentication for Religious Communities",
    venue: "Target — IEEE S&P Workshop",
    date: "Q2 2026",
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
            Academic Research
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide">
            Research &{" "}
            <span className="sacred-gradient-text">Discovery</span>
          </h1>
          <p className="mt-4 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
            Dream Nova is not just a product company. We are pushing the boundaries of
            computational analysis of sacred texts, privacy-preserving identity systems,
            and cognitive architecture design.
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
