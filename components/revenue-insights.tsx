"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const CHART_DATA = [
  { month: "Nov", revenue: 4200 },
  { month: "Dec", revenue: 6800 },
  { month: "Jan", revenue: 5900 },
  { month: "Feb", revenue: 8200 },
  { month: "Mar", revenue: 7400 },
  { month: "Apr", revenue: 11200 },
];

export function RevenueInsights() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-5 pb-4 gap-3 min-h-0">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
            >
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
            </div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "#6366f1" }}>
              Revenue Insights
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono" style={{ color: "#e8eaf6" }}>
              $11,200
            </span>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-sm font-mono"
              style={{ color: "#10b981" }}
            >
              +51.4%
            </motion.span>
          </div>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--color-muted)" }}>
            Monthly Recurring Revenue
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: "110px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
              <filter id="indigoGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(10,14,26,0.95)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "10px",
                color: "#e8eaf6",
                fontSize: "12px",
                fontFamily: "var(--font-geist-mono)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.2)",
              }}
              cursor={{ stroke: "rgba(99,102,241,0.25)", strokeWidth: 1 }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#indigoGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#6366f1", stroke: "#a5b4fc", strokeWidth: 2 }}
              filter="url(#indigoGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
