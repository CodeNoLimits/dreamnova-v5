"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, Globe, Trash2, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Nova User");
  const [hebrewName, setHebrewName] = useState("");
  const [email] = useState("user@example.com");
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    hafatsaReports: true,
    newFeatures: false,
    communityDigest: true,
  });
  const [loading, setLoading] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    toast.success("Settings saved successfully.");
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        <h1 className="font-cinzel text-2xl lg:text-3xl text-sacred-white tracking-wide mb-2">
          Settings
        </h1>
        <p className="font-rajdhani text-sm text-sacred-gray mb-8">
          Manage your account preferences and security.
        </p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" as const }}
        >
          <Card variant="sacred" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-sacred-gold" />
              <h2 className="font-cinzel text-base text-sacred-white">Profile</h2>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="settings-name" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                  Display Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="settings-hebrew" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                  Hebrew Name (optional)
                </label>
                <input
                  id="settings-hebrew"
                  type="text"
                  value={hebrewName}
                  onChange={(e) => setHebrewName(e.target.value)}
                  placeholder="Your Hebrew name"
                  className="w-full"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-sm text-sacred-gray mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full opacity-60 cursor-not-allowed"
                />
                <p className="font-rajdhani text-xs text-sacred-gray/50 mt-1">
                  Contact support to change your email address.
                </p>
              </div>
              <Button type="submit" variant="primary" loading={loading} icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
        >
          <Card variant="sacred" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-sacred-cyan" />
              <h2 className="font-cinzel text-base text-sacred-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => {
                const labels: Record<string, string> = {
                  orderUpdates: "Order updates and shipping notifications",
                  hafatsaReports: "Weekly Hafatsa progress reports",
                  newFeatures: "New features and product announcements",
                  communityDigest: "Community digest and events",
                };
                return (
                  <label key={key} className="flex items-center justify-between cursor-pointer group">
                    <span className="font-rajdhani text-sm text-sacred-gray group-hover:text-sacred-white transition-colors">
                      {labels[key]}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [key]: !prev[key as keyof typeof prev],
                        }))
                      }
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        value ? "bg-sacred-gold" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          value ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
        >
          <Card variant="sacred" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-sacred-gold" />
              <h2 className="font-cinzel text-base text-sacred-white">Security</h2>
            </div>
            <div className="space-y-4">
              <Button variant="outline" fullWidth>
                Change Password
              </Button>
              <Button variant="outline" fullWidth>
                Enable Two-Factor Authentication
              </Button>
              <Button variant="outline" fullWidth>
                Download My Data
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
        >
          <Card variant="outlined" padding="lg" className="border-red-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
              <h2 className="font-cinzel text-base text-red-400">Danger Zone</h2>
            </div>
            <p className="font-rajdhani text-sm text-sacred-gray mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
              Your Nova Key will be deactivated and Hafatsa points will be forfeited.
            </p>
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>
              Delete Account
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
