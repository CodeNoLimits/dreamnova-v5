"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Mail, Package, Nfc } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  return (
    <div className="relative py-16 lg:py-24 min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide mb-4">
            Covenant{" "}
            <span className="sacred-gradient-text">Sealed</span>
          </h1>

          <p className="font-rajdhani text-lg text-sacred-gray mb-8">
            Your order has been confirmed. Welcome to the Nova network.
          </p>

          {sessionId && (
            <p className="font-mono text-xs text-sacred-gray/40 mb-8">
              Session: {sessionId.slice(0, 20)}...
            </p>
          )}
        </motion.div>

        <motion.div
          className="space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
        >
          {[
            {
              icon: Mail,
              title: "Confirmation Email Sent",
              description: "Check your inbox for order details and tracking information.",
            },
            {
              icon: Package,
              title: "Shipping in 2-5 Business Days",
              description: "Your Nova Key will be carefully packaged and shipped worldwide.",
            },
            {
              icon: Nfc,
              title: "Activation Ready",
              description: "Once received, tap your Nova Key on any NFC-enabled device to activate.",
            },
          ].map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1, ease: "easeOut" as const }}
            >
              <Card variant="glass" padding="md">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-sacred-gold" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-rajdhani text-sm text-sacred-white font-semibold">
                      {step.title}
                    </h3>
                    <p className="font-rajdhani text-xs text-sacred-gray mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" as const }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            href="/overview"
          >
            Go to Dashboard
          </Button>
          <Button variant="outline" size="lg" href="/">
            Back to Home
          </Button>
        </motion.div>

        <motion.p
          className="mt-12 font-sacred text-base italic text-sacred-gold/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" as const }}
        >
          Na Nach Nachma Nachman MeUman
        </motion.p>
      </div>
    </div>
  );
}
