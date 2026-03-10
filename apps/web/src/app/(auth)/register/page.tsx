"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Contains a number", pass: /\d/.test(password) },
    { label: "Contains uppercase", pass: /[A-Z]/.test(password) },
    { label: "Passwords match", pass: password === confirmPassword && password.length > 0 },
  ];

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { createClient } = await import("@/lib/supabase");
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success("Account created. Check your email to confirm.");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-sacred-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

        <motion.div
          className="relative z-10 w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <Card variant="sacred" glow="gold" padding="lg">
            <Mail className="w-12 h-12 text-sacred-gold mx-auto mb-4" />
            <h2 className="font-cinzel text-2xl text-sacred-white mb-3">
              Check Your Email
            </h2>
            <p className="font-rajdhani text-base text-sacred-gray mb-6">
              We sent a confirmation link to <strong className="text-sacred-white">{email}</strong>.
              Click the link to activate your Nova account.
            </p>
            <Button variant="outline" size="lg" fullWidth href="/login">
              Back to Sign In
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-sacred-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-sacred-gold" />
            <span className="font-cinzel text-xl text-sacred-white tracking-[0.2em]">
              DREAM NOVA
            </span>
          </Link>
          <h1 className="font-cinzel text-3xl text-sacred-white tracking-wide mb-2">
            Join the Covenant
          </h1>
          <p className="font-rajdhani text-base text-sacred-gray">
            Create your account and begin the journey.
          </p>
        </div>

        <Card variant="sacred" glow="gold" padding="lg">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="reg-name" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sacred-gray/50" />
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sacred-gray/50" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sacred-gray/50" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sacred-gray/50 hover:text-sacred-gray transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sacred-gray/50" />
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-10"
                />
              </div>
            </div>

            {password.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    <Check
                      className={`w-3 h-3 ${
                        check.pass ? "text-green-400" : "text-sacred-gray/30"
                      }`}
                    />
                    <span
                      className={`font-rajdhani text-xs ${
                        check.pass ? "text-green-400" : "text-sacred-gray/50"
                      }`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Create Account
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center font-rajdhani text-sm text-sacred-gray">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-sacred-gold hover:text-sacred-gold-light transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
