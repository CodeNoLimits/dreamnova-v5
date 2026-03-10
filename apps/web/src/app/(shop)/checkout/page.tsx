"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Nfc, Check, CreditCard, Lock, ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PRICING_TIERS, SACRED_NUMBERS } from "@/lib/constants";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [selectedTier, setSelectedTier] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const tier = PRICING_TIERS[selectedTier];
  const total = tier.price * quantity;

  async function handleCheckout(e: FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierName: tier.name,
          price: tier.price,
          quantity,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-gold tracking-[0.3em] uppercase mb-4">
            Secure Checkout
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide">
            Complete Your{" "}
            <span className="sacred-gradient-text">Covenant</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Selection + Form */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
          >
            {/* Tier selection */}
            <div>
              <h2 className="font-cinzel text-lg text-sacred-white mb-4">
                Choose Your Covenant
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRICING_TIERS.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTier(i)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      i === selectedTier
                        ? "border-sacred-gold/50 bg-sacred-gold/5"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <p className="font-cinzel text-sm text-sacred-white">{t.name}</p>
                    <p className="font-cinzel text-xl text-sacred-gold mt-1">
                      ${t.price}
                    </p>
                    <p className="font-mono text-[10px] text-sacred-gray/50 mt-1">
                      {t.sacredNumber.value} = {t.sacredNumber.hebrew}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h2 className="font-cinzel text-lg text-sacred-white mb-4">Quantity</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-sacred-gray hover:text-sacred-white hover:border-white/20 transition-colors cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-cinzel text-2xl text-sacred-white w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-sacred-gray hover:text-sacred-white hover:border-white/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <h2 className="font-cinzel text-lg text-sacred-white mb-4">Your Details</h2>
              <Card variant="sacred" padding="md">
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label htmlFor="checkout-email" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                      Email Address
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full"
                    />
                    <p className="font-rajdhani text-xs text-sacred-gray/50 mt-2">
                      Your order confirmation and Nova Key activation instructions will be sent here.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    fullWidth
                    loading={loading}
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Proceed to Payment — ${total}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 justify-center pt-4">
              {[
                { icon: ShieldCheck, label: "SSL Encrypted" },
                { icon: CreditCard, label: "Stripe Secured" },
                { icon: Lock, label: "zk-SNARK Privacy" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sacred-gray/50">
                  <Icon className="w-4 h-4" />
                  <span className="font-mono text-xs">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Order summary */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
          >
            <Card variant="sacred" glow="gold" padding="lg" className="sticky top-24">
              <h2 className="font-cinzel text-lg text-sacred-white mb-6">
                Order Summary
              </h2>

              <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                <div className="w-16 h-10 rounded-lg bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center">
                  <Nfc className="w-6 h-6 text-sacred-gold" />
                </div>
                <div className="flex-1">
                  <p className="font-rajdhani text-sm text-sacred-white">{tier.name}</p>
                  <p className="font-mono text-xs text-sacred-gray/60">
                    x{quantity}
                  </p>
                </div>
                <p className="font-cinzel text-lg text-sacred-gold">${total}</p>
              </div>

              <ul className="py-4 space-y-2 border-b border-white/5">
                {tier.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-sacred-gold mt-1 shrink-0" />
                    <span className="font-rajdhani text-xs text-sacred-gray">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-rajdhani text-sm text-sacred-gray">Subtotal</span>
                  <span className="font-rajdhani text-sm text-sacred-white">${total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-rajdhani text-sm text-sacred-gray">Shipping</span>
                  <span className="font-rajdhani text-sm text-green-400">Free</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="font-cinzel text-base text-sacred-white">Total</span>
                  <span className="font-cinzel text-2xl text-sacred-gold">${total}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-sacred-gold/5 border border-sacred-gold/10">
                <p className="font-mono text-[10px] text-sacred-gold/60 text-center">
                  {SACRED_NUMBERS.SAG.value} = {SACRED_NUMBERS.SAG.hebrew} ({SACRED_NUMBERS.SAG.name}) — {SACRED_NUMBERS.SAG.meaning}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
