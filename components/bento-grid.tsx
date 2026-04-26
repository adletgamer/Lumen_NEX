"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AgenticFeed } from "./agentic-feed";
import { TransactionBeam } from "./transaction-beam";
import { RevenueInsights } from "./revenue-insights";
import { ActiveTasks } from "./active-tasks";

// ── Splay Animation (cards stagger FROM center outwards) ──────────────────────
const splayVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.6,
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
    // Tilt towards cursor (max 4 degrees)
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
        background: "rgba(255,255,255,0.02)",
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
      variants={splayVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-5 w-full"
    >
      {/* ══════════════════════════════════════════════════════════════════════
          CENTER HERO — Large Typographic Headline (col-span-12)
         ══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={cardVariants}
        className="col-span-12 flex flex-col items-center justify-center text-center py-16 md:py-24 px-6"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold font-sans leading-tight text-balance max-w-4xl"
          style={{ color: "#e8eaf6" }}
        >
          The Intelligent Orchestration Layer for Modern Business.
        </h1>
        <p
          className="mt-6 text-sm md:text-base font-sans tracking-[0.2em] uppercase max-w-xl"
          style={{ color: "var(--color-muted)" }}
        >
          Autonomous agents. Real-time insights. Effortless scale.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════
          TOP ROW — Metrics (2 symmetric cards, col-span-6 each)
         ══════════════════════════════════════════════════════════════════════ */}
      <BentoCard
        layoutId="bento-revenue"
        glowColor="indigo"
        className="col-span-12 md:col-span-6 min-h-[260px]"
      >
        <RevenueInsights />
      </BentoCard>

      <BentoCard
        layoutId="bento-tasks"
        glowColor="none"
        className="col-span-12 md:col-span-6 min-h-[260px]"
      >
        <ActiveTasks />
      </BentoCard>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM ROW — Action (Feed col-span-8, Beam col-span-4)
         ══════════════════════════════════════════════════════════════════════ */}
      <BentoCard
        layoutId="bento-feed"
        glowColor="indigo"
        className="col-span-12 md:col-span-8 min-h-[320px]"
      >
        <div className="flex-1 flex flex-col p-5 overflow-hidden">
          <AgenticFeed className="h-full" />
        </div>
      </BentoCard>

      <BentoCard
        layoutId="bento-beam"
        glowColor="amethyst"
        className="col-span-12 md:col-span-4 min-h-[320px]"
      >
        <TransactionBeamCard />
      </BentoCard>
    </motion.div>
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
