"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Evolutrix", href: "/#platform" },
      { label: "Antimatrix", href: "/#platform" },
      { label: "Tzimtzum", href: "/#platform" },
      { label: "Esther AI", href: "/#platform" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "Whitepaper", href: "/whitepaper" },
      { label: "Architecture", href: "/architecture" },
      { label: "Research", href: "/research" },
      { label: "Source Code", href: "https://github.com/CodeNoLimits/dreamnova-v5", external: true },
    ],
  },
  {
    title: "Enterprise",
    links: [
      { label: "Sentinel Plan", href: "/contact" },
      { label: "Fortress Plan", href: "/contact" },
      { label: "Hegemony Plan", href: "/contact" },
      { label: "Shadow Mode Demo", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Careers", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-sacred-black">
      <div className="absolute inset-0 bg-gradient-to-t from-sacred-gold/[0.01] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-sacred-gold/20 rounded-md flex items-center justify-center">
                <span className="font-cinzel text-xs text-sacred-gold font-bold">DN</span>
              </div>
              <span className="font-cinzel text-sm text-sacred-white tracking-[0.15em]">
                DREAM NOVA
              </span>
            </Link>
            <p className="font-rajdhani text-sm text-sacred-gray leading-relaxed max-w-xs">
              Autonomous cybersecurity platform. Self-evolving defense,
              zero-knowledge verification, AI-driven threat response.
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
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-sacred-gray hover:text-sacred-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-rajdhani font-bold text-xs text-sacred-white tracking-wider uppercase mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-rajdhani text-sm text-sacred-gray hover:text-sacred-gold transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-rajdhani text-sm text-sacred-gray hover:text-sacred-gold transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
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
            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] text-sacred-gray/40">
                Built with Rust &bull; Powered by zk-SNARKs &bull; Verified by math
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
