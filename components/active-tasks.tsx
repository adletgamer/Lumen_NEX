"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_TASKS = [
  { id: 1, label: "Draft Q2 investor update", done: true, priority: "high" as const },
  { id: 2, label: "Review Stripe payout schedule", done: false, priority: "high" as const },
  { id: 3, label: "Respond to 3 pending leads", done: false, priority: "medium" as const },
  { id: 4, label: "Publish product changelog", done: true, priority: "low" as const },
  { id: 5, label: "Optimize checkout funnel", done: false, priority: "medium" as const },
];

const PRIORITY_COLOR = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#6b7280",
};

export function ActiveTasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const openCount = tasks.filter((t) => !t.done).length;

  const toggle = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="flex flex-col px-5 pt-5 pb-4 gap-3 flex-1">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
        >
          <CheckSquare className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
        </div>
        <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "#6366f1" }}>
          Agentic Automation
        </span>
        <motion.div
          key={openCount}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-auto text-xs font-mono rounded-full px-2.5 py-0.5"
          style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          {openCount} open
        </motion.div>
      </div>

      {/* Task list — glassmorphic */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.button
              key={task.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              onClick={() => toggle(task.id)}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                "hover:bg-white/[0.03] active:scale-[0.99]"
              )}
              style={{
                background: task.done ? "rgba(99,102,241,0.04)" : "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  "w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all",
                  "border"
                )}
                style={{
                  borderColor: task.done ? "#6366f1" : "rgba(255,255,255,0.15)",
                  background: task.done ? "rgba(99,102,241,0.2)" : "transparent",
                }}
              >
                {task.done && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path
                      d="M1 3L3 5L7 1"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Label */}
              <span
                className={cn("text-xs flex-1 truncate font-sans", task.done && "line-through opacity-50")}
                style={{ color: task.done ? "var(--color-muted)" : "#e8eaf6" }}
              >
                {task.label}
              </span>

              {/* Priority dot */}
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: PRIORITY_COLOR[task.priority] }}
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
