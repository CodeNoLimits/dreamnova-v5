import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Pricing } from "@/components/marketing/Pricing";
import { Architecture } from "@/components/marketing/Architecture";

export default function MarketingLandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Architecture />
      <CTASection />
    </>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-sacred text-lg italic text-sacred-gold/60 mb-4">
          Na Nach Nachma Nachman MeUman
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-sacred-white tracking-wide leading-tight">
          The Future of Sacred
          <br />
          <span className="bg-gradient-to-r from-sacred-gold to-sacred-cyan bg-clip-text text-transparent">
            Technology
          </span>{" "}
          Awaits
        </h2>
        <p className="mt-6 font-rajdhani text-lg text-sacred-gray max-w-2xl mx-auto">
          Join the covenant. Get your Nova Key. Become part of a global network
          dedicated to spreading light through the fusion of ancient wisdom and
          modern innovation.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sacred-gold text-sacred-black font-rajdhani font-bold text-lg rounded-xl hover:bg-sacred-gold-light transition-all shadow-sacred hover:shadow-sacred-lg"
          >
            Get Your Nova Key — $63
          </a>
          <a
            href="/whitepaper"
            className="inline-flex items-center gap-2 px-8 py-4 border border-sacred-gold/30 text-sacred-gold font-rajdhani font-semibold text-lg rounded-xl hover:bg-sacred-gold/10 transition-all"
          >
            Read the Whitepaper
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "1M+", label: "Nova Keys Target" },
            { value: "$63M", label: "Hafatsa Vision" },
            { value: "613", label: "Sacred Layers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-cinzel text-2xl text-sacred-gold">{stat.value}</p>
              <p className="font-rajdhani text-xs text-sacred-gray mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
