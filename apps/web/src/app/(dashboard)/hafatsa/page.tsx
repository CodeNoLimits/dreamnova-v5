"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Share2, Flame, Award, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";

const levels = [
  { name: "Seeker", minPoints: 0, icon: "🌱" },
  { name: "Student", minPoints: 300, icon: "📖" },
  { name: "Practitioner", minPoints: 1000, icon: "🔥" },
  { name: "Teacher", minPoints: 3000, icon: "💡" },
  { name: "Tzaddik", minPoints: 10000, icon: "⭐" },
  { name: "Tikkun Master", minPoints: 61300, icon: "👑" },
];

const earningMethods = [
  { action: "NFC Scan", points: "+5", frequency: "Per scan", icon: Star },
  { action: "Daily Login", points: "+2", frequency: "Daily", icon: Flame },
  { action: "Content Share", points: "+10", frequency: "Per share", icon: Share2 },
  { action: "Referral", points: "+25", frequency: "Per referral", icon: Users },
  { action: "Tikkun Completion", points: "+50", frequency: "Per completion", icon: Award },
  { action: "Weekly Streak", points: "+100", frequency: "7-day streak", icon: Target },
];

const currentPoints = 148;
const currentLevel = levels.findIndex(
  (l, i) => currentPoints >= l.minPoints && (i === levels.length - 1 || currentPoints < levels[i + 1].minPoints)
);
const nextLevel = levels[currentLevel + 1];
const progressToNext = nextLevel
  ? ((currentPoints - levels[currentLevel].minPoints) / (nextLevel.minPoints - levels[currentLevel].minPoints)) * 100
  : 100;

export default function HafatsaPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        <h1 className="font-cinzel text-2xl lg:text-3xl text-sacred-white tracking-wide mb-2">
          Hafatsa Points
        </h1>
        <p className="font-rajdhani text-sm text-sacred-gray mb-8">
          Track your sacred distribution progress and earn rewards.
        </p>
      </motion.div>

      {/* Points overview */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" as const }}
        className="mb-8"
      >
        <Card variant="sacred" glow="gold" padding="lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-left">
              <p className="font-rajdhani text-sm text-sacred-gray mb-1">Total Points</p>
              <p className="font-cinzel text-5xl text-sacred-gold">{currentPoints}</p>
              <p className="font-rajdhani text-sm text-sacred-gray mt-2">
                Level: <span className="text-sacred-gold font-semibold">{levels[currentLevel].name}</span>
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="font-rajdhani text-xs text-sacred-gray">
                  {levels[currentLevel].name}
                </span>
                {nextLevel && (
                  <span className="font-rajdhani text-xs text-sacred-gray">
                    {nextLevel.name} ({nextLevel.minPoints} pts)
                  </span>
                )}
              </div>
              <div className="w-full h-3 rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sacred-gold to-sacred-cyan"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" as const }}
                />
              </div>
              {nextLevel && (
                <p className="font-mono text-xs text-sacred-gray/50 mt-2">
                  {nextLevel.minPoints - currentPoints} points remaining
                </p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Level map */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
        className="mb-8"
      >
        <h2 className="font-cinzel text-lg text-sacred-white mb-4">Level Map</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {levels.map((level, index) => {
            const isReached = index <= currentLevel;
            return (
              <Card
                key={level.name}
                variant={isReached ? "sacred" : "outlined"}
                padding="sm"
                className={`text-center ${!isReached ? "opacity-40" : ""}`}
              >
                <p className="text-2xl mb-1">{level.icon}</p>
                <p className="font-cinzel text-xs text-sacred-white">{level.name}</p>
                <p className="font-mono text-[10px] text-sacred-gray/50">
                  {level.minPoints.toLocaleString()} pts
                </p>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Earning methods */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
      >
        <h2 className="font-cinzel text-lg text-sacred-white mb-4">How to Earn Points</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earningMethods.map((method, index) => (
            <Card key={method.action} variant="glass" padding="md" hover>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center shrink-0">
                  <method.icon className="w-5 h-5 text-sacred-gold" />
                </div>
                <div className="flex-1">
                  <p className="font-rajdhani text-sm text-sacred-white">{method.action}</p>
                  <p className="font-mono text-[10px] text-sacred-gray/50">{method.frequency}</p>
                </div>
                <span className="font-mono text-sm text-sacred-gold font-bold">{method.points}</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
