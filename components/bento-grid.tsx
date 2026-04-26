"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NexusCore } from "./nexus-core";
import { AgenticFeed } from "./agentic-feed";
import { TransactionBeam } from "./transaction-beam";
import { RevenueInsights } from "./revenue-insights";
import { ActiveTasks } from "./active-tasks";

// ── Stagger Animation ─────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ── Magnetic Hover Card ───────────────────────────────────────────────────────
interface BentoCardProps {
  layoutId: string;
  className?: string;
  children: React.ReactNode;
  glowColor?: "indigo" | "amethyst" | "none";
}

function BentoCard({ layoutId, className, children, glowColor = "none" }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setRotateY(deltaX * 4);
    setRotateX(-deltaY * 4);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const glowStyle =
    glowColor === "indigo"
      ? { boxShadow: "0 0 0 1px rgba(99,102,241,0.12), 0 8px 32px rgba(99,102,241,0.08)" }
      : glowColor === "amethyst"
      ? { boxShadow: "0 0 0 1px rgba(168,85,247,0.12), 0 8px 32px rgba(168,85,247,0.08)" }
      : { boxShadow: "0 8px 24px rgba(0,0,0,0.25)" };

  return (
    <motion.div
      ref={cardRef}
      layoutId={layoutId}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...glowStyle,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
        willChange: "transform, opacity, filter",
        background: "rgba(2,6,23,0.40)",
        backdropFilter: "blur(48px) saturate(180%)",
        WebkitBackdropFilter: "blur(48px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1.5rem",
      }}
      className={cn("flex flex-col overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function BentoGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-5 w-full"
    >
      {/* ══════════════════════════════════════════════════════════════════════
          LEFT COLUMN — Revenue + Tasks (col-span-4)
         ══════════════════════════════════════════════════════════════════════ */}
      <BentoCard
        layoutId="bento-revenue"
        glowColor="indigo"
        className="col-span-12 md:col-span-4 min-h-[260px]"
      >
        <RevenueInsights />
      </BentoCard>

      {/* ══════════════════════════════════════════════════════════════════════
          CENTER — NexusCore Orb (col-span-4, row-span-2)
         ══════════════════════════════════════════════════════════════════════ */}
      <BentoCard
        layoutId="bento-nexus"
        glowColor="amethyst"
        className="col-span-12 md:col-span-4 md:row-span-2 min-h-[280px] relative overflow-visible"
      >
        <NexusCoreCard />
      </BentoCard>

      {/* ══════════════════════════════════════════════════════════════════════
          RIGHT COLUMN — Agentic Feed (col-span-4, row-span-2)
         ══════════════════════════════════════════════════════════════════════ */}
      <BentoCard
        layoutId="bento-feed"
        glowColor="indigo"
        className="col-span-12 md:col-span-4 md:row-span-2 min-h-[540px]"
      >
        <div className="flex-1 flex flex-col p-5 overflow-hidden">
          <AgenticFeed className="h-full" />
        </div>
      </BentoCard>

      {/* ══════════════════════════════════════════════════════════════════════
          LEFT COLUMN BOTTOM — Active Tasks (col-span-4)
         ══════════════════════════════════════════════════════════════════════ */}
      <BentoCard
        layoutId="bento-tasks"
        glowColor="none"
        className="col-span-12 md:col-span-4 min-h-[260px]"
      >
        <ActiveTasks />
      </BentoCard>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM ROW — Transaction Beam (col-span-12)
         ══════════════════════════════════════════════════════════════════════ */}
      <BentoCard
        layoutId="bento-beam"
        glowColor="amethyst"
        className="col-span-12 min-h-[180px]"
      >
        <TransactionBeamCard />
      </BentoCard>
    </motion.div>
  );
}

// ── NexusCore Card Inner ──────────────────────────────────────────────────────
function NexusCoreCard() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[280px]">
      {/* Radial glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <NexusCore size={220} state="idle" />
      <div className="mt-4 text-center px-4">
        <p className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "#a855f7" }}>
          NexusCore
        </p>
        <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
          Orchestrating 3 active agents
        </p>
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
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        }
        label="Transaction Beam"
        accent="#a855f7"
        badge={<LiveBadge color="#a855f7" label="Real-time" />}
      />
      <div className="flex-1 px-4 pb-4">
        <TransactionBeam className="h-full" />
      </div>
    </div>
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
