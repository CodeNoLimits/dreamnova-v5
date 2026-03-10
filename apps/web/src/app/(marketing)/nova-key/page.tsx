"use client";

import { motion } from "framer-motion";
import {
  Nfc, Shield, Zap, Layers, Fingerprint, Globe, Lock, Cpu,
  Check, ArrowRight, Smartphone, Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SACRED_NUMBERS } from "@/lib/constants";

const specs = [
  { icon: Nfc, label: "NFC Type", value: "NXP DESFire EV3" },
  { icon: Lock, label: "Security", value: "AES-128 encryption" },
  { icon: Cpu, label: "Memory", value: "8KB EEPROM" },
  { icon: Wifi, label: "Range", value: "Up to 10cm" },
  { icon: Smartphone, label: "Compatible", value: "iOS 15+ / Android 10+" },
  { icon: Layers, label: "Material", value: "Stainless Steel 304" },
];

const features = [
  {
    icon: Shield,
    title: "zk-SNARK Identity",
    description:
      "Zero-knowledge proofs verify your identity without revealing personal data. Your spiritual journey stays sovereign. No surveillance, no data harvesting.",
  },
  {
    icon: Fingerprint,
    title: "Biometric Binding",
    description:
      "Each Nova Key is cryptographically bound to its owner. Lost keys can be remotely deactivated and reissued to a new card without losing your Hafatsa progress.",
  },
  {
    icon: Globe,
    title: "Global NFC Network",
    description:
      "Tap your Nova Key at any participating location worldwide. Synagogues, study halls, events — each scan earns Hafatsa points and unlocks location-specific content.",
  },
  {
    icon: Zap,
    title: "Instant Portal Access",
    description:
      "One tap unlocks the Tikkun HaKlali portal, Azamra OS, and your personal dashboard. No passwords, no friction, no barriers between you and the sacred.",
  },
];

const covenantIncludes = [
  "1x Nova Key NFC Card (DESFire EV3, stainless steel)",
  "Sacred geometry laser engraving (both sides)",
  "Protective carrying sleeve with gold foil",
  "Welcome letter with activation instructions",
  "Lifetime access to Tikkun HaKlali portal",
  "Azamra OS license (all platforms)",
  "Entry into the Hafatsa Point system",
  "Priority access to new features and content",
];

export default function NovaKeyPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
            >
              <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
                The Sacred Key
              </p>
              <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-sacred-white tracking-wide leading-tight">
                Nova{" "}
                <span className="bg-gradient-to-r from-sacred-gold to-sacred-cyan bg-clip-text text-transparent">
                  Key
                </span>
              </h1>
              <p className="mt-6 font-rajdhani text-lg text-sacred-gray leading-relaxed max-w-lg">
                More than an NFC card. The Nova Key is your covenant with the network.
                A physical key to digital transcendence. Engineered with DESFire EV3
                security, engraved with sacred geometry, built to last generations.
              </p>
              <div className="mt-8 flex items-baseline gap-3">
                <span className="font-cinzel text-5xl text-sacred-gold">
                  ${SACRED_NUMBERS.SAG.value}
                </span>
                <div>
                  <span className="font-mono text-sm text-sacred-gray">/covenant</span>
                  <p className="font-mono text-xs text-sacred-gold/50">
                    {SACRED_NUMBERS.SAG.value} = {SACRED_NUMBERS.SAG.hebrew} (
                    {SACRED_NUMBERS.SAG.name})
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  href="/checkout"
                >
                  Order Now
                </Button>
                <Button variant="outline" size="lg" href="#specs">
                  View Specs
                </Button>
              </div>
            </motion.div>

            {/* Card visualization */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" as const }}
            >
              <div className="relative" style={{ perspective: "1200px" }}>
                <div className="absolute -inset-8 bg-sacred-gold/10 rounded-3xl blur-3xl" />
                <motion.div
                  className="relative w-[340px] h-[214px] sm:w-[400px] sm:h-[252px] rounded-2xl overflow-hidden"
                  animate={{ rotateY: [0, 3, 0, -3, 0], rotateX: [0, -2, 0, 2, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sacred-black-medium via-sacred-black to-sacred-black-light border border-sacred-gold/40 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sacred-gold/5 to-transparent animate-gold-shimmer bg-[length:200%_100%]" />
                  <div className="relative z-10 h-full flex flex-col justify-between p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-cinzel text-xl text-sacred-gold tracking-[0.3em]">
                          NOVA KEY
                        </p>
                        <p className="font-mono text-[11px] text-sacred-gray/40 mt-1">
                          COVENANT EDITION
                        </p>
                      </div>
                      <Nfc className="w-8 h-8 text-sacred-gold/60" />
                    </div>
                    <div>
                      <div className="w-12 h-8 rounded-md bg-sacred-gold/10 border border-sacred-gold/20 mb-4" />
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-mono text-xs text-sacred-gray/40">DESFire EV3</p>
                          <p className="font-rajdhani text-sm text-sacred-white">
                            NXP Semiconductors
                          </p>
                        </div>
                        <p className="font-cinzel text-2xl text-sacred-gold/30">
                          {SACRED_NUMBERS.SAG.hebrew}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <h2 className="font-cinzel text-3xl sm:text-4xl text-sacred-white tracking-wide">
              Engineered for the{" "}
              <span className="sacred-gradient-text">Sacred</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" as const }}
              >
                <Card variant="sacred" hover glow="gold" padding="lg" className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-sacred-gold" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-lg text-sacred-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="font-rajdhani text-sm text-sacred-gray leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <h2 className="font-cinzel text-3xl sm:text-4xl text-sacred-white tracking-wide">
              Technical{" "}
              <span className="sacred-gradient-text">Specifications</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 max-w-3xl mx-auto">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" as const }}
              >
                <Card variant="glass" padding="md" className="text-center">
                  <spec.icon className="w-6 h-6 text-sacred-cyan mx-auto mb-3" />
                  <p className="font-rajdhani text-xs text-sacred-gray uppercase tracking-wider mb-1">
                    {spec.label}
                  </p>
                  <p className="font-rajdhani text-sm text-sacred-white font-semibold">
                    {spec.value}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Covenant Pack includes */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <h2 className="font-cinzel text-3xl text-sacred-white tracking-wide mb-4">
              The Covenant Pack
            </h2>
            <p className="font-rajdhani text-lg text-sacred-gray">
              Everything you need to begin your journey.
            </p>
          </motion.div>

          <Card variant="sacred" glow="gold" padding="lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {covenantIncludes.map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" as const }}
                >
                  <Check className="w-4 h-4 text-sacred-gold mt-1 shrink-0" />
                  <span className="font-rajdhani text-sm text-sacred-gray">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-cinzel text-3xl text-sacred-gold">$63</span>
                <span className="font-rajdhani text-sm text-sacred-gray ml-2">
                  Free worldwide shipping
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                href="/checkout"
              >
                Order Your Covenant Pack
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
