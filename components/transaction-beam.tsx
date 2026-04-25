"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, CreditCard, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pulse {
  id: number;
  progress: number;
}

export function TransactionBeam({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [pathD, setPathD] = useState("");
  const [recentAmount, setRecentAmount] = useState<string | null>(null);
  const pulseIdRef = useRef(0);

  // Build SVG path between two nodes
  useEffect(() => {
    const update = () => {
      if (!fromRef.current || !toRef.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
      const x2 = toRect.left + toRect.width / 2 - containerRect.left;
      const y2 = toRect.top + toRect.height / 2 - containerRect.top;

      const cpX = (x1 + x2) / 2;
      const cpY = Math.min(y1, y2) - 30;
      setPathD(`M${x1},${y1} Q${cpX},${cpY} ${x2},${y2}`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Emit pulses periodically
  useEffect(() => {
    const amounts = ["$24.99", "$149.00", "$9.99", "$299.00", "$59.50"];
    const interval = setInterval(() => {
      const id = ++pulseIdRef.current;
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      setPulses((prev) => [...prev, { id, progress: 0 }]);

      // Show amount mid-way
      setTimeout(() => setRecentAmount(amount), 600);
      setTimeout(() => setRecentAmount(null), 1800);

      // Remove pulse after animation
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== id));
      }, 1400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-between px-8 py-6", className)}
    >
      {/* SVG beam track */}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4aa" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d4aa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static faint track */}
        {pathD && (
          <path
            d={pathD}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 8"
          />
        )}

        {/* Animated pulse dots */}
        {pathD &&
          pulses.map((pulse) => (
            <motion.circle
              key={pulse.id}
              r={5}
              fill="url(#beamGrad)"
              filter="url(#glow)"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
              style={{ offsetPath: `path("${pathD}")` } as React.CSSProperties}
            >
              <motion.animate
                attributeName="r"
                values="4;7;4"
                dur="0.6s"
                repeatCount="indefinite"
              />
            </motion.circle>
          ))}
      </svg>

      {/* WhatsApp / Source node */}
      <div ref={fromRef} className="relative z-10 flex flex-col items-center gap-2">
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center glass-bright"
          style={{ border: "1px solid rgba(0,212,170,0.3)" }}
          animate={{ boxShadow: ["0 0 0px rgba(0,212,170,0)", "0 0 20px rgba(0,212,170,0.4)", "0 0 0px rgba(0,212,170,0)"] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <MessageCircle className="w-7 h-7" style={{ color: "#00d4aa" }} />
        </motion.div>
        <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          WhatsApp
        </span>
      </div>

      {/* Central amount badge */}
      <div className="relative z-10 flex-1 flex justify-center">
        <AnimatePresence>
          {recentAmount && (
            <motion.div
              key={recentAmount + Date.now()}
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute top-0 -translate-y-3 glass-bright rounded-full px-3 py-1 flex items-center gap-1.5"
              style={{ border: "1px solid rgba(0,212,170,0.4)" }}
            >
              <Zap className="w-3 h-3" style={{ color: "#00d4aa" }} />
              <span className="text-xs font-mono font-semibold" style={{ color: "#00d4aa" }}>
                {recentAmount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stripe / Destination node */}
      <div ref={toRef} className="relative z-10 flex flex-col items-center gap-2">
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center glass-bright"
          style={{ border: "1px solid rgba(99,102,241,0.3)" }}
          animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 20px rgba(99,102,241,0.4)", "0 0 0px rgba(99,102,241,0)"] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1.1 }}
        >
          <CreditCard className="w-7 h-7" style={{ color: "#6366f1" }} />
        </motion.div>
        <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          Stripe
        </span>
      </div>
    </div>
  );
}
