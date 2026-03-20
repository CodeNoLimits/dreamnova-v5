"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, MessageCircle, Mic, Zap, Globe, Users, Building2,
  Check, ArrowRight, Star, Lock, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const plans = [
  {
    key: "yachid",
    name: "Yachid",
    subtitle: "Individual",
    price: "$9",
    period: "/month",
    questions: "100 questions/month",
    features: ["FR + HE + EN", "Voice responses (TTS)", "All books included", "Email support"],
    cta: "Start free trial",
    highlight: false,
  },
  {
    key: "kehila",
    name: "Kehila",
    subtitle: "Community",
    price: "$49",
    period: "/month",
    questions: "Unlimited questions",
    features: ["Everything in Yachid", "Up to 50 members", "Custom Shul branding", "Priority support", "Usage analytics"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    key: "mosdot",
    name: "Mosdot",
    subtitle: "Institution",
    price: "$149",
    period: "/month",
    questions: "Unlimited + API access",
    features: ["Everything in Kehila", "Unlimited members", "White-label option", "Dedicated account manager", "Custom corpus upload"],
    cta: "Start free trial",
    highlight: false,
  },
];

const corpus = [
  { he: "ליקוטי מוהרן", fr: "Likoutei Moharan I & II" },
  { he: "ליקוטי תפילות", fr: "Likoutei Tefilot" },
  { he: "חיי מוהרן", fr: "Chayei Moharan" },
  { he: "ספורי מעשיות", fr: "Sipourei Ma'asiyot" },
  { he: "שיבחי הרן", fr: "Shivchei HaRan" },
  { he: "ליקוטי הלכות", fr: "Likoutei Halakhot (FR)" },
];

const features = [
  {
    icon: BookOpen,
    title: "80MB of source texts",
    desc: "14 Hebrew books + full French translations by Avraham Guezi. Local FAISS — no Sefaria, no internet dependency.",
  },
  {
    icon: Zap,
    title: "Answer in ~2.5 seconds",
    desc: "FAISS retrieval in 5ms, Gemini 2.5 Pro streaming, TTS Charon voice synthesis in parallel.",
  },
  {
    icon: Globe,
    title: "FR / HE / EN",
    desc: "Auto-detects your language. Hebrew sources translated inline — one API call, zero extra latency.",
  },
  {
    icon: Mic,
    title: "Voice of Rabbi Nachman",
    desc: "Every answer is read aloud by TTS Charon — meditative listening, not just reading.",
  },
  {
    icon: Lock,
    title: "Private & local corpus",
    desc: "Your questions are not used for training. The corpus runs on our servers, never shared publicly.",
  },
  {
    icon: MessageCircle,
    title: "Citations with every answer",
    desc: "Every response includes exact source references (book, chapter, verse) highlighted in gold.",
  },
];

const demoQuestions = [
  { q: "What is the remedy for sadness according to Rabbi Nachman?", lang: "EN" },
  { q: "Comment surmonter les pensées négatives ?", lang: "FR" },
  { q: "מהי מעלת התשובה לפי רבי נחמן?", lang: "HE" },
];

export default function BreslovRAGPage() {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");

  async function handleCheckout(planKey: string) {
    const email = emailInput || prompt("Your email address:");
    if (!email) return;
    setCheckoutLoading(planKey);
    try {
      const res = await fetch("/api/stripe/rag-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey.toLowerCase(), email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout unavailable. Email: dreamnovaultimate@gmail.com");
      }
    } catch {
      alert("Checkout unavailable. Email: dreamnovaultimate@gmail.com");
    } finally {
      setCheckoutLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative"
        >
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-mono mb-6 border border-amber-400/20 rounded-full px-4 py-1.5">
            <Star size={12} fill="currentColor" />
            Powered by 80MB of Breslov source texts — no internet
          </div>

          <h1 className="font-cinzel text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Ask{" "}
            <span className="text-amber-400">Rabbi Nachman</span>
            <br />
            anything.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Breslov AI — the first RAG chatbot trained exclusively on authentic
            Breslov texts (HE + FR + EN). Voice answers in 2.5 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
              Try free — 3 questions <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="ghost" className="border border-white/20 hover:border-amber-400/50">
              See pricing
            </Button>
          </div>

          <p className="text-gray-600 text-sm mt-4">No credit card required · FR / HE / EN</p>
        </motion.div>
      </section>

      {/* Demo questions */}
      <section className="py-12 px-6 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-500 text-sm mb-6 font-mono">EXAMPLE QUESTIONS</p>
          <div className="space-y-3">
            {demoQuestions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:border-amber-400/30 cursor-pointer group transition-colors"
              >
                <span className="text-xs font-mono text-amber-400/60 w-8 shrink-0">{item.lang}</span>
                <span className="text-gray-300 group-hover:text-white transition-colors">{item.q}</span>
                <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-amber-400 transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-cinzel text-2xl md:text-3xl text-center mb-12">
            Built different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-6 bg-white/[0.03] border-white/10 hover:border-amber-400/20 transition-colors h-full">
                  <f.icon className="text-amber-400 mb-3" size={20} />
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corpus */}
      <section className="py-16 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-cinzel text-2xl mb-2">The corpus</h2>
          <p className="text-gray-500 mb-10">80MB of authentic texts. Local. Private. Complete.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {corpus.map((b, i) => (
              <div key={i} className="p-4 rounded-lg border border-white/10 text-left">
                <div className="text-amber-400/80 text-base mb-1 font-hebrew" dir="rtl">{b.he}</div>
                <div className="text-gray-400 text-xs">{b.fr}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-6">+ Sichot HaRan, Alim LiTrufa, Hishtapkhut HaNefesh, and more</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-cinzel text-2xl md:text-3xl text-center mb-4">Pricing</h2>
          <p className="text-gray-500 text-center mb-12">For individuals, synagogues, and institutions</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  plan.highlight
                    ? "border-amber-400 bg-amber-950/20"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-gray-500 text-sm">{plan.subtitle}</div>
                  <div className="text-amber-400/80 text-xs mt-2 font-mono">{plan.questions}</div>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check size={12} className="text-amber-400 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={checkoutLoading === plan.key}
                  className={`w-full ${
                    plan.highlight
                      ? "bg-amber-500 hover:bg-amber-400 text-black font-bold"
                      : "border border-white/20 hover:border-amber-400/50 bg-transparent"
                  }`}
                >
                  {checkoutLoading === plan.key ? (
                    <><Loader2 size={14} className="animate-spin" /> Processing…</>
                  ) : plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-sm mt-8">
            IIA-funded institutions may qualify for subsidized access.{" "}
            <a href="/contact" className="text-amber-400 hover:underline">Contact us.</a>
          </p>
        </div>
      </section>

      {/* Social proof placeholder */}
      <section className="py-16 px-6 bg-white/[0.02] text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-8 mb-8 text-center">
            {[
              { icon: Users, val: "10+", label: "Communities piloting" },
              { icon: BookOpen, val: "80MB", label: "Source texts" },
              { icon: Globe, val: "3", label: "Languages" },
              { icon: Building2, val: "2.5s", label: "Avg response time" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <s.icon size={16} className="text-amber-400 mb-1" />
                <div className="text-xl font-bold">{s.val}</div>
                <div className="text-gray-600 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-cinzel text-2xl md:text-3xl mb-4">
            Bring Rabbi Nachman's wisdom<br />to your community.
          </h2>
          <p className="text-gray-500 mb-8">
            3 free questions to start. No signup required.
          </p>
          <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8">
            Start asking <ArrowRight size={16} />
          </Button>
          <p className="text-gray-600 text-xs mt-4">
            Built by DreamNova · Jerusalem 2026 ·{" "}
            <a href="mailto:dreamnovaultimate@gmail.com" className="hover:text-amber-400 transition-colors">
              dreamnovaultimate@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
