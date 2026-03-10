"use client";

import { motion } from "framer-motion";
import type { Metadata } from "next";

const sections = [
  {
    number: "I",
    title: "The Problem",
    content: `The modern world is drowning in information yet starving for wisdom. We have built systems that optimize for engagement but destroy attention. Algorithms that maximize profit while minimizing meaning. Technology that connects billions of screens but disconnects billions of souls.

The sacred texts — Torah, Talmud, Kabbalah, the teachings of Rabbi Nachman of Breslov — contain the antidote. But they sit behind walls of language, tradition, and institutional gatekeeping. The greatest wisdom in human history is the least accessible.

This is not a technical problem. It is a moral failure.`,
  },
  {
    number: "II",
    title: "The Vision",
    content: `Dream Nova exists to reverse this equation. We build sacred technology — tools that treat wisdom with the reverence it deserves while making it available to anyone with a phone and a heartbeat.

Our vision is specific and measurable: $63M in Hafatsa (sacred distribution) over 7-10 years. One million Nova Keys distributed worldwide. Every Key a portal. Every portal a pathway. Every pathway leading to the same source.

63 is not an arbitrary number. In the Kabbalistic system, 63 is the value of SaG (samekh-gimel), representing the level of Binah — Understanding. We are building the infrastructure of understanding.`,
  },
  {
    number: "III",
    title: "The Technology",
    content: `We do not build technology for its own sake. Every system we create serves a sacred purpose:

EVOLUTRIX — Our learning engine does not just process text. It maps the neural pathways of sacred knowledge, adapting to each seeker's unique journey through 613 layers of understanding.

ANTIMATRIX — Privacy is not a feature; it is a right. Our zero-knowledge architecture ensures your spiritual journey remains sovereign. We verify without revealing. We protect without surveilling.

NOVA KEY — A physical NFC card that bridges the digital and physical worlds. One tap unlocks your personal portal to thousands of years of accumulated wisdom.

AZAMRA OS — Named after Rabbi Nachman's teaching "Azamra" (I will sing), this is our operating system for finding the good points in everything and everyone.`,
  },
  {
    number: "IV",
    title: "The Method",
    content: `Rabbi Nachman taught: "Ein ye'ush ba'olam klal" — There is no despair in the world at all. This is not naive optimism. It is a radical engineering principle.

We build systems that assume the good. That find the point of light in every dataset, every user interaction, every moment of engagement. Our AI does not optimize for addiction. It optimizes for elevation.

We follow the Azamra methodology in our code: find what works, protect it, build around it. Never rewrite from scratch. Always iterate from the good point. This applies to our codebase, our business, and our relationship with every user.`,
  },
  {
    number: "V",
    title: "The Covenant",
    content: `When you acquire a Nova Key, you are not buying a product. You are entering a covenant (Brit). A sacred agreement between you and the network.

You agree to use this technology for learning, teaching, sharing, and elevating. We agree to protect your privacy, serve your growth, and never compromise the sacred for the commercial.

This covenant extends to our investors, partners, and team members. We do not take money from sources that contradict our mission. We do not build features that exploit attention. We do not ship products that diminish dignity.`,
  },
  {
    number: "VI",
    title: "The Future",
    content: `Five phases. Five books of Torah. Five stages from Genesis to Deuteronomy.

Phase 1 (Genesis): Launch. 1,000 Nova Keys. Build the foundation.
Phase 2 (Exodus): Scale. 10,000 Keys. Leave the narrow place.
Phase 3 (Leviticus): Sanctify. 100,000 Keys. Establish the sacred protocols.
Phase 4 (Numbers): Count. 1,000,000 Keys. Build the census of seekers.
Phase 5 (Deuteronomy): Complete. $63M Hafatsa achieved. The vision realized.

We are in Genesis. The light is just beginning.

Na Nach Nachma Nachman MeUman.`,
  },
];

export default function ManifestoPage() {
  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            Our Declaration
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-sacred-white tracking-wide leading-tight">
            The Dream Nova{" "}
            <span className="sacred-gradient-text">Manifesto</span>
          </h1>
          <div className="mt-6 w-16 h-px bg-sacred-gold/30 mx-auto" />
        </motion.div>

        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.article
              key={section.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.05,
                ease: "easeOut" as const,
              }}
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center">
                  <span className="font-cinzel text-lg text-sacred-gold">
                    {section.number}
                  </span>
                </div>
                <div>
                  <h2 className="font-cinzel text-2xl text-sacred-white tracking-wide mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.split("\n\n").map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="font-rajdhani text-base text-sacred-gray leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" as const }}
        >
          <div className="w-16 h-px bg-sacred-gold/30 mx-auto mb-8" />
          <p className="font-sacred text-xl italic text-sacred-gold/60">
            Na Nach Nachma Nachman MeUman
          </p>
          <p className="font-mono text-xs text-sacred-gray/30 mt-4">
            63 = SaG | 148 = Nachman | 613 = Tikkun
          </p>
        </motion.div>
      </div>
    </div>
  );
}
