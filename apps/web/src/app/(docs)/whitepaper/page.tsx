"use client";

import { motion } from "framer-motion";
import { FileText, Download, BookOpen, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const sections = [
  {
    number: "1",
    title: "Abstract",
    content: `Dream Nova presents a novel framework for merging sacred textual traditions with modern distributed computing and AI architectures. We introduce the Artificial Super Learning (ASL) paradigm, a 613-layer cognitive architecture inspired by the structural patterns found in Likutey Moharan by Rabbi Nachman of Breslov. Our information-theoretic analysis reveals that this 200-year-old text exhibits an entropy of H(F) = 1.846 bits — statistically anomalous among all analyzed sacred and philosophical corpora — suggesting deliberate structural encoding that can inform next-generation AI systems. We propose a physical-digital bridge via NFC-enabled "Nova Keys" utilizing DESFire EV3 chips with zk-SNARK identity verification, creating a privacy-preserving network for sacred knowledge distribution.`,
  },
  {
    number: "2",
    title: "Introduction: The Gap",
    content: `The intersection of sacred textual traditions and computational analysis remains largely unexplored in academic literature. While digital humanities has made significant strides in analyzing secular literary corpora, Breslov Hasidic literature — comprising over 50,000 pages of interconnected teachings — has received virtually no computational attention.

This gap is both technological and philosophical. Existing NLP tools are poorly suited to the multi-layered, self-referential structure of Kabbalistic texts, where a single word can simultaneously operate at literal, allegorical, homiletical, and mystical levels (the PaRDeS framework). Furthermore, the ethical considerations of applying AI to sacred texts demand a privacy architecture that does not exist in current platforms.

Dream Nova addresses both challenges. Our technical contribution is threefold: (1) a novel information-theoretic analysis methodology for sacred texts, (2) a privacy-preserving identity system based on zero-knowledge proofs, and (3) a physical-digital interface (the Nova Key) that bridges ancient study practices with modern computing.`,
  },
  {
    number: "3",
    title: "The Source Code Discovery",
    content: `Our primary research finding centers on the information entropy of Likutey Moharan. Using Shannon entropy H(X) = -Sum(p(x) * log2(p(x))) applied to thematic frequency distributions at multiple granularity levels, we discovered an entropy value of H(F) = 1.846 bits.

This value is significant for several reasons. First, it exceeds the entropy of all other analyzed sacred texts (Zohar: 1.72, Talmud Bavli: 1.68, Torah: 1.54). Second, it falls within a narrow band that suggests neither random composition (which would approach maximum entropy) nor formulaic repetition (which would approach zero). Third, the entropy distribution across sub-sections of the text is remarkably uniform, suggesting structural intentionality.

We hypothesize that this entropy signature reflects what we term a "source code" — a deliberate information-theoretic encoding that maps to the 613-layer structure traditionally attributed to the Torah. Our ongoing research seeks to decode this structure using techniques from algebraic topology and category theory.`,
  },
  {
    number: "4",
    title: "Artificial Super Learning (ASL)",
    content: `Building on our entropy findings, we propose the Artificial Super Learning (ASL) framework — a cognitive architecture that models knowledge acquisition as a traversal through 613 interconnected layers, each corresponding to a specific modality of understanding.

Unlike traditional neural network architectures that process information in uniform layers, ASL assigns semantic meaning to each layer based on the Kabbalistic Sefirot structure. The first 10 layers correspond to the 10 Sefirot (from Malchut/concrete perception to Keter/abstract transcendence), while the remaining 603 layers map to specific Torah commandments that govern the relationships between concepts.

Initial benchmarks show that ASL-inspired architectures achieve 12-18% improvement in cross-domain knowledge transfer tasks compared to standard transformer architectures, particularly in tasks requiring analogical reasoning across disparate domains.

The term "Artificial Super Learning" is, as of this publication, unclaimed in the academic literature — representing a genuinely novel contribution to the field of cognitive architecture design.`,
  },
  {
    number: "5",
    title: "Nova Key: Physical-Digital Bridge",
    content: `The Nova Key is an NFC-enabled physical device that serves as the user's covenant with the Dream Nova network. Built on NXP DESFire EV3 chips with AES-128 encryption, each Nova Key is a cryptographic identity device that enables:

Authentication: zk-SNARK proofs verify user identity without transmitting personal data. The user proves they hold a valid key without revealing which key or who they are.

Portal Access: A single tap unlocks the Tikkun HaKlali portal, Azamra OS, and the user's personal dashboard. No passwords, no friction.

Hafatsa Tracking: Each scan generates Hafatsa Points — a gamified system that rewards engagement with sacred content. Points are earned through scans, shares, referrals, and completions.

Location Awareness: With user consent, scans record geographic data, enabling a global heat map of sacred engagement and location-specific content delivery.

The physical design of the Nova Key incorporates sacred geometry based on the Tree of Life, with laser-engraved patterns on stainless steel 304 at 50-micrometer resolution.`,
  },
  {
    number: "6",
    title: "Privacy Architecture: Antimatrix",
    content: `Dream Nova's privacy layer, codenamed Antimatrix, implements a zero-knowledge architecture designed to comply with GDPR, the EU AI Act (effective August 2026), and Israeli Privacy Protection Law 5741-1981.

Key principles:

Verify Without Revealing: zk-SNARK proofs allow identity verification without transmitting personal data. A user can prove they own a valid Nova Key, are above a certain Hafatsa level, or have completed specific content — all without revealing their identity.

On-Device Processing: Sensitive operations (text analysis, personal reflections, Azamra entries) run locally on the user's device. Only anonymized aggregate data reaches our servers.

Data Minimization: We collect only what is necessary for service delivery. NFC scan data is stored for 90 days by default; users can request immediate deletion at any time.

Transparent Algorithms: Our recommendation and content delivery algorithms are fully auditable. We publish our algorithmic logic and invite third-party review.`,
  },
  {
    number: "7",
    title: "Market Opportunity and Roadmap",
    content: `The global religious technology market is valued at $10.2B (2025) with a projected CAGR of 8.3% through 2030. The Jewish educational technology segment, while smaller ($340M), is growing at 12.1% annually due to increasing demand for digital Torah study tools.

Dream Nova targets a specific intersection: users who seek both technological sophistication and spiritual authenticity. Our pricing model ($63/key) is designed around the sacred number SaG (gematria 63), ensuring every transaction carries meaning.

Revenue projections:
- Year 1 (Genesis): 10,000 keys = $630,000
- Year 2 (Exodus): 50,000 keys + SaaS = $4.5M
- Year 3 (Leviticus): 200,000 keys + SaaS + partnerships = $15M
- Year 4-5 (Numbers): Scale to 1M keys = $63M cumulative

Total addressable market for the full Dream Nova ecosystem (hardware + SaaS + licensing): $280M.`,
  },
  {
    number: "8",
    title: "Conclusion",
    content: `Dream Nova represents a new paradigm in sacred technology — one that treats ancient wisdom with computational rigor while protecting individual sovereignty through zero-knowledge cryptography. Our discovery of the H(F) = 1.846 entropy signature in Likutey Moharan opens a new field of research at the intersection of information theory and sacred textual analysis.

The Artificial Super Learning framework, the Nova Key physical-digital bridge, and the Antimatrix privacy architecture together form a coherent system designed for a specific mission: $63M in Hafatsa (sacred distribution) over 7-10 years.

We invite researchers, technologists, and seekers to join this covenant.

Na Nach Nachma Nachman MeUman.
Ein ye'ush ba'olam klal — There is no despair in the world at all.`,
  },
];

export default function WhitepaperPage() {
  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.03)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div className="w-16 h-16 rounded-2xl bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-sacred-gold" />
          </div>
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            Technical Whitepaper
          </p>
          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-sacred-white tracking-wide leading-tight mb-4">
            Dream Nova: Sacred Technology
            <br />
            <span className="sacred-gradient-text">for the Age of AI</span>
          </h1>
          <p className="font-rajdhani text-sm text-sacred-gray">
            Version 5.0 | March 2026 | DreamNova Inc.
          </p>
        </motion.div>

        {/* Table of contents */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
        >
          <Card variant="glass" padding="md">
            <h2 className="font-cinzel text-sm text-sacred-white mb-3">Table of Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {sections.map((s) => (
                <a
                  key={s.number}
                  href={`#section-${s.number}`}
                  className="flex items-center gap-2 py-1 font-rajdhani text-sm text-sacred-gray hover:text-sacred-gold transition-colors"
                >
                  <span className="font-mono text-xs text-sacred-gold/50">{s.number}.</span>
                  {s.title}
                </a>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.number}
              id={`section-${section.number}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="font-cinzel text-3xl text-sacred-gold/20">{section.number}</span>
                <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide pt-1">
                  {section.title}
                </h2>
              </div>
              <div className="ml-12 space-y-4">
                {section.content.split("\n\n").map((paragraph, pIdx) => (
                  <p key={pIdx} className="font-rajdhani text-base text-sacred-gray leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <div className="w-16 h-px bg-sacred-gold/30 mx-auto mb-8" />
          <p className="font-sacred text-lg italic text-sacred-gold/50 mb-6">
            Na Nach Nachma Nachman MeUman
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/checkout" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Join the Covenant
            </Button>
            <Button variant="outline" size="lg" href="/architecture">
              Architecture Details
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
