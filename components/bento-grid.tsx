"use client";

import { motion } from "framer-motion";
import { TrendingUp, CheckSquare, Radio, Users, DollarSign, ArrowUpRight } from "lucide-react";
import { cn, formatCurrency, formatCompact } from "@/lib/utils";
import { GenerativeSlot } from "./generative-slot";
import { TransactionBeam } from "./transaction-beam";

interface BentoCardProps {
  className?: string;
  children: React.ReactNode;
  glowColor?: "teal" | "indigo" | "amber" | "none";
}

function BentoCard({ className, children, glowColor = "none" }: BentoCardProps) {
  const glowMap = {
    teal: "rgba(0,212,170,0.08)",
    indigo: "rgba(99,102,241,0.08)",
    amber: "rgba(245,158,11,0.08)",
    none: "transparent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("glass-bright rounded-2xl overflow-hidden flex flex-col", className)}
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px var(--color-border), 0 4px 32px ${glowMap[glowColor]}`,
      }}
    >
      {children}
    </motion.div>
  );
}

const TASK_DATA = [
  { id: 1, label: "Draft Q2 investor update", done: true, priority: "high" },
  { id: 2, label: "Review Stripe payout schedule", done: false, priority: "high" },
  { id: 3, label: "Respond to 3 pending leads", done: false, priority: "medium" },
  { id: 4, label: "Publish product changelog", done: true, priority: "low" },
  { id: 5, label: "Optimize checkout funnel", done: false, priority: "medium" },
];

const SIGNAL_DATA = [
  { label: "Black Friday", relevance: 94, trend: "up" },
  { label: "Competitor pricing", relevance: 82, trend: "up" },
  { label: "SaaS churn spike", relevance: 71, trend: "down" },
  { label: "AI tooling interest", relevance: 88, trend: "up" },
];

const priorityColor: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#6b7280",
};

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">

      {/* Revenue Insights — generative slot */}
      <BentoCard className="xl:col-span-2 p-0" glowColor="teal">
        <div className="p-4 pb-0 flex items-center gap-2">
          <DollarSign className="w-4 h-4" style={{ color: "#00d4aa" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            Revenue Insights
          </span>
        </div>
        <GenerativeSlot
          className="flex-1"
          label="stream:revenue_chart"
          loadingDelay={1800}
        />
      </BentoCard>

      {/* KPI Stack */}
      <BentoCard className="p-4 gap-3" glowColor="indigo">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4" style={{ color: "#6366f1" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            Key Metrics
          </span>
        </div>
        {[
          { label: "MRR", value: formatCurrency(11200), delta: "+14.2%", up: true },
          { label: "Active Users", value: formatCompact(2841), delta: "+6.8%", up: true },
          { label: "Churn Rate", value: "2.1%", delta: "-0.4%", up: false },
        ].map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between rounded-xl px-3 py-2.5"
            style={{ background: "var(--color-surface)" }}
          >
            <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              {m.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>
                {m.value}
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: m.up ? "#10b981" : "#ef4444" }}
              >
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </BentoCard>

      {/* Active Tasks */}
      <BentoCard className="p-4" glowColor="none">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-4 h-4" style={{ color: "#00d4aa" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            Active Tasks
          </span>
          <span
            className="ml-auto text-xs rounded-full px-2 py-0.5"
            style={{ background: "var(--color-teal-dim)", color: "#00d4aa" }}
          >
            {TASK_DATA.filter((t) => !t.done).length} open
          </span>
        </div>
        <div className="space-y-2">
          {TASK_DATA.map((task) => (
            <div key={task.id} className="flex items-center gap-2.5 group">
              <div
                className={cn(
                  "w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors",
                  task.done
                    ? "border-[#00d4aa] bg-[rgba(0,212,170,0.15)]"
                    : "border-[rgba(255,255,255,0.12)]"
                )}
              >
                {task.done && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className={cn("text-xs flex-1 truncate", task.done && "line-through")}
                style={{ color: task.done ? "var(--color-muted)" : "var(--color-foreground)" }}
              >
                {task.label}
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: priorityColor[task.priority] }}
              />
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Market Signals */}
      <BentoCard className="p-4" glowColor="amber">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-4 h-4" style={{ color: "#f59e0b" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            Market Signals
          </span>
        </div>
        <div className="space-y-3">
          {SIGNAL_DATA.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--color-foreground)" }}>
                  {s.label}
                </span>
                <div className="flex items-center gap-1">
                  <ArrowUpRight
                    className="w-3 h-3"
                    style={{
                      color: s.trend === "up" ? "#10b981" : "#ef4444",
                      transform: s.trend === "down" ? "rotate(90deg)" : undefined,
                    }}
                  />
                  <span
                    className="text-xs font-mono"
                    style={{ color: s.trend === "up" ? "#10b981" : "#ef4444" }}
                  >
                    {s.relevance}%
                  </span>
                </div>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--color-surface)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.relevance}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #f59e0b, #fbbf24)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Transaction Beam */}
      <BentoCard className="p-4" glowColor="teal">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4" style={{ color: "#00d4aa" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            Live Transactions
          </span>
          <motion.span
            className="ml-auto text-[10px] font-mono uppercase tracking-wider rounded-full px-2 py-0.5"
            style={{ background: "rgba(0,212,170,0.1)", color: "#00d4aa" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            Real-time
          </motion.span>
        </div>
        <TransactionBeam className="flex-1" />
      </BentoCard>
    </div>
  );
}
