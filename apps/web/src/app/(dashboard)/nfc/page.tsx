"use client";

import { motion } from "framer-motion";
import { Nfc, CheckCircle, MapPin, Clock, Activity, Shield, Plus, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const keys = [
  {
    id: "NK-2026-0063",
    serial: "04:A3:B2:C1:D0:E9:F8",
    chipType: "DESFire EV3",
    activated: true,
    activatedAt: "March 6, 2026",
    lastScan: "2 hours ago",
    totalScans: 23,
  },
];

const recentScans = [
  { time: "2 hours ago", location: "Jerusalem, IL", device: "iPhone 16 Pro" },
  { time: "Yesterday", location: "Jerusalem, IL", device: "iPhone 16 Pro" },
  { time: "2 days ago", location: "Tel Aviv, IL", device: "Samsung Galaxy S25" },
  { time: "4 days ago", location: "Jerusalem, IL", device: "iPhone 16 Pro" },
];

export default function NfcPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cinzel text-2xl lg:text-3xl text-sacred-white tracking-wide mb-2">
              NFC Keys
            </h1>
            <p className="font-rajdhani text-sm text-sacred-gray">
              Manage your Nova Keys and view scan history.
            </p>
          </div>
          <Button variant="outline" size="sm" href="/checkout" icon={<Plus className="w-4 h-4" />}>
            Add Key
          </Button>
        </div>
      </motion.div>

      {/* Key cards */}
      <div className="space-y-4 mb-8">
        {keys.map((key, index) => (
          <motion.div
            key={key.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" as const }}
          >
            <Card variant="sacred" glow="gold" padding="lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-sacred-gold/10 border border-sacred-gold/30 flex items-center justify-center shrink-0">
                    <Nfc className="w-7 h-7 text-sacred-gold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-cinzel text-lg text-sacred-white">{key.id}</h3>
                      {key.activated && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-mono">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-sacred-gray/40" />
                        <span className="font-mono text-xs text-sacred-gray">{key.chipType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-sacred-gray/40" />
                        <span className="font-mono text-xs text-sacred-gray">{key.totalScans} scans</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-sacred-gray/40" />
                        <span className="font-mono text-xs text-sacred-gray">Since {key.activatedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Nfc className="w-3 h-3 text-sacred-gray/40" />
                        <span className="font-mono text-xs text-sacred-gray">{key.serial}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-rajdhani text-xs text-sacred-gray">Last scan</p>
                  <p className="font-rajdhani text-sm text-sacred-white">{key.lastScan}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent scans */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
      >
        <h2 className="font-cinzel text-lg text-sacred-white mb-4">Recent Scans</h2>
        <Card variant="sacred" padding="none">
          <div className="divide-y divide-white/5">
            {recentScans.map((scan, index) => (
              <div key={index} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sacred-cyan/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-sacred-cyan" />
                  </div>
                  <div>
                    <p className="font-rajdhani text-sm text-sacred-white">{scan.location}</p>
                    <p className="font-mono text-[10px] text-sacred-gray/50">{scan.device}</p>
                  </div>
                </div>
                <span className="font-rajdhani text-xs text-sacred-gray">{scan.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
