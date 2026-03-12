"use client";

import { motion } from "framer-motion";
import { RUST_CODE } from "@/lib/constants";
import { easeOut } from "@/lib/animations";

export function CodeShowcase() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-section-bg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(0,212,255,0.03)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left — Text */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <p className="font-mono text-xs text-[#00D4FF] tracking-[0.4em] uppercase mb-6">
              Open Source
            </p>
            <h2 className="font-cinzel font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Not Slides.{" "}
              <span className="sacred-gradient-text">Shipped Code.</span>
            </h2>
            <p className="mt-6 font-rajdhani text-lg text-[#8888AA] max-w-lg leading-relaxed">
              Every claim has compiled, tested code behind it. The Evolutrix
              mutator shown here is real production code from our Rust
              workspace — not a prototype, not a mockup.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 max-w-sm">
              {[
                { label: "Rust Crates", value: "7" },
                { label: "Verified Tests", value: "54" },
                { label: "Lines of Code", value: "8,000+" },
                { label: "Dependencies", value: "Minimal" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="block font-mono text-2xl text-[#D4AF37] font-bold">
                    {stat.value}
                  </span>
                  <span className="block font-rajdhani text-sm text-[#8888AA]/50 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="https://github.com/CodeNoLimits/dreamnova-v5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-[#00D4FF] hover:text-[#33DDFF] transition-colors"
              >
                View on GitHub &rarr;
              </a>
            </div>
          </motion.div>

          {/* Right — Code block */}
          <motion.div
            className="flex-shrink-0 w-full max-w-[560px]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: easeOut,
            }}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#D4AF37]/[0.04] to-[#00D4FF]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-[#00D4FF]/10" />

              <div className="relative rounded-2xl overflow-hidden bg-[#080810]">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.04]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/70" />
                  </div>
                  <span className="font-mono text-[10px] text-white/20 ml-2">
                    crates/evolutrix/src/mutator.rs
                  </span>
                  <span className="ml-auto font-mono text-[9px] text-[#D4AF37]/40 px-2 py-0.5 rounded bg-[#D4AF37]/[0.06]">
                    RUST
                  </span>
                </div>
                <pre className="p-6 font-mono text-[11px] sm:text-xs leading-[1.9] overflow-x-auto">
                  <code className="text-[#8888AA]">
                    {RUST_CODE.split("\n").map((line, i) => {
                      let className = "text-[#8888AA]/70";
                      if (line.includes("//"))
                        className = "text-[#8888AA]/35 italic";
                      if (line.includes("pub fn") || line.includes("impl"))
                        className = "text-[#00D4FF]";
                      if (line.includes("self.")) className = "text-[#D4AF37]";
                      if (line.includes("let "))
                        className = "text-[#00D4FF]/80";
                      if (line.includes("DecoyStrategy"))
                        className = "text-[#D4AF37]";
                      return (
                        <span key={i} className={`block ${className}`}>
                          {line}
                        </span>
                      );
                    })}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
