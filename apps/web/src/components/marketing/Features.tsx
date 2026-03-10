"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Coins, Server } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PILLARS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Brain,
  Shield,
  Coins,
  Server,
};

export function Features() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            The Four Pillars
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-sacred-white tracking-wide">
            Sacred{" "}
            <span className="bg-gradient-to-r from-sacred-gold to-sacred-cyan bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
          <p className="mt-4 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
            Four pillars form the foundation of Dream Nova. Each one essential,
            each one sacred, each one engineered for the mission ahead.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = iconMap[pillar.icon];
            const isGold = pillar.color === "#D4AF37";

            return (
              <motion.div
                key={pillar.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut" as const,
                }}
              >
                <Card
                  variant="sacred"
                  hover
                  glow={isGold ? "gold" : "cyan"}
                  padding="lg"
                  className="h-full"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${pillar.color}15`,
                        border: `1px solid ${pillar.color}30`,
                      }}
                    >
                      {Icon && (
                        <Icon
                          className="w-6 h-6"
                          style={{ color: pillar.color }}
                        />
                      )}
                    </div>
                    <div>
                      <h3
                        className="font-cinzel text-xl tracking-wide"
                        style={{ color: pillar.color }}
                      >
                        {pillar.name}
                      </h3>
                      <p className="font-rajdhani text-sm text-sacred-gray mt-1 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className="w-1 h-1 rounded-full mt-2.5 shrink-0"
                          style={{ backgroundColor: pillar.color }}
                        />
                        <span className="font-rajdhani text-sm text-sacred-gray/80">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
