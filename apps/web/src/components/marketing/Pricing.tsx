"use client";

import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PRICING_TIERS } from "@/lib/constants";

export function Pricing() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,212,255,0.04)_0%,_transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-cyan tracking-[0.3em] uppercase mb-4">
            The Covenant
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-sacred-white tracking-wide">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-sacred-gold to-sacred-cyan bg-clip-text text-transparent">
              Path
            </span>
          </h2>
          <p className="mt-4 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
            Every Nova Key is a covenant. A sacred agreement between you and the network.
            Each price carries a gematria — nothing is arbitrary.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PRICING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut" as const,
              }}
              className={tier.popular ? "md:-mt-4 md:mb-4" : ""}
            >
              <Card
                variant="sacred"
                hover
                glow={tier.popular ? "gold" : "none"}
                padding="none"
                className={`h-full relative ${
                  tier.popular ? "border-sacred-gold/40" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-sacred-gold text-sacred-black">
                      <Star className="w-3 h-3" />
                      <span className="font-rajdhani text-xs font-bold tracking-wider uppercase">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 lg:p-8">
                  <div className="mb-6">
                    <h3 className="font-cinzel text-lg text-sacred-white tracking-wide">
                      {tier.name}
                    </h3>
                    <p className="font-rajdhani text-sm text-sacred-gray mt-1">
                      {tier.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-cinzel text-4xl text-sacred-gold">
                      ${tier.price}
                    </span>
                    <span className="font-rajdhani text-sm text-sacred-gray">
                      /{tier.currency}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-8">
                    <span className="font-mono text-xs text-sacred-gold/50">
                      {tier.sacredNumber.value} = {tier.sacredNumber.hebrew}
                    </span>
                    <span className="font-rajdhani text-xs text-sacred-gray/50">
                      ({tier.sacredNumber.name})
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            tier.popular ? "text-sacred-gold" : "text-sacred-cyan/60"
                          }`}
                        />
                        <span className="font-rajdhani text-sm text-sacred-gray">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={tier.popular ? "primary" : "outline"}
                    fullWidth
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    href="/checkout"
                  >
                    {tier.popular ? "Get Started" : "Choose Plan"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
