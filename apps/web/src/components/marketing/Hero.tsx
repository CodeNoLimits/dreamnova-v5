"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TERMINAL_LINES } from "@/lib/constants";

const terminalColorMap: Record<string, string> = {
  white: "text-white",
  gold: "text-[#D4AF37]",
  cyan: "text-[#00D4FF]",
  green: "text-emerald-400",
  yellow: "text-amber-400",
  dim: "text-white/10",
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Deep black base */}
      <div className="absolute inset-0 bg-[#020205]" />

      {/* SVG grid mesh background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.25]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(212,175,55,0.07)"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="hero-fade" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-mask">
            <rect width="100%" height="100%" fill="url(#hero-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hero-grid)"
          mask="url(#hero-mask)"
        />
      </svg>

      {/* Multi-layer gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,_rgba(212,175,55,0.1)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_80%,_rgba(0,212,255,0.06)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_60%,_rgba(212,175,55,0.04)_0%,_transparent_25%)]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-[8%] w-[700px] h-[700px] rounded-full bg-[#D4AF37]/[0.025] blur-[200px]"
        animate={{ x: [0, 60, 0], y: [0, -50, 0], scale: [1, 1.15, 1] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-[5%] w-[600px] h-[600px] rounded-full bg-[#00D4FF]/[0.025] blur-[180px]"
        animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020205] to-transparent z-[5]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left — Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                </span>
                <span className="font-mono text-[11px] text-[#D4AF37] tracking-[0.3em] uppercase">
                  Autonomous Defense Platform
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-cinzel font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] text-white leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: "easeOut" as const,
              }}
            >
              Cybersecurity
              <br />
              That{" "}
              <span className="relative inline-block">
                <span className="sacred-gradient-text">Evolves</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37]/60 via-[#00D4FF]/40 to-transparent" />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-8 font-rajdhani text-xl sm:text-2xl text-[#8888AA] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut" as const,
              }}
            >
              Four autonomous engines — polymorphic compilation, AI confinement,
              zero-knowledge proofs, and neural threat detection — working in
              concert.
              <span className="text-[#D4AF37] font-semibold">
                {" "}
                No human in the loop.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: "easeOut" as const,
              }}
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

            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex items-center gap-6 sm:gap-8 justify-center lg:justify-start flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: "easeOut" as const,
              }}
            >
              {[
                {
                  icon: Shield,
                  label: "7 Rust Crates",
                  sub: "Production-grade",
                },
                {
                  icon: Lock,
                  label: "zk-SNARK Verified",
                  sub: "Halo2 proofs",
                },
                {
                  icon: Zap,
                  label: "EU AI Act Ready",
                  sub: "Compliant",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/[0.08] border border-[#D4AF37]/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="block font-rajdhani text-sm text-white font-semibold leading-tight">
                      {label}
                    </span>
                    <span className="block font-mono text-[10px] text-[#8888AA]/60">
                      {sub}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Terminal */}
          <motion.div
            className="flex-shrink-0 w-full max-w-[560px]"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: "easeOut" as const,
            }}
          >
            <div className="relative group">
              {/* Glow behind */}
              <div className="absolute -inset-6 bg-gradient-to-br from-[#D4AF37]/[0.06] via-transparent to-[#00D4FF]/[0.06] rounded-3xl blur-3xl group-hover:from-[#D4AF37]/[0.1] group-hover:to-[#00D4FF]/[0.1] transition-all duration-700" />
              {/* Border gradient */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 via-[#00D4FF]/10 to-[#D4AF37]/20" />

              <div className="relative rounded-2xl overflow-hidden bg-[#080810]">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="font-mono text-[10px] text-white/20">
                      nova-cli v5.0.0 — shadow_deploy
                    </span>
                  </div>
                </div>

                {/* Terminal content */}
                <div className="p-5 sm:p-6 font-mono text-[11px] sm:text-xs leading-[1.9] min-h-[350px]">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.8,
                        },
                      },
                    }}
                  >
                    {TERMINAL_LINES.map((line, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, x: -8 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.3 },
                          },
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
                    className="inline-block w-2 h-5 bg-[#D4AF37]/60 mt-3"
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse" as const,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#D4AF37]/15 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-2.5 rounded-full bg-[#D4AF37]/30"
            animate={{ y: [0, 14, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
