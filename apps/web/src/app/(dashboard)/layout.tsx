"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, Package, Star, Nfc, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/hafatsa", label: "Hafatsa", icon: Star },
  { href: "/nfc", label: "NFC Keys", icon: Nfc },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sacred-black flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sacred-black-medium border-r border-white/5 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sacred-gold" />
            <span className="font-cinzel text-base text-sacred-white tracking-[0.15em]">
              DREAM NOVA
            </span>
          </Link>
          <p className="font-mono text-[10px] text-sacred-gray/40 mt-1 ml-7">
            Dashboard v5.0
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-rajdhani transition-all ${
                  isActive
                    ? "bg-sacred-gold/10 text-sacred-gold border border-sacred-gold/20"
                    : "text-sacred-gray hover:text-sacred-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-rajdhani text-sacred-gray hover:text-red-400 hover:bg-red-500/5 transition-all w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-white/5 flex items-center px-4 lg:px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-sacred-gray hover:text-sacred-white transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center">
              <span className="font-cinzel text-xs text-sacred-gold">N</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
