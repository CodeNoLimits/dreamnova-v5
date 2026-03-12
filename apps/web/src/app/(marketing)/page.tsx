import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Pricing } from "@/components/marketing/Pricing";
import { Architecture } from "@/components/marketing/Architecture";
import { MetricsBar } from "@/components/marketing/MetricsBar";
import { SystemDiagram } from "@/components/marketing/SystemDiagram";
import { TechStack } from "@/components/marketing/TechStack";
import { CodeShowcase } from "@/components/marketing/CodeShowcase";
import { CTASection } from "@/components/marketing/CTASection";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <MetricsBar />
      <SystemDiagram />
      <div id="platform">
        <Features />
      </div>
      <TechStack />
      <CodeShowcase />
      <Pricing />
      <Architecture />
      <CTASection />
    </>
  );
}
