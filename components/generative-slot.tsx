"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const CHART_DATA = [
  { month: "Nov", revenue: 4200 },
  { month: "Dec", revenue: 6800 },
  { month: "Jan", revenue: 5900 },
  { month: "Feb", revenue: 8200 },
  { month: "Mar", revenue: 7400 },
  { month: "Apr", revenue: 11200 },
];

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg", className)} />;
}

function GeneratedChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "#6366f1" }}>
            AI — Revenue Insight
          </p>
          <p className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
            $11,200
            <span className="ml-2 text-sm font-normal" style={{ color: "#10b981" }}>
              +51.4%
            </span>
          </p>
        </div>
        <TrendingUp className="w-5 h-5" style={{ color: "#00d4aa" }} />
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(14,17,23,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                color: "#f0f2f8",
                fontSize: "12px",
              }}
              cursor={{ stroke: "rgba(99,102,241,0.25)" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#6366f1" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

interface GenerativeSlotProps {
  className?: string;
  label?: string;
  loadingDelay?: number;
}

export function GenerativeSlot({
  className,
  label = "Generative UI Slot",
  loadingDelay = 2200,
}: GenerativeSlotProps) {
  const [state, setState] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    const t = setTimeout(() => setState("ready"), loadingDelay);
    return () => clearTimeout(t);
  }, [loadingDelay]);

  const reload = () => {
    setState("loading");
    setTimeout(() => setState("ready"), 1800);
  };

  return (
    <div
      className={cn("relative flex flex-col", className)}
      style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-lg)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2"
      >
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          {label}
        </span>
        <button
          onClick={reload}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
          style={{ color: "var(--color-muted)" }}
          aria-label="Refresh generative slot"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <AnimatePresence mode="wait">
          {state === "loading" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 pt-1"
            >
              <ShimmerBlock className="h-8 w-3/4" />
              <ShimmerBlock className="h-4 w-1/2" />
              <ShimmerBlock className="h-28 w-full" />
              <div className="flex gap-2">
                <ShimmerBlock className="h-3 w-1/3" />
                <ShimmerBlock className="h-3 w-1/4" />
              </div>
            </motion.div>
          ) : (
            <motion.div key="ready" className="h-48">
              <GeneratedChart />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slot border glow when loading */}
      <AnimatePresence>
        {state === "loading" && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ boxShadow: "inset 0 0 0 1px rgba(168,85,247,0.3)" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
