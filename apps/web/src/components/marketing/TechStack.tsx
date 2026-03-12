"use client";

import { motion } from "framer-motion";
import { easeOut } from "@/lib/animations";

const crates = [
  {
    name: "evolutrix",
    desc: "Polymorphic AST mutation & compilation",
    lines: "2,400+",
    tests: 18,
    color: "#D4AF37",
    deps: ["nova-morph", "vdf"],
  },
  {
    name: "antimatrix",
    desc: "AI confinement hypervisor with Z3 verification",
    lines: "1,800+",
    tests: 12,
    color: "#00D4FF",
    deps: ["evolutrix"],
  },
  {
    name: "tzimtzum",
    desc: "Halo2 zk-SNARK proofs & Merkle verification",
    lines: "1,600+",
    tests: 14,
    color: "#D4AF37",
    deps: ["vdf", "nfc-bridge"],
  },
  {
    name: "nova-morph",
    desc: "Arena allocation with bumpalo O(1) AST mutation",
    lines: "800+",
    tests: 4,
    color: "#8888AA",
    deps: [],
  },
  {
    name: "vdf",
    desc: "Verifiable Delay Functions for time-barriers",
    lines: "600+",
    tests: 3,
    color: "#8888AA",
    deps: [],
  },
  {
    name: "nfc-bridge",
    desc: "NFC hardware abstraction layer (DESFire EV3)",
    lines: "500+",
    tests: 2,
    color: "#8888AA",
    deps: [],
  },
  {
    name: "dag-ledger",
    desc: "DAG-based immutable transaction log with PoSH",
    lines: "700+",
    tests: 1,
    color: "#D4AF37",
    deps: ["vdf"],
  },
];

export function TechStack() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-section-bg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,212,255,0.03)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <p className="font-mono text-xs text-[#D4AF37] tracking-[0.4em] uppercase mb-6">
            Rust-Native Foundation
          </p>
          <h2 className="font-cinzel font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            7 Crates.{" "}
            <span className="sacred-gradient-text">8,000+ Lines.</span>{" "}
            54 Tests.
          </h2>
          <p className="mt-6 font-rajdhani text-lg text-[#8888AA] max-w-2xl mx-auto">
            Every claim in our whitepaper has compiled, tested Rust code behind
            it. Not slides. Not mockups. Production-grade cryptographic
            primitives.
          </p>
        </motion.div>

        {/* Crate grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {crates.map((crate, i) => (
            <motion.div
              key={crate.name}
              className="group relative p-6 rounded-2xl bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: easeOut,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${crate.color}15, transparent)`,
                }}
              />

              <div className="relative">
                {/* Crate name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: `${crate.color}30`,
                      border: `1px solid ${crate.color}50`,
                    }}
                  />
                  <code
                    className="font-mono text-sm font-bold"
                    style={{ color: crate.color }}
                  >
                    {crate.name}
                  </code>
                </div>

                {/* Description */}
                <p className="font-rajdhani text-sm text-[#8888AA]/70 mb-4 leading-relaxed">
                  {crate.desc}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-[#8888AA]/40">
                      LOC:
                    </span>
                    <span className="font-mono text-xs text-white/70 font-bold">
                      {crate.lines}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-[#8888AA]/40">
                      Tests:
                    </span>
                    <span className="font-mono text-xs text-emerald-400/80 font-bold">
                      {crate.tests}
                    </span>
                  </div>
                </div>

                {/* Dependencies */}
                {crate.deps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.03]">
                    <span className="font-mono text-[9px] text-[#8888AA]/30 uppercase tracking-wider">
                      deps:{" "}
                    </span>
                    {crate.deps.map((dep) => (
                      <span
                        key={dep}
                        className="inline-block font-mono text-[10px] text-[#8888AA]/40 mr-2"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Python Esther AI card — spans full width on last row */}
          <motion.div
            className="group relative p-6 rounded-2xl bg-white/[0.015] border border-[#00D4FF]/[0.08] hover:border-[#00D4FF]/15 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.56,
              ease: easeOut,
            }}
          >
            <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#00D4FF]/[0.06] to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-sm bg-[#00D4FF]/30 border border-[#00D4FF]/50" />
                <code className="font-mono text-sm font-bold text-[#00D4FF]">
                  python/esther
                </code>
                <span className="ml-auto font-mono text-[9px] text-[#00D4FF]/40 px-2 py-0.5 rounded bg-[#00D4FF]/[0.06]">
                  MLX / Apple Silicon
                </span>
              </div>
              <p className="font-rajdhani text-sm text-[#8888AA]/70 mb-4 leading-relaxed">
                Shannon entropy derivatives + GNN anomaly detection with Metal
                GPU acceleration
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-[#8888AA]/40">
                    LOC:
                  </span>
                  <span className="font-mono text-xs text-white/70 font-bold">
                    1,200+
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-[#8888AA]/40">
                    Tests:
                  </span>
                  <span className="font-mono text-xs text-emerald-400/80 font-bold">
                    10
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-[#8888AA]/40">
                    Modules:
                  </span>
                  <span className="font-mono text-xs text-white/70 font-bold">
                    entropy, gnn, monitor, config
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Compilation stats */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: easeOut }}
        >
          <p className="font-mono text-[11px] text-[#8888AA]/30">
            cargo build --release &bull; 0 warnings &bull; 54/54 tests pass
            &bull; edition 2024 &bull; resolver v3
          </p>
        </motion.div>
      </div>
    </section>
  );
}
