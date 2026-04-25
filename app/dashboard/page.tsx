"use client";

import { motion } from "framer-motion";
import { BentoGrid } from "@/components/bento-grid";
import { AgenticFeed } from "@/components/agentic-feed";
import { Bell, Search } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
      {/* Left: Main content */}
      <div className="flex-1 flex flex-col min-w-0 p-5 md:p-6 gap-6">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-balance" style={{ color: "var(--color-foreground)" }}>
              Command Center
            </h1>
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
              Your autonomous business overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className="hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-2"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <Search className="w-3.5 h-3.5" style={{ color: "var(--color-muted)" }} />
              <input
                type="search"
                placeholder="Ask the agent..."
                className="bg-transparent text-sm outline-none w-40 placeholder:text-[var(--color-muted)]"
                style={{ color: "var(--color-foreground)" }}
                aria-label="Search or ask the AI agent"
              />
              <kbd
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: "var(--color-surface)", color: "var(--color-muted)" }}
              >
                ⌘K
              </kbd>
            </div>
            {/* Notifications */}
            <button
              className="relative w-9 h-9 glass rounded-xl flex items-center justify-center"
              style={{ border: "1px solid var(--color-border)" }}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" style={{ color: "var(--color-muted-foreground)" }} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.6)" }}
                aria-label="3 unread notifications"
              />
            </button>
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(99,102,241,0.15)", color: "#8b5cf6", border: "1px solid rgba(99,102,241,0.3)" }}
              role="img"
              aria-label="User avatar"
            >
              LN
            </div>
          </div>
        </header>

        {/* NexusCore status bar */}
        <div
          className="glass-bright rounded-2xl px-5 py-4 flex items-center gap-5"
          style={{ border: "1px solid rgba(99,102,241,0.2)" }}
        >
          {/* Lightweight pulsing orb — avoids mounting a full WebGL canvas in a small slot */}
          <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center" aria-hidden="true">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(99,102,241,0.12)" }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="w-6 h-6 rounded-full"
              style={{
                background: "radial-gradient(circle at 35% 35%, #8b5cf6, rgba(99,102,241,0.4))",
                boxShadow: "0 0 16px rgba(99,102,241,0.6)",
              }}
            />
          </div>
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-0.5"
              style={{ color: "#8b5cf6" }}
            >
              Nexus Core — Idle
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
              All systems nominal · 3 agents active
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-4">
            {[
              { label: "Uptime", value: "99.98%" },
              { label: "Latency", value: "42ms" },
              { label: "Ops/min", value: "1,284" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xs font-bold" style={{ color: "var(--color-foreground)" }}>
                  {s.value}
                </p>
                <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <BentoGrid />
      </div>

      {/* Right: Agentic Feed */}
      <aside
        className="hidden lg:flex flex-col w-80 xl:w-96 flex-shrink-0 p-5 h-screen sticky top-0 overflow-y-auto"
        style={{ borderLeft: "1px solid var(--color-border)" }}
      >
        <AgenticFeed className="h-full" />
      </aside>
    </div>
  );
}
