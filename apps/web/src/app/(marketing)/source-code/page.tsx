"use client";

import { motion } from "framer-motion";
import { BookOpen, BarChart3, Sigma, Layers, ArrowRight, Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const findings = [
  {
    metric: "H(F) = 1.846 bits",
    label: "Information Entropy",
    description:
      "The Shannon entropy of Likutey Moharan's thematic frequency distribution places it in a statistically unique position among all analyzed sacred and philosophical texts.",
  },
  {
    metric: "613",
    label: "Structural Layers",
    description:
      "The text exhibits a 613-layer recursive structure that mirrors the traditional count of Torah commandments, suggesting deliberate architectural encoding.",
  },
  {
    metric: "185+",
    label: "Cross-References",
    description:
      "Each Torah (teaching) in Likutey Moharan contains an average of 185 cross-references to other sacred texts, creating a dense web of interconnected meaning.",
  },
  {
    metric: "0",
    label: "Prior Research",
    description:
      "No previous academic work has applied information-theoretic analysis to Breslov literature. This is a genuinely novel field of inquiry.",
  },
];

const comparisons = [
  { text: "Likutey Moharan", entropy: 1.846, color: "#D4AF37" },
  { text: "Zohar", entropy: 1.72, color: "#8888AA" },
  { text: "Talmud Bavli", entropy: 1.68, color: "#8888AA" },
  { text: "Torah (Pentateuch)", entropy: 1.54, color: "#8888AA" },
  { text: "Philosophical Texts (avg)", entropy: 1.42, color: "#8888AA" },
  { text: "Fiction (avg)", entropy: 1.31, color: "#8888AA" },
];

export default function SourceCodePage() {
  const maxEntropy = 2.0;

  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            Breakthrough Research
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-sacred-white tracking-wide leading-tight">
            The Source Code{" "}
            <span className="sacred-gradient-text">of Reality</span>
          </h1>
          <p className="mt-6 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
            An information-theoretic analysis revealing that Likutey Moharan contains a
            statistically anomalous encoding — a &quot;source code&quot; embedded in the structure
            of the text itself.
          </p>
        </motion.div>

        {/* Epigraph */}
        <motion.div
          className="max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" as const }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex gap-4">
              <Quote className="w-8 h-8 text-sacred-gold/30 shrink-0" />
              <div>
                <p className="font-sacred text-lg italic text-sacred-white/80 leading-relaxed">
                  &quot;Know that every shepherd has a unique melody according to the grasses
                  and the place where he grazes his flock. For every blade of grass has a
                  song that it sings — and from the songs of the grasses, the shepherd
                  creates his melody.&quot;
                </p>
                <p className="font-rajdhani text-sm text-sacred-gold/60 mt-3">
                  — Rabbi Nachman of Breslov, Likutey Moharan II:63
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Key findings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {findings.map((finding, index) => (
            <motion.div
              key={finding.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" as const }}
            >
              <Card variant="sacred" hover glow="gold" padding="md" className="h-full text-center">
                <p className="font-cinzel text-2xl text-sacred-gold mb-2">
                  {finding.metric}
                </p>
                <p className="font-rajdhani text-sm text-sacred-white font-semibold mb-3">
                  {finding.label}
                </p>
                <p className="font-rajdhani text-xs text-sacred-gray leading-relaxed">
                  {finding.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Entropy comparison chart */}
        <motion.div
          className="max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide text-center mb-8">
            Information Entropy Comparison
          </h2>
          <Card variant="sacred" padding="lg">
            <div className="space-y-4">
              {comparisons.map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" as const }}
                >
                  <span className="font-rajdhani text-sm text-sacred-gray w-44 shrink-0 text-right">
                    {item.text}
                  </span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.entropy / maxEntropy) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" as const }}
                    />
                  </div>
                  <span className="font-mono text-xs text-sacred-gray w-16 shrink-0">
                    {item.entropy.toFixed(3)}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Methodology */}
        <motion.div
          className="max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide text-center mb-8">
            Methodology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Corpus Analysis",
                description:
                  "Complete digital text of Likutey Moharan (282 Torot) analyzed with custom Hebrew NLP pipeline preserving root-word (shoresh) relationships and gematria values.",
              },
              {
                icon: Sigma,
                title: "Entropy Calculation",
                description:
                  "Shannon entropy H(X) = -Sum(p(x) * log2(p(x))) applied to thematic frequency distributions across multiple granularity levels, from word to paragraph to Torah.",
              },
              {
                icon: BarChart3,
                title: "Comparative Analysis",
                description:
                  "Results compared against a corpus of 50+ sacred, philosophical, and literary texts using identical preprocessing and measurement methodology for statistical validity.",
              },
            ].map((step, index) => (
              <Card key={step.title} variant="glass" padding="md">
                <step.icon className="w-8 h-8 text-sacred-cyan mb-4" />
                <h3 className="font-cinzel text-base text-sacred-white mb-2">{step.title}</h3>
                <p className="font-rajdhani text-xs text-sacred-gray leading-relaxed">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-rajdhani text-lg text-sacred-gray mb-6">
            Read the full paper and explore the data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              href="/whitepaper"
            >
              Read the Whitepaper
            </Button>
            <Button variant="outline" size="lg" href="/research">
              All Research
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
