"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Volume2, RotateCcw, Star, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const psalms = [
  { number: 16, hebrew: "טז", title: "Michtam of David", verses: 11 },
  { number: 32, hebrew: "לב", title: "A Maskil of David", verses: 11 },
  { number: 41, hebrew: "מא", title: "For the Conductor", verses: 14 },
  { number: 42, hebrew: "מב", title: "For the Conductor, a Maskil", verses: 12 },
  { number: 59, hebrew: "נט", title: "For the Conductor, Do Not Destroy", verses: 18 },
  { number: 77, hebrew: "עז", title: "For the Conductor, on Jeduthun", verses: 21 },
  { number: 90, hebrew: "צ", title: "A Prayer of Moses", verses: 17 },
  { number: 105, hebrew: "קה", title: "Give Thanks to HaShem", verses: 45 },
  { number: 137, hebrew: "קלז", title: "By the Rivers of Babylon", verses: 9 },
  { number: 150, hebrew: "קנ", title: "Hallelujah, Praise God", verses: 6 },
];

export default function TikkunPage() {
  const [currentPsalm, setCurrentPsalm] = useState(0);
  const [completedPsalms, setCompletedPsalms] = useState<Set<number>>(new Set());

  function markComplete(index: number) {
    const updated = new Set(completedPsalms);
    updated.add(index);
    setCompletedPsalms(updated);
    if (index < psalms.length - 1) {
      setCurrentPsalm(index + 1);
    }
  }

  function resetProgress() {
    setCompletedPsalms(new Set());
    setCurrentPsalm(0);
  }

  const progress = (completedPsalms.size / psalms.length) * 100;
  const isComplete = completedPsalms.size === psalms.length;

  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div className="w-16 h-16 rounded-2xl bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-sacred-gold" />
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide mb-3">
            Tikkun{" "}
            <span className="sacred-gradient-text">HaKlali</span>
          </h1>
          <p className="font-rajdhani text-base text-sacred-gray max-w-lg mx-auto">
            The General Remedy — Ten Psalms prescribed by Rabbi Nachman of Breslov
            as a complete rectification for the soul.
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-rajdhani text-sm text-sacred-gray">
              {completedPsalms.size}/{psalms.length} Psalms
            </span>
            <span className="font-mono text-xs text-sacred-gold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sacred-gold to-sacred-cyan"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
            />
          </div>
        </motion.div>

        {isComplete ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
          >
            <Card variant="sacred" glow="gold" padding="lg">
              <Star className="w-16 h-16 text-sacred-gold mx-auto mb-4" />
              <h2 className="font-cinzel text-3xl text-sacred-white mb-3">
                Tikkun Complete
              </h2>
              <p className="font-sacred text-lg italic text-sacred-gold/60 mb-2">
                Na Nach Nachma Nachman MeUman
              </p>
              <p className="font-rajdhani text-base text-sacred-gray mb-8 max-w-md mx-auto">
                You have completed the Tikkun HaKlali. May this recitation bring complete
                rectification to your soul and to the entire world.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="primary" size="lg" onClick={resetProgress} icon={<RotateCcw className="w-4 h-4" />}>
                  Start Again
                </Button>
                <Button variant="outline" size="lg" href="/overview">
                  Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {psalms.map((psalm, index) => {
              const isCompleted = completedPsalms.has(index);
              const isCurrent = index === currentPsalm;

              return (
                <motion.div
                  key={psalm.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "easeOut" as const,
                  }}
                >
                  <Card
                    variant={isCurrent ? "sacred" : isCompleted ? "glass" : "outlined"}
                    hover
                    glow={isCurrent ? "gold" : "none"}
                    padding="md"
                    className={`cursor-pointer transition-all ${
                      isCompleted ? "opacity-60" : ""
                    }`}
                  >
                    <button
                      className="w-full text-left"
                      onClick={() => {
                        if (!isCompleted) {
                          setCurrentPsalm(index);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isCompleted
                                ? "bg-green-500/10 border border-green-500/20"
                                : isCurrent
                                ? "bg-sacred-gold/10 border border-sacred-gold/30"
                                : "bg-white/5 border border-white/10"
                            }`}
                          >
                            {isCompleted ? (
                              <Heart className="w-5 h-5 text-green-400" />
                            ) : (
                              <span
                                className={`font-cinzel text-sm ${
                                  isCurrent ? "text-sacred-gold" : "text-sacred-gray"
                                }`}
                              >
                                {psalm.hebrew}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-cinzel text-base text-sacred-white">
                              Psalm {psalm.number}
                            </p>
                            <p className="font-rajdhani text-xs text-sacred-gray">
                              {psalm.title} | {psalm.verses} verses
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCurrent && !isCompleted && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markComplete(index);
                              }}
                            >
                              Complete
                            </Button>
                          )}
                          <ChevronRight
                            className={`w-4 h-4 ${
                              isCurrent ? "text-sacred-gold" : "text-sacred-gray/30"
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
