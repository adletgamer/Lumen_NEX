"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, TrendingUp, MessageSquare, Zap, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Thought {
  id: number;
  type: "reasoning" | "action" | "observation" | "conclusion";
  signature: string;
  text: string;
  timestamp: string;
}

const THOUGHT_TEMPLATES: Omit<Thought, "id" | "timestamp">[] = [
  { type: "reasoning", signature: "market_analysis_v2", text: "Analyzing Q2 revenue patterns — identifying 3 high-value segments." },
  { type: "action", signature: "stripe_fetch_tool", text: "Fetching last 30 days of transaction data from Stripe API." },
  { type: "observation", signature: "signal_detector", text: "Detected 14% MoM growth in SaaS subscriptions. Confidence: 0.91." },
  { type: "reasoning", signature: "churn_predictor", text: "Correlating engagement drop with plan downgrades — 2 at-risk accounts." },
  { type: "action", signature: "whatsapp_notify", text: "Composing proactive retention message for at-risk users." },
  { type: "conclusion", signature: "revenue_optimizer", text: "Optimal upsell window: Tuesday 10–11 AM. Projected uplift +$1,240." },
  { type: "reasoning", signature: "competitor_watch", text: "Pricing change detected at competitor. Reassessing positioning." },
  { type: "action", signature: "calendar_tool", text: "Scheduling follow-up task for tomorrow at 09:00 local time." },
  { type: "observation", signature: "traffic_analyzer", text: "Landing page CTR up 8.3% after last copy iteration. Keeping variant B." },
  { type: "reasoning", signature: "cashflow_planner", text: "Projecting 60-day cash flow with current burn rate and pipeline." },
];

const typeConfig = {
  reasoning: { icon: Brain, color: "#6366f1", label: "Reasoning" },
  action: { icon: Zap, color: "#00d4aa", label: "Action" },
  observation: { icon: Search, color: "#f59e0b", label: "Observe" },
  conclusion: { icon: CheckCircle2, color: "#10b981", label: "Conclude" },
};

function ThoughtItem({ thought }: { thought: Thought }) {
  const cfg = typeConfig[thought.type];
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="glass rounded-xl p-3 flex gap-3 min-w-0"
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
        style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}
      >
        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[10px] font-mono font-semibold uppercase tracking-widest"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
          <span
            className="text-[10px] font-mono truncate"
            style={{ color: "var(--color-muted)" }}
          >
            #{thought.signature}
          </span>
          <span
            className="ml-auto text-[10px] flex-shrink-0"
            style={{ color: "var(--color-muted)" }}
          >
            {thought.timestamp}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-foreground)" }}>
          {thought.text}
        </p>
      </div>
    </motion.div>
  );
}

export function AgenticFeed({ className }: { className?: string }) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const idRef = useRef(0);
  const MAX = 6;

  useEffect(() => {
    // Seed with 3 initial thoughts
    const initial = THOUGHT_TEMPLATES.slice(0, 3).map((t, i) => ({
      ...t,
      id: ++idRef.current,
      timestamp: new Date(Date.now() - (3 - i) * 4000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    }));
    setThoughts(initial);

    const interval = setInterval(() => {
      const template = THOUGHT_TEMPLATES[Math.floor(Math.random() * THOUGHT_TEMPLATES.length)];
      const thought: Thought = {
        ...template,
        id: ++idRef.current,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };
      setThoughts((prev) => [thought, ...prev].slice(0, MAX));
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          <Cpu className="w-4 h-4" style={{ color: "#6366f1" }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
            Reasoning Feed
          </h3>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            Chain-of-thought trace
          </p>
        </div>
        {/* Live indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#00d4aa" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#00d4aa" }}>
            Live
          </span>
        </div>
      </div>

      {/* Thoughts list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {thoughts.map((t) => (
            <ThoughtItem key={t.id} thought={t} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer status */}
      <div
        className="mt-3 pt-3 flex items-center gap-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--color-muted)" }} />
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          {thoughts.length} thoughts logged this session
        </span>
        <MessageSquare className="w-3.5 h-3.5 ml-auto" style={{ color: "var(--color-muted)" }} />
      </div>
    </div>
  );
}
