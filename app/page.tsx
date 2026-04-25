"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, Cpu, Globe, Lock } from "lucide-react";
import { BackgroundBeams } from "@/components/background-beams";
import { NexusCore } from "@/components/nexus-core";

const FEATURES = [
  {
    icon: Zap,
    color: "#00d4aa",
    title: "Agentic Automation",
    desc: "AI agents orchestrate revenue, outreach, and task execution 24/7 with zero manual intervention.",
  },
  {
    icon: TrendingUp,
    color: "#6366f1",
    title: "Revenue Intelligence",
    desc: "Real-time market signals and predictive analytics surface growth opportunities before competitors act.",
  },
  {
    icon: Shield,
    color: "#f59e0b",
    title: "Secure by Design",
    desc: "Enterprise-grade CSP headers, rate limiting, and encrypted data pipelines — hardened from day one.",
  },
  {
    icon: Cpu,
    color: "#0ea5e9",
    title: "Reasoning Feed",
    desc: "Watch your agents think in real time. Every chain-of-thought step is surfaced and auditable.",
  },
  {
    icon: Globe,
    color: "#00d4aa",
    title: "Multi-Channel",
    desc: "Connect WhatsApp, Stripe, Notion, and 60+ integrations under one orchestration layer.",
  },
  {
    icon: Lock,
    color: "#6366f1",
    title: "Compliance Ready",
    desc: "GDPR-aligned data flows with per-user audit logs and configurable retention policies.",
  },
];

const STATS = [
  { value: "1,284", label: "Ops / min" },
  { value: "99.98%", label: "Uptime" },
  { value: "42ms", label: "P99 Latency" },
  { value: "3×", label: "Revenue Lift" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <BackgroundBeams />

      {/* ── Nav ── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-12 h-16"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,9,12,0.7)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,212,170,0.15)", border: "1px solid rgba(0,212,170,0.35)" }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: "#00d4aa" }} />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "#f0f2f8" }}>
            Lumen NEX
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          {["Features", "Integrations", "Security", "Docs"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs font-medium transition-colors"
              style={{ color: "rgba(240,242,248,0.45)" }}
            >
              {item}
            </a>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
          style={{
            background: "rgba(0,212,170,0.12)",
            border: "1px solid rgba(0,212,170,0.3)",
            color: "#00d4aa",
          }}
        >
          Enter Dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center">

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-mono uppercase tracking-widest"
              style={{
                background: "rgba(0,212,170,0.08)",
                border: "1px solid rgba(0,212,170,0.22)",
                color: "#00d4aa",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#00d4aa", boxShadow: "0 0 6px #00d4aa" }}
              />
              Autonomous · Intelligent · 2030-ready
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl"
          >
            Your Business&apos;s{" "}
            <span style={{ color: "#00d4aa", textShadow: "0 0 40px rgba(0,212,170,0.55)" }}>
              Autonomous
            </span>{" "}
            Intelligence Layer
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-pretty text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
            style={{ color: "rgba(240,242,248,0.6)" }}
          >
            Lumen NEX orchestrates revenue, tasks, and market signals with AI agents —
            so you focus on building, not managing.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 mb-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "#00d4aa",
                color: "#08090c",
                boxShadow: "0 0 32px rgba(0,212,170,0.5), 0 4px 24px rgba(0,212,170,0.2)",
              }}
            >
              Enter Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0f2f8",
              }}
            >
              Watch Demo
            </button>
          </motion.div>

          {/* 3-D Orb */}
          <motion.div variants={fadeUp}>
            <NexusCore size={300} state="idle" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative z-10 px-6 md:px-12 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto rounded-2xl px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{
            background: "rgba(14,17,23,0.65)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold" style={{ color: "#00d4aa" }}>{s.value}</span>
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "rgba(240,242,248,0.38)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="text-center text-2xl md:text-3xl font-bold mb-10 text-balance"
            style={{ color: "#f0f2f8" }}
          >
            Built for the next decade of business
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  whileHover={{ rotateX: -3, rotateY: 3, scale: 1.02 }}
                  style={{ perspective: 800 }}
                >
                  <div
                    className="rounded-2xl p-5 h-full"
                    style={{
                      background: "rgba(14,17,23,0.65)",
                      border: `1px solid ${f.color}22`,
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${f.color}15`, border: `1px solid ${f.color}28` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: f.color }} />
                    </div>
                    <h3 className="text-sm font-semibold mb-1.5" style={{ color: "#f0f2f8" }}>
                      {f.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(240,242,248,0.5)" }}>
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-xs font-mono" style={{ color: "rgba(240,242,248,0.25)" }}>
          Lumen NEX © 2025
        </span>
        <span className="text-xs font-mono" style={{ color: "rgba(240,242,248,0.25)" }}>
          Built for the hackathon
        </span>
      </footer>
    </main>
  );
}
