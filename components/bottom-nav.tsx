"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, BrainCircuit, TrendingUp, MessageSquare, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/agent", icon: BrainCircuit, label: "Agent" },
  { href: "/dashboard/revenue", icon: TrendingUp, label: "Revenue" },
  { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="glass-bright fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pb-safe"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        paddingTop: "8px",
      }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl"
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute inset-0 rounded-xl"
                style={{ background: "rgba(99,102,241,0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              className="relative z-10 w-5 h-5"
              style={{ color: active ? "#818cf8" : "var(--color-muted)" }}
            />
            <span
              className="relative z-10 text-[10px] font-medium"
              style={{ color: active ? "#818cf8" : "var(--color-muted)" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
