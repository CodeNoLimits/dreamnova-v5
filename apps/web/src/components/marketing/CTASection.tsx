"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { easeOut } from "@/lib/animations";

export function CTASection() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-section-bg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <p className="font-mono text-xs text-[#D4AF37] tracking-[0.4em] uppercase mb-6">
            Get Started
          </p>
          <h2 className="font-cinzel font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Deploy{" "}
            <span className="sacred-gradient-text">Autonomous Defense</span>
          </h2>
          <p className="mt-8 font-rajdhani text-xl text-[#8888AA] max-w-2xl mx-auto leading-relaxed">
            Request a 14-day Shadow Mode evaluation. The platform deploys
            alongside your existing infrastructure — zero disruption, zero data
            exposure. See what your current tools are missing.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4AF37] text-[#050508] font-rajdhani font-bold text-lg rounded-2xl hover:bg-[#E8C960] transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-[0_0_60px_rgba(212,175,55,0.35)]"
            >
              Request Shadow Mode Demo
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/whitepaper"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-[#D4AF37]/25 text-[#D4AF37] font-rajdhani font-semibold text-lg rounded-2xl hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all"
            >
              Download Whitepaper
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-20 grid grid-cols-3 gap-10 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: easeOut,
          }}
        >
          {[
            { value: "7", label: "Rust Crates" },
            { value: "< 5ms", label: "Proof Verification" },
            { value: "0", label: "Data Exposed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-3xl text-[#D4AF37] font-bold">
                {stat.value}
              </p>
              <p className="font-rajdhani text-sm text-[#8888AA]/60 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
