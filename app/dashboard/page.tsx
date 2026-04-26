"use client";

import { motion } from "framer-motion";
import { BentoGrid } from "@/components/bento-grid";
import { Bell, Search, Layers3 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Sticky Glassmorphism Nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="sticky top-0 z-50 flex items-center gap-4 px-6 h-16"
        style={{
          background: "rgba(2, 6, 23, 0.72)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: "0 1px 0 rgba(99,102,241,0.08)",
        }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-2.5 mr-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            <Layers3 className="w-4 h-4" style={{ color: "#a855f7" }} />
          </div>
          <span className="hidden sm:block text-sm font-semibold tracking-tight text-balance font-sans" style={{ color: "#e8eaf6" }}>
            Lumen NEX
          </span>
        </div>

        {/* Page breadcrumb */}
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-xs font-mono" style={{ color: "var(--color-muted)" }}>
            dashboard
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span className="text-xs font-mono font-medium" style={{ color: "#818cf8" }}>
            home
          </span>
        </div>

        {/* ── Status Chip ── */}
        <div className="hidden lg:flex items-center gap-2 ml-2">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#6366f1" }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[11px] font-mono" style={{ color: "#818cf8" }}>
              3 agents active
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Search ── */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            minWidth: "180px",
          }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-muted)" }} />
          <input
            type="search"
            placeholder="Ask the agent..."
            className="bg-transparent text-xs outline-none w-full font-sans"
            style={{
              color: "var(--color-foreground)",
              caretColor: "#6366f1",
            }}
            aria-label="Search or ask the AI agent"
          />
          <kbd
            className="hidden md:block text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "var(--color-muted)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* ── Notifications ── */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          aria-label="Notifications — 3 unread"
        >
          <Bell className="w-4 h-4" style={{ color: "var(--color-muted-foreground)" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{
              background: "#ef4444",
              boxShadow: "0 0 6px rgba(239,68,68,0.7)",
            }}
            aria-hidden="true"
          />
        </motion.button>

        {/* ── Avatar ── */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-semibold font-mono flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%)",
            border: "1px solid rgba(168,85,247,0.2)",
            color: "#c4b5fd",
          }}
          role="img"
          aria-label="User avatar"
        >
          LN
        </div>
      </motion.header>

      {/* ── Bento Grid (with integrated hero) ── */}
      <main className="flex-1 px-6 py-8 md:py-12" role="main">
        <BentoGrid />
      </main>
    </div>
  );
}
