import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Dream Nova privacy policy — how we handle your data with sacred respect.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="mb-12">
        <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
          Legal
        </p>
        <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide mb-4">
          Privacy Policy
        </h1>
        <p className="font-rajdhani text-sm text-sacred-gray">
          Last updated: March 10, 2026
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">1. Our Commitment</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            DreamNova Inc. (&quot;Dream Nova,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your
            privacy. This policy describes how we collect, use, and share information when you use
            our services, including the Nova Key NFC system, our website at dreamnova.vercel.app,
            and all related applications and services.
          </p>
          <p className="font-rajdhani text-sacred-gray leading-relaxed mt-3">
            Our privacy architecture is built on zero-knowledge principles. We believe your spiritual
            journey is sovereign. We employ zk-SNARK technology for identity verification, meaning
            we can verify your identity without ever seeing your personal data.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">2. Information We Collect</h2>
          <h3 className="font-rajdhani text-lg text-sacred-white font-semibold mb-2">Account Information</h3>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            When you create an account, we collect your email address, display name, and optionally
            your Hebrew name. We use Supabase for authentication with industry-standard encryption.
          </p>
          <h3 className="font-rajdhani text-lg text-sacred-white font-semibold mb-2 mt-4">Payment Information</h3>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Payment processing is handled entirely by Stripe. We never store credit card numbers,
            CVVs, or full payment details on our servers. We only retain transaction IDs, amounts,
            and order status for record-keeping.
          </p>
          <h3 className="font-rajdhani text-lg text-sacred-white font-semibold mb-2 mt-4">NFC Scan Data</h3>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            When you scan your Nova Key, we record the scan timestamp, your device user agent,
            and optionally your geographic coordinates (only if you grant location permission).
            This data is used to calculate Hafatsa points and display your activity history.
          </p>
          <h3 className="font-rajdhani text-lg text-sacred-white font-semibold mb-2 mt-4">Usage Analytics</h3>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            We collect anonymous usage analytics to improve our services. This includes page views,
            feature usage patterns, and performance metrics. We do not use third-party tracking
            pixels or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 font-rajdhani text-sacred-gray">
            <li>To provide, maintain, and improve our services</li>
            <li>To process transactions and send related notifications</li>
            <li>To calculate and display Hafatsa points and achievements</li>
            <li>To send you updates about new features, content, and community events (opt-in only)</li>
            <li>To respond to your inquiries and support requests</li>
            <li>To detect, prevent, and address fraud or security issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">4. Data Sharing</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            We do not sell your personal data. We share information only with:
          </p>
          <ul className="list-disc list-inside space-y-2 font-rajdhani text-sacred-gray mt-3">
            <li><strong className="text-sacred-white">Stripe</strong> — for payment processing</li>
            <li><strong className="text-sacred-white">Supabase</strong> — for database and authentication services</li>
            <li><strong className="text-sacred-white">Vercel</strong> — for hosting and edge network delivery</li>
            <li><strong className="text-sacred-white">Legal authorities</strong> — when required by law or to protect our rights</li>
          </ul>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">5. Your Rights</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Under GDPR and applicable privacy laws, you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 font-rajdhani text-sacred-gray mt-3">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and all associated data</li>
            <li>Export your data in a machine-readable format</li>
            <li>Object to or restrict certain processing</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="font-rajdhani text-sacred-gray leading-relaxed mt-3">
            To exercise any of these rights, contact us at contact@dreamnova.com.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">6. Data Retention</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            We retain your account data for as long as your account is active. If you delete your
            account, we will delete your personal data within 30 days, except where retention is
            required by law (e.g., transaction records for tax purposes, retained for 7 years).
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">7. Security</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            We implement industry-standard security measures including AES-128 encryption for NFC
            communications, TLS 1.3 for all data in transit, encrypted databases at rest, and
            regular security audits. Our zk-SNARK implementation ensures that identity verification
            occurs without exposing underlying personal data.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">8. Contact</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            For privacy-related inquiries, contact our Data Protection Officer at
            contact@dreamnova.com or write to: DreamNova Inc., Jerusalem, Israel.
          </p>
        </section>
      </div>
    </div>
  );
}
