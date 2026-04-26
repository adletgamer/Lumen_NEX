"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NexusCore } from "./nexus-core";
import { AgenticFeed } from "./agentic-feed";
import { TransactionBeam } from "./transaction-beam";
import { RevenueInsights } from "./revenue-insights";
import { ActiveTasks } from "./active-tasks";

// ── Animation Orchestration ───────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

// ── Bento Card Shell ──────────────────────────────────────────────────────────
interface BentoCardProps {
  layoutId: string;
  className?: string;
  children: React.ReactNode;
  glowColor?: "indigo" | "amethyst" | "none";
}

function BentoCard({ layoutId, className, children, glowColor = "none" }: BentoCardProps) {
  const glowStyle =
    glowColor === "indigo"
      ? { boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 8px 40px rgba(99,102,241,0.10)" }
      : glowColor === "amethyst"
      ? { boxShadow: "0 0 0 1px rgba(168,85,247,0.15), 0 8px 40px rgba(168,85,247,0.10)" }
      : { boxShadow: "0 8px 32px rgba(0,0,0,0.35)" };

  return (
    <motion.div
      layoutId={layoutId}
      variants={cardVariants}
      whileHover={{
        scale: 1.012,
        transition: { duration: 0.18, ease: "easeOut" },
      }}
      style={{
        ...glowStyle,
        willChange: "transform, opacity, filter",
      }}
      className={cn(
        "bento-card flex flex-col",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ── Card Header ───────────────────────────────────────────────────────────────
function CardHeader({
  icon,
  label,
  accent = "#6366f1",
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}1a`, border: `1px solid ${accent}30` }}
      >
        {icon}
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: accent }}>
        {label}
      </span>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function BentoGrid() {
  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-4 w-full"
      style={{ gridAutoRows: "minmax(0, 1fr)" }}
    >
      {/* ── Revenue Insights (left col, row 1) ── */}
      <BentoCard
        layoutId="bento-revenue"
        glowColor="indigo"
        className="col-span-12 md:col-span-4 min-h-[220px]"
      >
        <RevenueInsights />
      </BentoCard>

      {/* ── NexusCore Centerpiece (center, rows 1-2) ── */}
      <BentoCard
        layoutId="bento-nexus"
        glowColor="amethyst"
        className="col-span-12 md:col-span-4 md:row-span-2 min-h-[280px] relative overflow-visible"
      >
        <NexusCoreCard />
      </BentoCard>

      {/* ── Agentic Feed (right col, rows 1-2) ── */}
      <BentoCard
        layoutId="bento-feed"
        glowColor="indigo"
        className="col-span-12 md:col-span-4 md:row-span-2 min-h-[280px]"
      >
        <div className="flex-1 flex flex-col p-5 overflow-hidden">
          <AgenticFeed className="h-full" />
        </div>
      </BentoCard>

      {/* ── Active Tasks (left col, row 2) ── */}
      <BentoCard
        layoutId="bento-tasks"
        glowColor="none"
        className="col-span-12 md:col-span-4 min-h-[200px]"
      >
        <ActiveTasks />
      </BentoCard>

      {/* ── Transaction Beam (full width, row 3) ── */}
      <BentoCard
        layoutId="bento-beam"
        glowColor="indigo"
        className="col-span-12 min-h-[160px]"
      >
        <TransactionBeamCard />
      </BentoCard>
    </motion.div>
  );
}

// ── NexusCore Card Inner ──────────────────────────────────────────────────────
function NexusCoreCard() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
      {/* Label */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "#a855f7" }}>
          NexusCore
        </span>
        <LiveBadge color="#a855f7" label="Active" />
      </div>

      {/* Orb */}
      <NexusCore size={240} />

      {/* Stats row */}
      <div
        className="w-full mt-2 grid grid-cols-3 gap-2 px-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}
      >
        {[
          { label: "Ops/min", value: "1,284" },
          { label: "Latency", value: "42ms" },
          { label: "Uptime", value: "99.9%" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-bold font-mono" style={{ color: "#e8eaf6" }}>
              {s.value}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider mt-0.5" style={{ color: "var(--color-muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Transaction Beam Card Inner ───────────────────────────────────────────────
function TransactionBeamCard() {
  return (
    <div className="flex-1 flex flex-col">
      <CardHeader
        icon={
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        }
        label="Transaction Beam"
        accent="#6366f1"
        badge={<LiveBadge color="#6366f1" label="Real-time" />}
      />
      <div className="flex-1 px-4 pb-4">
        <TransactionBeam className="h-full" />
      </div>
    </div>
  );
}

// ── Shared: Live Badge ────────────────────────────────────────────────────────
function LiveBadge({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{ background: `${color}15`, border: `1px solid ${color}25` }}
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
