import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Pricing } from "@/components/marketing/Pricing";
import { Architecture } from "@/components/marketing/Architecture";
import { METRICS, RUST_CODE } from "@/lib/constants";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <MetricsBar />
      <div id="platform">
        <Features />
      </div>
      <CodeShowcase />
      <Pricing />
      <Architecture />
      <CTASection />
    </>
  );
}

function MetricsBar() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-sacred-gold/[0.02] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-sacred-gold/20 transition-all duration-300"
            >
              <p className="font-mono text-3xl sm:text-4xl font-bold text-sacred-gold">
                {metric.value}
              </p>
              <p className="font-rajdhani text-sm text-sacred-white mt-2 font-semibold">
                {metric.label}
              </p>
              {metric.sublabel && (
                <p className="font-rajdhani text-xs text-sacred-gray/50 mt-1">
                  {metric.sublabel}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeShowcase() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(0,212,255,0.03)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Text */}
          <div className="flex-1">
            <p className="font-mono text-xs text-sacred-cyan tracking-[0.3em] uppercase mb-4">
              Open Source
            </p>
            <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-sacred-white tracking-tight">
              Not Slides.{" "}
              <span className="bg-gradient-to-r from-sacred-gold to-sacred-cyan bg-clip-text text-transparent">
                Shipped Code.
              </span>
            </h2>
            <p className="mt-4 font-rajdhani text-lg text-sacred-gray max-w-lg">
              7 Rust crates. 54 verified tests. Production-grade cryptographic
              primitives. Every claim in our whitepaper has compiled, tested
              code behind it.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm">
              {[
                { label: "Rust Crates", value: "7" },
                { label: "Verified Tests", value: "54" },
                { label: "Lines of Rust", value: "8,000+" },
                { label: "Dependencies", value: "Minimal" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-mono text-xl text-sacred-gold font-bold">
                    {stat.value}
                  </span>
                  <span className="font-rajdhani text-xs text-sacred-gray/60">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="https://github.com/CodeNoLimits/dreamnova-v5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-sacred-cyan hover:text-sacred-cyan-light transition-colors"
              >
                View on GitHub &rarr;
              </a>
            </div>
          </div>

          {/* Right — Code block */}
          <div className="flex-shrink-0 w-full max-w-[540px]">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0C0C14]">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-[11px] text-sacred-gray/40 ml-2">
                  evolutrix/src/mutator.rs
                </span>
              </div>
              <pre className="p-5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto">
                <code className="text-sacred-gray">
                  {RUST_CODE.split("\n").map((line, i) => {
                    let className = "text-sacred-gray/70";
                    if (line.includes("//"))
                      className = "text-sacred-gray/40 italic";
                    if (line.includes("pub fn") || line.includes("impl"))
                      className = "text-sacred-cyan";
                    if (line.includes("self."))
                      className = "text-sacred-gold";
                    if (line.includes("let "))
                      className = "text-sacred-cyan";
                    if (line.includes("DecoyStrategy"))
                      className = "text-sacred-gold";
                    return (
                      <span key={i} className={`block ${className}`}>
                        {line}
                      </span>
                    );
                  })}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
          Get Started
        </p>
        <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl lg:text-5xl text-sacred-white tracking-tight leading-tight">
          Ready to Deploy{" "}
          <span className="bg-gradient-to-r from-sacred-gold to-sacred-cyan bg-clip-text text-transparent">
            Autonomous Defense
          </span>
          ?
        </h2>
        <p className="mt-6 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
          Request a 14-day Shadow Mode evaluation. The platform deploys alongside
          your existing infrastructure — zero disruption, zero data exposure.
          See what your current tools are missing.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sacred-gold text-sacred-black font-rajdhani font-bold text-lg rounded-xl hover:bg-sacred-gold-light transition-all shadow-sacred hover:shadow-sacred-lg"
          >
            Request Shadow Mode Demo
          </a>
          <a
            href="/whitepaper"
            className="inline-flex items-center gap-2 px-8 py-4 border border-sacred-gold/30 text-sacred-gold font-rajdhani font-semibold text-lg rounded-xl hover:bg-sacred-gold/10 transition-all"
          >
            Download Whitepaper
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "7", label: "Rust Crates" },
            { value: "< 5ms", label: "Proof Verification" },
            { value: "0", label: "Data Exposed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-2xl text-sacred-gold font-bold">{stat.value}</p>
              <p className="font-rajdhani text-xs text-sacred-gray mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
