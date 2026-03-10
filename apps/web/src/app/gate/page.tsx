"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid access code. Contact enterprise@dreamnova.com for access.");
        setPassword("");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
            <Lock className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1
            className="text-2xl tracking-[0.2em] text-white mb-2"
            style={{ fontFamily: "serif" }}
          >
            DREAM NOVA
          </h1>
          <p className="text-sm text-[#8888AA] tracking-wider uppercase"
            style={{ fontFamily: "monospace", fontSize: "10px" }}
          >
            Autonomous Defense Platform — Confidential
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="access-code"
              className="block text-xs text-[#8888AA] mb-2 uppercase tracking-wider"
              style={{ fontFamily: "sans-serif" }}
            >
              Access Code
            </label>
            <input
              id="access-code"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your access code"
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl bg-[#111118] border border-white/10 text-white placeholder-[#8888AA]/50 focus:border-[#D4AF37]/40 focus:ring-2 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
              style={{ fontFamily: "monospace", fontSize: "14px" }}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400" style={{ fontFamily: "sans-serif" }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] text-[#050508] font-bold text-sm tracking-wide hover:bg-[#E8C960] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            style={{ fontFamily: "sans-serif" }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#050508]/30 border-t-[#050508] rounded-full animate-spin" />
            ) : (
              <>
                Access Platform
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-[#8888AA]/40" style={{ fontFamily: "monospace" }}>
          This platform contains confidential information.
          <br />
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
