"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BrainCircuit,
  TrendingUp,
  MessageSquare,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/agent", icon: BrainCircuit, label: "Agent" },
  { href: "/dashboard/revenue", icon: TrendingUp, label: "Revenue" },
  { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="glass-bright relative flex flex-col h-full flex-shrink-0 overflow-hidden"
      style={{ borderRight: "1px solid var(--color-border)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-16 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(0,212,170,0.15)", border: "1px solid rgba(0,212,170,0.35)" }}
        >
          <Zap className="w-4 h-4" style={{ color: "#00d4aa" }} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold tracking-tight whitespace-nowrap"
              style={{ color: "var(--color-foreground)" }}
            >
              Lumen NEX
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors",
                active
                  ? "text-[#00d4aa]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
              style={
                active
                  ? {
                      background: "rgba(0,212,170,0.1)",
                      boxShadow: "inset 0 0 0 1px rgba(0,212,170,0.2)",
                    }
                  : {}
              }
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: "#00d4aa" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div
        className="p-2 flex-shrink-0"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center py-2 rounded-xl transition-colors"
          style={{ color: "var(--color-muted)" }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
