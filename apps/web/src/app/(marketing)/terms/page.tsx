import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Dream Nova terms of service — the sacred covenant between you and the network.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="mb-12">
        <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
          Legal
        </p>
        <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide mb-4">
          Terms of Service
        </h1>
        <p className="font-rajdhani text-sm text-sacred-gray">
          Last updated: March 10, 2026
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">1. Acceptance of Terms</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            By accessing or using Dream Nova services, including our website, Nova Key NFC devices,
            Azamra OS, Tikkun HaKlali portal, and all related applications (collectively, the
            &quot;Services&quot;), you agree to be bound by these Terms of Service. If you do not agree, do
            not use the Services.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">2. The Covenant</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Dream Nova operates on the principle of covenant (Brit). When you purchase a Nova Key,
            you enter into a sacred agreement with the network. This is both a legal transaction
            and a spiritual commitment to use the technology for positive purposes — learning,
            teaching, sharing, and elevating.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">3. Account Registration</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            To access certain features, you must create an account. You agree to provide accurate
            information and keep your account credentials secure. You are responsible for all
            activity under your account. You must be at least 13 years old to create an account
            (16 in the EU under GDPR).
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">4. Nova Key Purchase and Use</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Nova Key NFC devices are sold as physical products with associated digital services.
            Each Nova Key is non-transferable once activated. Prices are displayed in USD and
            include applicable taxes. Shipping is included in the purchase price for standard
            delivery worldwide.
          </p>
          <p className="font-rajdhani text-sacred-gray leading-relaxed mt-3">
            You agree not to: tamper with, reverse-engineer, or modify the NFC chip; use the Nova
            Key for unlawful purposes; attempt to clone or duplicate the cryptographic keys; or
            resell activated Nova Keys without authorization.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">5. Hafatsa Points</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Hafatsa Points are earned through legitimate use of the Services, including NFC scans,
            content sharing, referrals, and community participation. Points have no cash value and
            cannot be purchased, sold, or traded outside the Dream Nova ecosystem. We reserve the
            right to adjust point balances in cases of fraud or abuse.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">6. Intellectual Property</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            All content, software, and technology powering Dream Nova — including but not limited
            to the Evolutrix engine, Antimatrix privacy layer, Azamra OS, and all sacred design
            elements — are the intellectual property of DreamNova Inc. Sacred texts and Torah
            content referenced in our services are in the public domain and freely accessible
            through their original sources.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">7. Privacy</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Your use of the Services is also governed by our{" "}
            <a href="/privacy" className="text-sacred-gold hover:text-sacred-gold-light transition-colors">
              Privacy Policy
            </a>
            , which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">8. Limitation of Liability</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            The Services are provided &quot;as is&quot; and &quot;as available.&quot; We make no warranties, express or
            implied, regarding the Services. To the maximum extent permitted by law, DreamNova Inc.
            shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Services.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">9. Modifications</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            We may update these Terms from time to time. We will notify registered users of
            material changes via email. Continued use of the Services after changes take effect
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">10. Governing Law</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            These Terms are governed by the laws of the State of Israel. Any disputes shall be
            resolved in the courts of Jerusalem, Israel.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">11. Contact</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            For questions about these Terms, contact us at contact@dreamnova.com.
          </p>
        </section>
      </div>
    </div>
  );
}
