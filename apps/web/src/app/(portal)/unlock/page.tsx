"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Nfc, Wifi, CheckCircle, AlertCircle, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";

type UnlockState = "idle" | "scanning" | "success" | "error";

export default function UnlockPage() {
  const [state, setState] = useState<UnlockState>("idle");
  const [manualCode, setManualCode] = useState("");

  async function handleNfcScan() {
    if (!("NDEFReader" in window)) {
      toast.error("NFC is not supported on this device. Use manual entry instead.");
      return;
    }

    setState("scanning");

    try {
      const ndef = new (window as unknown as { NDEFReader: new () => { scan: () => Promise<void>; onreading: ((event: { serialNumber: string }) => void) | null } }).NDEFReader();
      await ndef.scan();

      ndef.onreading = async (event: { serialNumber: string }) => {
        const serial = event.serialNumber;
        try {
          const res = await fetch("/api/nfc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serial, action: "unlock" }),
          });

          if (res.ok) {
            setState("success");
            toast.success("Nova Key verified. Portal unlocked.");
          } else {
            setState("error");
            toast.error("Unrecognized Nova Key. Please try again.");
          }
        } catch {
          setState("error");
          toast.error("Verification failed. Check your connection.");
        }
      };
    } catch {
      setState("error");
      toast.error("NFC scan failed. Try manual entry.");
    }
  }

  async function handleManualEntry() {
    if (!manualCode.trim()) {
      toast.error("Please enter your activation code.");
      return;
    }

    setState("scanning");

    try {
      const res = await fetch("/api/nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serial: manualCode, action: "unlock" }),
      });

      if (res.ok) {
        setState("success");
        toast.success("Code verified. Portal unlocked.");
      } else {
        setState("error");
        toast.error("Invalid activation code.");
      }
    } catch {
      setState("error");
      toast.error("Verification failed. Please try again.");
    }
  }

  return (
    <div className="relative py-16 lg:py-24 min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,212,255,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div className="w-20 h-20 rounded-2xl bg-sacred-cyan/10 border border-sacred-cyan/20 flex items-center justify-center mx-auto mb-6">
            <Nfc className="w-10 h-10 text-sacred-cyan" />
          </div>
          <h1 className="font-cinzel text-4xl text-sacred-white tracking-wide mb-3">
            Unlock Your{" "}
            <span className="sacred-gradient-text">Portal</span>
          </h1>
          <p className="font-rajdhani text-base text-sacred-gray">
            Tap your Nova Key or enter your activation code to access the sacred network.
          </p>
        </motion.div>

        {state === "idle" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
          >
            {/* NFC Scan */}
            <Card variant="sacred" glow="cyan" padding="lg" className="text-center">
              <Wifi className="w-12 h-12 text-sacred-cyan mx-auto mb-4 animate-pulse" />
              <h2 className="font-cinzel text-xl text-sacred-white mb-2">
                Tap Your Nova Key
              </h2>
              <p className="font-rajdhani text-sm text-sacred-gray mb-6">
                Hold your Nova Key against the back of your phone.
              </p>
              <Button variant="secondary" size="lg" fullWidth onClick={handleNfcScan}>
                Start NFC Scan
              </Button>
            </Card>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-mono text-xs text-sacred-gray/50">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Manual entry */}
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="w-5 h-5 text-sacred-gold" />
                <h2 className="font-cinzel text-base text-sacred-white">
                  Manual Entry
                </h2>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter activation code"
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleManualEntry}>
                  Verify
                </Button>
              </div>
              <p className="font-rajdhani text-xs text-sacred-gray/50 mt-3">
                Find your activation code on the card included in your Covenant Pack.
              </p>
            </Card>
          </motion.div>
        )}

        {state === "scanning" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
          >
            <Card variant="sacred" padding="lg">
              <div className="py-8">
                <motion.div
                  className="w-16 h-16 rounded-full border-2 border-sacred-cyan/30 mx-auto mb-6"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
                >
                  <div className="w-full h-full rounded-full bg-sacred-cyan/10 flex items-center justify-center">
                    <Wifi className="w-8 h-8 text-sacred-cyan" />
                  </div>
                </motion.div>
                <p className="font-cinzel text-lg text-sacred-white mb-2">
                  Verifying...
                </p>
                <p className="font-rajdhani text-sm text-sacred-gray">
                  Establishing secure connection to the Nova network.
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <Card variant="sacred" glow="gold" padding="lg">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="font-cinzel text-2xl text-sacred-white mb-2">
                Portal Unlocked
              </h2>
              <p className="font-rajdhani text-base text-sacred-gray mb-8">
                Your Nova Key has been verified. Welcome to the sacred network.
              </p>
              <div className="space-y-3">
                <Button variant="primary" size="lg" fullWidth href="/tikkun" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Enter Tikkun HaKlali
                </Button>
                <Button variant="outline" size="lg" fullWidth href="/azamra">
                  Open Azamra OS
                </Button>
                <Button variant="ghost" size="lg" fullWidth href="/overview">
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
          >
            <Card variant="sacred" padding="lg">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="font-cinzel text-xl text-sacred-white mb-2">
                Verification Failed
              </h2>
              <p className="font-rajdhani text-sm text-sacred-gray mb-6">
                We could not verify your Nova Key. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <Button variant="primary" size="lg" fullWidth onClick={() => setState("idle")}>
                  Try Again
                </Button>
                <Button variant="ghost" size="lg" fullWidth href="/contact">
                  Contact Support
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <p className="mt-8 font-rajdhani text-xs text-sacred-gray/30 text-center">
          Do not have a Nova Key?{" "}
          <a href="/checkout" className="text-sacred-gold hover:text-sacred-gold-light transition-colors">
            Get yours for $63
          </a>
        </p>
      </div>
    </div>
  );
}
