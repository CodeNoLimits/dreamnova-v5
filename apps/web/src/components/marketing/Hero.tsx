"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TERMINAL_LINES } from "@/lib/constants";

const terminalColorMap: Record<string, string> = {
  white: "text-sacred-white",
  gold: "text-sacred-gold",
  cyan: "text-sacred-cyan",
  green: "text-green-400",
  yellow: "text-yellow-400",
  dim: "text-sacred-gray/20",
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,212,255,0.04)_0%,_transparent_40%)]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full bg-sacred-gold/[0.03] blur-[150px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div
        className="absolute bottom-1/4 right-[15%] w-[400px] h-[400px] rounded-full bg-sacred-cyan/[0.03] blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" as const }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sacred-gold/20 bg-sacred-gold/5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-sacred-gold animate-pulse" />
                <span className="font-mono text-xs text-sacred-gold tracking-wider uppercase">
                  Autonomous Defense Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="font-rajdhani font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-sacred-white leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
            >
              Cybersecurity That{" "}
              <span className="bg-gradient-to-r from-sacred-gold via-sacred-cyan to-sacred-gold bg-clip-text text-transparent bg-[length:200%_100%] animate-gold-shimmer">
                Evolves Faster
              </span>{" "}
              Than The Threat
            </motion.h1>

            <motion.p
              className="mt-6 font-rajdhani text-lg sm:text-xl text-sacred-gray leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
            >
              Dream Nova V5 deploys self-mutating polymorphic defense,
              zero-knowledge verification, and autonomous AI threat response.
              One platform. Zero compromise.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                href="/contact"
              >
                Request Shadow Mode Demo
              </Button>
              <Button variant="outline" size="lg" href="/whitepaper">
                Read the Whitepaper
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 flex items-center gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" as const }}
            >
              {[
                { icon: Shield, label: "Rust-Native" },
                { icon: Lock, label: "SOC 2 Ready" },
                { icon: Zap, label: "EU AI Act Compliant" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sacred-gray/50">
                  <Icon className="w-3.5 h-3.5 text-sacred-gold/50" />
                  <span className="font-mono text-[11px] tracking-wide">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Terminal */}
          <motion.div
            className="flex-shrink-0 w-full max-w-[520px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
          >
            <div className="relative group">
              <div className="absolute -inset-3 bg-sacred-gold/5 rounded-2xl blur-2xl group-hover:bg-sacred-gold/8 transition-all duration-700" />

              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0C0C14]">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="font-mono text-[11px] text-sacred-gray/40 ml-2">
                    nova-cli — shadow_deploy
                  </span>
                </div>

                {/* Terminal content */}
                <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed min-h-[320px]">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.12, delayChildren: 0.8 },
                      },
                    }}
                  >
                    {TERMINAL_LINES.map((line, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, x: -8 },
                          visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                        }}
                        className={`${terminalColorMap[line.color]} ${
                          line.text === "" ? "h-3" : ""
                        }`}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.span
                    className="inline-block w-2 h-4 bg-sacred-gold/60 mt-2"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" as const }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <div className="w-5 h-8 rounded-full border border-sacred-gold/20 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-sacred-gold/40"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
          />
        </div>
      </motion.div>
    </section>
  );
}
