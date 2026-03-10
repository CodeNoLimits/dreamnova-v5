"use client";

import { motion } from "framer-motion";
import { ArrowRight, Nfc, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SACRED_NUMBERS } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,212,255,0.05)_0%,_transparent_40%)]" />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sacred-gold/5 blur-[120px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-sacred-cyan/5 blur-[100px]"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sacred-gold/20 bg-sacred-gold/5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-sacred-gold animate-pulse" />
                <span className="font-mono text-xs text-sacred-gold tracking-wider">
                  V5.0 — GENESIS PHASE
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="font-cinzel text-4xl sm:text-5xl lg:text-7xl text-sacred-white leading-[1.1] tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" as const }}
            >
              DREAM{" "}
              <span className="bg-gradient-to-r from-sacred-gold via-sacred-cyan to-sacred-gold bg-clip-text text-transparent bg-[length:200%_100%] animate-gold-shimmer">
                NOVA
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 font-rajdhani text-xl sm:text-2xl text-sacred-gray leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
            >
              Stop Calculating. Start Living.
            </motion.p>

            <motion.p
              className="mt-4 font-rajdhani text-base text-sacred-gray/70 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
            >
              Sacred NFC technology merging Breslov wisdom with cutting-edge AI.
              One tap unlocks your portal to ancient knowledge, modern infrastructure,
              and a global network of seekers.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                href="/checkout"
              >
                Get Your Nova Key — ${SACRED_NUMBERS.SAG.value}
              </Button>
              <Button variant="outline" size="lg" href="/nova-key">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" as const }}
            >
              {[
                { icon: Nfc, label: "DESFire EV3" },
                { icon: Shield, label: "zk-SNARK" },
                { icon: Zap, label: "Sub-5ms" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sacred-gray/50">
                  <Icon className="w-4 h-4 text-sacred-gold/60" />
                  <span className="font-mono text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Nova Key Card */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" as const }}
          >
            <div className="relative group cursor-pointer" style={{ perspective: "1000px" }}>
              {/* Card glow */}
              <div className="absolute -inset-4 bg-sacred-gold/10 rounded-3xl blur-2xl group-hover:bg-sacred-gold/20 transition-all duration-700" />
              <div className="absolute -inset-8 bg-sacred-cyan/5 rounded-3xl blur-3xl" />

              {/* The NFC Card */}
              <motion.div
                className="relative w-[320px] h-[200px] sm:w-[380px] sm:h-[240px] rounded-2xl overflow-hidden"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
                whileHover={{ rotateY: 5, rotateX: -5 }}
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-sacred-black-medium via-sacred-black to-sacred-black-medium border border-sacred-gold/30 rounded-2xl" />

                {/* Holographic shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sacred-gold/10 to-transparent animate-gold-shimmer bg-[length:200%_100%]" />

                {/* Card content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-cinzel text-lg text-sacred-gold tracking-[0.3em]">
                        NOVA KEY
                      </p>
                      <p className="font-mono text-[10px] text-sacred-gray/40 mt-1">
                        DESFire EV3 / NFC
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center">
                      <Nfc className="w-5 h-5 text-sacred-gold" />
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-sm text-sacred-gray/60 tracking-[0.5em]">
                      **** **** **** 0063
                    </p>
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <p className="font-rajdhani text-[10px] text-sacred-gray/40 uppercase tracking-wider">
                          Covenant Holder
                        </p>
                        <p className="font-rajdhani text-sm text-sacred-white">
                          DREAM NOVA V5
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-rajdhani text-[10px] text-sacred-gray/40 uppercase tracking-wider">
                          Sacred ID
                        </p>
                        <p className="font-mono text-sm text-sacred-gold">
                          {SACRED_NUMBERS.SAG.hebrew}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-sacred-gold/30 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-sacred-gold/30 rounded-br-2xl" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Sacred numbers bar */}
        <motion.div
          className="mt-20 flex items-center justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" as const }}
        >
          {Object.values(SACRED_NUMBERS)
            .slice(0, 3)
            .map((num) => (
              <div key={num.value} className="text-center group cursor-default">
                <p className="font-cinzel text-3xl sm:text-4xl text-sacred-gold/30 group-hover:text-sacred-gold/60 transition-colors">
                  {num.value}
                </p>
                <p className="font-rajdhani text-xs text-sacred-gray/30 mt-1">
                  {num.name}
                </p>
              </div>
            ))}
        </motion.div>
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
