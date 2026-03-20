"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

const planNames: Record<string, string> = {
  yachid: "Yachid — Individual",
  kehila: "Kehila — Community",
  mosdot: "Mosdot — Institution",
};

function SuccessContent() {
  const params = useSearchParams();
  const plan = params.get("plan") || "yachid";
  const planName = planNames[plan] || plan;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-amber-400" />
        </div>

        <h1 className="font-cinzel text-3xl font-bold mb-3">
          Welcome to Breslov AI
        </h1>
        <p className="text-amber-400 font-mono text-sm mb-2">{planName}</p>
        <p className="text-gray-400 mb-8">
          Your 7-day free trial has started. You will receive a confirmation
          email shortly.
        </p>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8 text-left space-y-3">
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-amber-400 shrink-0" />
            <span className="text-sm text-gray-300">
              Access all 80MB of Breslov source texts
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-amber-400 shrink-0" />
            <span className="text-sm text-gray-300">
              FR / HE / EN with voice responses
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-amber-400 shrink-0" />
            <span className="text-sm text-gray-300">
              No charge for 7 days — cancel anytime
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Start asking <ArrowRight size={16} />
          </Link>
          <p className="text-gray-600 text-xs">
            Questions?{" "}
            <a
              href="mailto:dreamnovaultimate@gmail.com"
              className="text-amber-400 hover:underline"
            >
              dreamnovaultimate@gmail.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RagSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-amber-400 font-mono text-sm">Loading…</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
