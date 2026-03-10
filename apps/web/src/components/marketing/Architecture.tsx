"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PHASES } from "@/lib/constants";

const statusColors = {
  completed: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  active: { bg: "bg-sacred-gold/10", text: "text-sacred-gold", border: "border-sacred-gold/30" },
  upcoming: { bg: "bg-sacred-gray/10", text: "text-sacred-gray", border: "border-white/10" },
};

export function Architecture() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.02)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            Roadmap
          </p>
          <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl lg:text-5xl text-sacred-white tracking-tight">
            From{" "}
            <span className="bg-gradient-to-r from-sacred-gold to-sacred-cyan bg-clip-text text-transparent">
              Prototype
            </span>{" "}
            to Platform Standard
          </h2>
          <p className="mt-4 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
            Five phases. Each builds on proven cryptographic primitives and
            real-world enterprise deployments. No vaporware — every milestone
            has shipped code behind it.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sacred-gold/30 via-sacred-cyan/20 to-transparent" />

          <div className="space-y-8 lg:space-y-12">
            {PHASES.map((phase, index) => {
              const status = statusColors[phase.status];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={phase.number}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut" as const,
                  }}
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-8 h-8 rounded-full ${status.bg} ${status.border} border flex items-center justify-center`}
                    >
                      <span className={`font-mono text-xs font-bold ${status.text}`}>
                        {phase.number}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`ml-14 md:ml-0 md:w-[45%] ${
                      isEven ? "md:pr-8" : "md:pl-8"
                    }`}
                  >
                    <div
                      className={`p-6 rounded-2xl bg-sacred-black-medium border ${status.border} hover:border-sacred-gold/30 transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider ${status.bg} ${status.text}`}
                        >
                          {phase.status}
                        </span>
                        <span className="font-mono text-xs text-sacred-gray/50">
                          {phase.timeline}
                        </span>
                      </div>

                      <h3 className="font-rajdhani font-bold text-xl text-sacred-white tracking-tight mb-2">
                        {phase.name}
                      </h3>
                      <p className="font-rajdhani text-sm text-sacred-gray mb-4">
                        {phase.description}
                      </p>

                      <ul className="space-y-2">
                        {phase.milestones.map((milestone) => (
                          <li key={milestone} className="flex items-start gap-2">
                            <span
                              className={`w-1 h-1 rounded-full mt-2 shrink-0 ${
                                phase.status === "active"
                                  ? "bg-sacred-gold"
                                  : "bg-sacred-gray/30"
                              }`}
                            />
                            <span className="font-rajdhani text-xs text-sacred-gray/70">
                              {milestone}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="hidden md:block md:w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <Button
            variant="outline"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            href="/architecture"
          >
            Full Architecture Deep-Dive
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
