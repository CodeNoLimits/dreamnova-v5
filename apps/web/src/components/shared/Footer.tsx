"use client";

import Link from "next/link";
import { Sparkles, Github, Send } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Nova Key", href: "/nova-key" },
      { label: "Source Code", href: "/source-code" },
      { label: "Pricing", href: "/checkout" },
      { label: "Azamra OS", href: "/azamra" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Whitepaper", href: "/whitepaper" },
      { label: "Architecture", href: "/architecture" },
      { label: "Research", href: "/research" },
      { label: "Manifesto", href: "/manifesto" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund", href: "/refund" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: SITE_CONFIG.social.github },
      { label: "Telegram", href: SITE_CONFIG.social.telegram },
      { label: "Twitter / X", href: SITE_CONFIG.social.twitter },
      { label: "Dashboard", href: "/overview" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-sacred-black">
      <div className="absolute inset-0 bg-gradient-to-t from-sacred-gold/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-sacred-gold" />
              <span className="font-cinzel text-base text-sacred-white tracking-[0.15em]">
                DREAM NOVA
              </span>
            </Link>
            <p className="font-rajdhani text-sm text-sacred-gray leading-relaxed max-w-xs">
              Sacred NFC technology merging Breslov wisdom with cutting-edge AI.
              Your key to the Nova network.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={SITE_CONFIG.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-sacred-gray hover:text-sacred-gold transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-sacred-gray hover:text-sacred-gold transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-cinzel text-xs text-sacred-white tracking-[0.2em] uppercase mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-rajdhani text-sm text-sacred-gray hover:text-sacred-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-rajdhani text-xs text-sacred-gray">
              &copy; {new Date().getFullYear()} DreamNova Inc. All rights reserved.
            </p>
            <p className="font-sacred text-xs text-sacred-gold/40 italic tracking-wide">
              Na Nach Nachma Nachman MeUman
            </p>
            <p className="font-mono text-[10px] text-sacred-gray/40">
              63 = SaG | 148 = Nachman | 613 = Tikkun
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
