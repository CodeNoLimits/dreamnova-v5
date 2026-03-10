"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Sun, Sparkles, RefreshCw, Heart, Save, History } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface AzamraEntry {
  id: string;
  text: string;
  goodPoint: string;
  createdAt: Date;
}

export default function AzamraPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [entries, setEntries] = useState<AzamraEntry[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFindGoodPoint(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    // Simulate AI processing with predefined Azamra responses
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const goodPoints = [
      `Even in this challenge, there is a sacred spark. The very awareness of "${input.trim().substring(0, 50)}" shows a soul that is paying attention. Rabbi Nachman teaches: the fact that you care enough to look for the good point means the good point already exists within you.`,
      `Rabbi Nachman says: "If you believe you can damage, believe you can repair." In what you described, the desire for repair is itself the good point. The spark of divine light in this situation is the yearning for something better.`,
      `The Azamra teaching tells us to find even a single good point and build upon it. In your situation, the good point is your willingness to examine, to seek, to grow. This is not a small thing — it is the foundation of all transformation.`,
      `"Azamra" — I will sing. Even when the melody seems lost, the musician who searches for the note is already making music. Your search itself is the good point that will become the melody of your rectification.`,
    ];

    const goodPoint = goodPoints[Math.floor(Math.random() * goodPoints.length)];
    setResult(goodPoint);

    const newEntry: AzamraEntry = {
      id: crypto.randomUUID(),
      text: input,
      goodPoint,
      createdAt: new Date(),
    };
    setEntries((prev) => [newEntry, ...prev]);

    setLoading(false);
  }

  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div className="w-16 h-16 rounded-2xl bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center mx-auto mb-6">
            <Sun className="w-8 h-8 text-sacred-gold" />
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide mb-3">
            Azamra{" "}
            <span className="sacred-gradient-text">OS</span>
          </h1>
          <p className="font-sacred text-lg italic text-sacred-gold/60 mb-4">
            &quot;I will sing to my God with whatever I have left&quot;
          </p>
          <p className="font-rajdhani text-base text-sacred-gray max-w-lg mx-auto">
            Based on Rabbi Nachman&apos;s teaching in Likutey Moharan I:282. Find the good
            point in yourself, in others, and in every situation. This is the foundation
            of all spiritual growth.
          </p>
        </motion.div>

        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
        >
          <Card variant="sacred" glow="gold" padding="lg">
            <form onSubmit={handleFindGoodPoint}>
              <label htmlFor="azamra-input" className="block font-cinzel text-base text-sacred-white mb-3">
                What are you struggling with?
              </label>
              <textarea
                id="azamra-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe a situation, a person, or something within yourself where you want to find the good point..."
                rows={4}
                className="w-full resize-none mb-4"
              />
              <Button
                type="submit"
                variant="sacred"
                size="lg"
                fullWidth
                loading={loading}
                icon={<Sparkles className="w-5 h-5" />}
              >
                Find the Good Point
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <Card variant="glass" padding="lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-sacred-gold" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base text-sacred-gold mb-2">
                    The Good Point
                  </h3>
                  <p className="font-rajdhani text-base text-sacred-white/90 leading-relaxed">
                    {result}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={() => {
                    setResult(null);
                    setInput("");
                  }}
                >
                  New Search
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* History */}
        {entries.length > 1 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <div className="flex items-center gap-3 mb-4">
              <History className="w-5 h-5 text-sacred-gray" />
              <h2 className="font-cinzel text-lg text-sacred-white">Recent Entries</h2>
            </div>
            <div className="space-y-3">
              {entries.slice(1, 6).map((entry) => (
                <Card key={entry.id} variant="outlined" padding="sm">
                  <p className="font-rajdhani text-sm text-sacred-gray line-clamp-1">
                    {entry.text}
                  </p>
                  <p className="font-rajdhani text-xs text-sacred-gold/60 mt-1 line-clamp-2">
                    {entry.goodPoint}
                  </p>
                  <p className="font-mono text-[10px] text-sacred-gray/30 mt-2">
                    {entry.createdAt.toLocaleString()}
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Teaching reference */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <Card variant="glass" padding="md">
            <p className="font-sacred text-sm italic text-sacred-white/60 leading-relaxed">
              &quot;Know that you must judge every person favorably. Even someone who is
              completely wicked, you must search and find in him some small good point,
              where in that point he is not wicked. And by finding in him this small
              good point and judging him favorably, you actually raise him to the scale
              of merit.&quot;
            </p>
            <p className="font-rajdhani text-xs text-sacred-gold/40 mt-3">
              — Likutey Moharan I:282 (Azamra)
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
