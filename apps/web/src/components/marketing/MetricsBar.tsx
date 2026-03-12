"use client";

import { motion } from "framer-motion";
import { METRICS } from "@/lib/constants";
import { staggerFadeUp } from "@/lib/animations";

export function MetricsBar() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-section-bg)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.02] to-transparent" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="text-center p-8 rounded-2xl bg-white/[0.015] border border-white/[0.04] hover:border-[#D4AF37]/20 transition-all duration-500 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={staggerFadeUp(i)}
            >
              <p className="font-mono text-4xl sm:text-5xl font-bold text-[#D4AF37] group-hover:scale-105 transition-transform duration-300">
                {metric.value}
              </p>
              <p className="font-rajdhani text-base text-white mt-3 font-semibold">
                {metric.label}
              </p>
              {metric.sublabel && (
                <p className="font-mono text-[10px] text-[#8888AA]/40 mt-2 tracking-wide">
                  {metric.sublabel}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
