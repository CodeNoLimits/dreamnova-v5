"use client";

import { motion } from "framer-motion";
import { Nfc, Star, Package, Zap, ArrowUpRight, TrendingUp, Activity, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const stats = [
  {
    title: "Nova Keys",
    value: "1",
    change: "Active",
    icon: Nfc,
    color: "#D4AF37",
    positive: true,
  },
  {
    title: "Hafatsa Points",
    value: "148",
    change: "+12 this week",
    icon: Star,
    color: "#D4AF37",
    positive: true,
  },
  {
    title: "Total Orders",
    value: "1",
    change: "Delivered",
    icon: Package,
    color: "#00D4FF",
    positive: true,
  },
  {
    title: "NFC Scans",
    value: "23",
    change: "+5 today",
    icon: Zap,
    color: "#00D4FF",
    positive: true,
  },
];

const recentActivity = [
  { action: "NFC Scan", location: "Jerusalem, IL", time: "2 hours ago", points: "+5" },
  { action: "Daily Login", location: "Dashboard", time: "3 hours ago", points: "+2" },
  { action: "Content Shared", location: "Telegram", time: "Yesterday", points: "+10" },
  { action: "NFC Scan", location: "Tel Aviv, IL", time: "2 days ago", points: "+5" },
  { action: "Referral", location: "Email invite", time: "3 days ago", points: "+25" },
];

const levelProgress = {
  current: "Seeker",
  next: "Student",
  points: 148,
  required: 300,
};

export default function OverviewPage() {
  const progressPercent = (levelProgress.points / levelProgress.required) * 100;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        <h1 className="font-cinzel text-2xl lg:text-3xl text-sacred-white tracking-wide mb-2">
          Dashboard
        </h1>
        <p className="font-rajdhani text-sm text-sacred-gray mb-8">
          Welcome back to the Nova network. Here is your overview.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" as const }}
          >
            <Card variant="sacred" padding="md" hover>
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    border: `1px solid ${stat.color}25`,
                  }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              </div>
              <p className="font-cinzel text-2xl text-sacred-white">{stat.value}</p>
              <p className="font-rajdhani text-xs text-sacred-gray mt-1">{stat.title}</p>
              <p className="font-mono text-[10px] text-green-400 mt-2">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level progress */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
        >
          <Card variant="sacred" glow="gold" padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-sacred-gold" />
              <h2 className="font-cinzel text-base text-sacred-white">Level Progress</h2>
            </div>

            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-sacred-gold/20 mx-auto flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(212,175,55,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercent * 2.89} 289`}
                  />
                </svg>
                <div className="relative z-10">
                  <p className="font-cinzel text-xl text-sacred-gold">{levelProgress.points}</p>
                  <p className="font-mono text-[10px] text-sacred-gray">pts</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="font-rajdhani text-sm text-sacred-white">
                Level: <span className="text-sacred-gold font-semibold">{levelProgress.current}</span>
              </p>
              <p className="font-rajdhani text-xs text-sacred-gray mt-1">
                {levelProgress.required - levelProgress.points} points to {levelProgress.next}
              </p>
            </div>

            <div className="mt-6 w-full h-2 rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sacred-gold to-sacred-cyan"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" as const }}
        >
          <Card variant="sacred" padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-sacred-cyan" />
                <h2 className="font-cinzel text-base text-sacred-white">Recent Activity</h2>
              </div>
              <Button variant="ghost" size="sm" href="/hafatsa">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-sacred-gray/60" />
                    </div>
                    <div>
                      <p className="font-rajdhani text-sm text-sacred-white">{item.action}</p>
                      <p className="font-mono text-[10px] text-sacred-gray/50">{item.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-sacred-gold">{item.points}</p>
                    <p className="font-rajdhani text-[10px] text-sacred-gray/50">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" as const }}
      >
        <Button variant="outline" size="lg" fullWidth href="/tikkun">
          Tikkun HaKlali
        </Button>
        <Button variant="outline" size="lg" fullWidth href="/azamra">
          Azamra OS
        </Button>
        <Button variant="outline" size="lg" fullWidth href="/unlock">
          Scan Nova Key
        </Button>
      </motion.div>
    </div>
  );
}
