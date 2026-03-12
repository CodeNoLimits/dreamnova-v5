"use client";

import { motion } from "framer-motion";
import { fadeUpTransition, easeOut } from "@/lib/animations";

export function SystemDiagram() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-section-bg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={fadeUpTransition(0)}
        >
          <p className="font-mono text-xs text-[#00D4FF] tracking-[0.4em] uppercase mb-6">
            System Architecture
          </p>
          <h2 className="font-cinzel font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            How the{" "}
            <span className="sacred-gradient-text">Four Engines</span>{" "}
            Connect
          </h2>
          <p className="mt-6 font-rajdhani text-lg text-[#8888AA] max-w-3xl mx-auto">
            A single Rust-native core orchestrates four autonomous engines.
            Every connection is cryptographically verified. Every state
            transition is logged to an immutable DAG-UTXO ledger.
          </p>
        </motion.div>

        {/* SVG Architecture Diagram */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <svg
            viewBox="0 0 900 620"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Merged single glow filter — replaces duplicate glow-g and glow-c */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="conn-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="conn-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Connection lines — behind everything */}
            {/* Core → Evolutrix (top) */}
            <line
              x1="450"
              y1="270"
              x2="450"
              y2="135"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeDasharray="8 5"
              opacity="0.25"
              className="animate-dash-flow"
            />
            {/* Core → Antimatrix (right) */}
            <line
              x1="490"
              y1="310"
              x2="660"
              y2="310"
              stroke="#00D4FF"
              strokeWidth="1.5"
              strokeDasharray="8 5"
              opacity="0.25"
              className="animate-dash-flow"
              style={{ animationDelay: "0.75s" }}
            />
            {/* Core → Tzimtzum (bottom) */}
            <line
              x1="450"
              y1="350"
              x2="450"
              y2="485"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeDasharray="8 5"
              opacity="0.25"
              className="animate-dash-flow"
              style={{ animationDelay: "1.5s" }}
            />
            {/* Core → Esther AI (left) */}
            <line
              x1="410"
              y1="310"
              x2="240"
              y2="310"
              stroke="#00D4FF"
              strokeWidth="1.5"
              strokeDasharray="8 5"
              opacity="0.25"
              className="animate-dash-flow"
              style={{ animationDelay: "2.25s" }}
            />

            {/* Cross connections — subtle */}
            <line x1="320" y1="155" x2="200" y2="270" stroke="white" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.06" />
            <line x1="580" y1="155" x2="700" y2="270" stroke="white" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.06" />
            <line x1="320" y1="465" x2="200" y2="350" stroke="white" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.06" />
            <line x1="580" y1="465" x2="700" y2="350" stroke="white" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.06" />

            {/* ═══ NOVA CORE (center) ═══ */}
            <g filter="url(#glow)">
              <circle cx="450" cy="310" r="60" fill="#D4AF37" fillOpacity="0.03" stroke="#D4AF37" strokeWidth="2" opacity="0.7" />
              <circle cx="450" cy="310" r="48" fill="#D4AF37" fillOpacity="0.02" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
              {/* Rotating ring */}
              <circle
                cx="450"
                cy="310"
                r="72"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.8"
                strokeDasharray="12 6"
                opacity="0.2"
                className="animate-orbit-ring"
                style={{ transformOrigin: "450px 310px" }}
              />
            </g>
            <text x="450" y="302" fill="#D4AF37" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="serif">
              NOVA
            </text>
            <text x="450" y="322" fill="#D4AF37" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="serif">
              CORE
            </text>
            <text x="450" y="342" fill="#8888AA" textAnchor="middle" fontSize="9" fontFamily="monospace" opacity="0.4">
              NovaMorph Engine
            </text>

            {/* ═══ EVOLUTRIX (top) ═══ */}
            <g filter="url(#glow)">
              <circle cx="450" cy="100" r="45" fill="#D4AF37" fillOpacity="0.04" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
            </g>
            <text x="450" y="95" fill="#D4AF37" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="serif">
              EVOLUTRIX
            </text>
            <text x="450" y="113" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.5">
              Polymorphic Compiler
            </text>
            <text x="450" y="55" fill="#D4AF37" textAnchor="middle" fontSize="9" fontFamily="monospace" opacity="0.35">
              10^18 configs/cycle
            </text>

            {/* ═══ ANTIMATRIX (right) ═══ */}
            <g filter="url(#glow)">
              <circle cx="720" cy="310" r="45" fill="#00D4FF" fillOpacity="0.04" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
            </g>
            <text x="720" y="305" fill="#00D4FF" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="serif">
              ANTIMATRIX
            </text>
            <text x="720" y="323" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.5">
              AI Hypervisor
            </text>
            <text x="820" y="310" fill="#00D4FF" textAnchor="middle" fontSize="9" fontFamily="monospace" opacity="0.35">
              6 Levels
            </text>

            {/* ═══ TZIMTZUM (bottom) ═══ */}
            <g filter="url(#glow)">
              <circle cx="450" cy="520" r="45" fill="#D4AF37" fillOpacity="0.04" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
            </g>
            <text x="450" y="515" fill="#D4AF37" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="serif">
              TZIMTZUM
            </text>
            <text x="450" y="533" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.5">
              zk-SNARK Engine
            </text>
            <text x="450" y="575" fill="#D4AF37" textAnchor="middle" fontSize="9" fontFamily="monospace" opacity="0.35">
              {"< 50ms proof gen"}
            </text>

            {/* ═══ ESTHER AI (left) ═══ */}
            <g filter="url(#glow)">
              <circle cx="180" cy="310" r="45" fill="#00D4FF" fillOpacity="0.04" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
            </g>
            <text x="180" y="305" fill="#00D4FF" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="serif">
              ESTHER AI
            </text>
            <text x="180" y="323" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.5">
              Threat Intelligence
            </text>
            <text x="80" y="310" fill="#00D4FF" textAnchor="middle" fontSize="9" fontFamily="monospace" opacity="0.35">
              H(F) = 1.846
            </text>

            {/* ═══ Supporting Components (bottom corners) ═══ */}
            <rect x="120" y="450" width="110" height="32" rx="8" fill="none" stroke="#8888AA" strokeWidth="0.5" opacity="0.15" />
            <text x="175" y="470" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.3">
              VDF Time-Lock
            </text>

            <rect x="670" y="450" width="110" height="32" rx="8" fill="none" stroke="#8888AA" strokeWidth="0.5" opacity="0.15" />
            <text x="725" y="470" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.3">
              NFC-Bridge HAL
            </text>

            <rect x="120" y="140" width="110" height="32" rx="8" fill="none" stroke="#8888AA" strokeWidth="0.5" opacity="0.15" />
            <text x="175" y="160" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.3">
              DAG-UTXO Ledger
            </text>

            <rect x="670" y="140" width="110" height="32" rx="8" fill="none" stroke="#8888AA" strokeWidth="0.5" opacity="0.15" />
            <text x="725" y="160" fill="#8888AA" textAnchor="middle" fontSize="8" fontFamily="monospace" opacity="0.3">
              PoSH Consensus
            </text>

            {/* Data flow arrows — animated dots along connection paths */}
            <circle r="3" fill="#D4AF37" opacity="0.7">
              <animateMotion dur="3s" repeatCount="indefinite" path="M450,270 L450,135" />
            </circle>
            <circle r="3" fill="#00D4FF" opacity="0.7">
              <animateMotion dur="3s" repeatCount="indefinite" path="M490,310 L660,310" begin="0.75s" />
            </circle>
            <circle r="3" fill="#D4AF37" opacity="0.7">
              <animateMotion dur="3s" repeatCount="indefinite" path="M450,350 L450,485" begin="1.5s" />
            </circle>
            <circle r="3" fill="#00D4FF" opacity="0.7">
              <animateMotion dur="3s" repeatCount="indefinite" path="M410,310 L240,310" begin="2.25s" />
            </circle>
          </svg>
        </motion.div>

        {/* Architecture specs below diagram */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
        >
          {[
            { label: "Engines", value: "4", desc: "Autonomous" },
            { label: "Crates", value: "7", desc: "Rust-native" },
            { label: "Tests", value: "54", desc: "Verified" },
            { label: "Data Exposed", value: "0", desc: "zk-Architecture" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]"
            >
              <p className="font-mono text-2xl font-bold text-[#D4AF37]">
                {stat.value}
              </p>
              <p className="font-rajdhani text-sm text-white mt-1 font-semibold">
                {stat.label}
              </p>
              <p className="font-mono text-[9px] text-[#8888AA]/40 mt-1">
                {stat.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
