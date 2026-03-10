import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Dream Nova refund policy — fair and transparent.",
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="mb-12">
        <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
          Legal
        </p>
        <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide mb-4">
          Refund Policy
        </h1>
        <p className="font-rajdhani text-sm text-sacred-gray">
          Last updated: March 10, 2026
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">Our Commitment</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            We stand behind every Nova Key we ship. If you are not satisfied with your purchase,
            we offer a straightforward refund process. Our goal is to ensure every member of the
            covenant is confident in their decision.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">30-Day Satisfaction Guarantee</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            You have 30 days from the date of delivery to request a full refund. No questions asked.
            If the Nova Key does not meet your expectations, we will refund the full purchase price
            including the original shipping cost.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">How to Request a Refund</h2>
          <ol className="list-decimal list-inside space-y-3 font-rajdhani text-sacred-gray">
            <li>
              Email us at <a href="mailto:contact@dreamnova.com" className="text-sacred-gold hover:text-sacred-gold-light transition-colors">contact@dreamnova.com</a> with
              your order number and the reason for your refund request
            </li>
            <li>
              We will respond within 2 business days with return instructions (if applicable)
            </li>
            <li>
              Ship the Nova Key back to us in its original packaging (we provide a prepaid
              return label for orders within the US and Israel)
            </li>
            <li>
              Once we receive the returned item, we will process your refund within 5-7 business
              days to your original payment method
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">Defective Products</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            If your Nova Key arrives damaged or defective, we will ship a replacement immediately
            at no cost. Contact us with photos of the damage, and we will expedite a new card.
            You do not need to wait for the return to arrive before we send the replacement.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">Digital Services</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Access to digital services (Tikkun HaKlali portal, Azamra OS, Hafatsa Points) is
            included with your Nova Key purchase. If you return your Nova Key, digital access
            will be deactivated upon processing the refund. Hafatsa Points earned during the
            trial period will be forfeited.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">Exceptions</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            Refunds may not be available for:
          </p>
          <ul className="list-disc list-inside space-y-2 font-rajdhani text-sacred-gray mt-3">
            <li>Nova Keys that have been physically damaged through misuse</li>
            <li>Requests made more than 30 days after delivery</li>
            <li>Bulk orders (10+ units) — contact us for special arrangements</li>
          </ul>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-sacred-white mb-4">Contact</h2>
          <p className="font-rajdhani text-sacred-gray leading-relaxed">
            For refund inquiries, email us at{" "}
            <a href="mailto:contact@dreamnova.com" className="text-sacred-gold hover:text-sacred-gold-light transition-colors">
              contact@dreamnova.com
            </a>{" "}
            or visit our{" "}
            <a href="/contact" className="text-sacred-gold hover:text-sacred-gold-light transition-colors">
              contact page
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
