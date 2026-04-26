"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, CreditCard, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sample a quadratic bezier at t ∈ [0,1] */
function quadBezier(
  t: number,
  x1: number, y1: number,
  cpX: number, cpY: number,
  x2: number, y2: number
): [number, number] {
  const mt = 1 - t;
  const x = mt * mt * x1 + 2 * mt * t * cpX + t * t * x2;
  const y = mt * mt * y1 + 2 * mt * t * cpY + t * t * y2;
  return [x, y];
}

interface BeamPoint {
  x1: number; y1: number;
  cpX: number; cpY: number;
  x2: number; y2: number;
}

const AMOUNTS = ["$24.99", "$149.00", "$9.99", "$299.00", "$59.50", "$74.00"];

export function TransactionBeam({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<BeamPoint | null>(null);
  const rafRef = useRef<number>(0);
  const [recentAmount, setRecentAmount] = useState<string | null>(null);

  // Build bezier coords on mount/resize
  useEffect(() => {
    const update = () => {
      if (!fromRef.current || !toRef.current || !containerRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      const fr = fromRef.current.getBoundingClientRect();
      const tr = toRef.current.getBoundingClientRect();
      const x1 = fr.left + fr.width / 2 - cr.left;
      const y1 = fr.top + fr.height / 2 - cr.top;
      const x2 = tr.left + tr.width / 2 - cr.left;
      const y2 = tr.top + tr.height / 2 - cr.top;
      beamRef.current = {
        x1, y1,
        cpX: (x1 + x2) / 2,
        cpY: Math.min(y1, y2) - 28,
        x2, y2,
      };
      if (canvasRef.current) {
        canvasRef.current.width = cr.width;
        canvasRef.current.height = cr.height;
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Canvas RAF draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface ActivePulse { t: number; speed: number }
    const pulses: ActivePulse[] = [];
    let spawnTimer = 0;
    const SPAWN_INTERVAL = 2000;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      spawnTimer += dt;

      const b = beamRef.current;
      if (!b) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Static dashed track — subtle indigo
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.quadraticCurveTo(b.cpX, b.cpY, b.x2, b.y2);
      ctx.strokeStyle = "rgba(99,102,241,0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spawn pulse
      if (spawnTimer >= SPAWN_INTERVAL) {
        spawnTimer = 0;
        pulses.push({ t: 0, speed: 1 / 1200 });
        const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
        setTimeout(() => setRecentAmount(amount), 550);
        setTimeout(() => setRecentAmount(null), 1700);
      }

      // Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].t = Math.min(pulses[i].t + dt * pulses[i].speed, 1);
        const [px, py] = quadBezier(pulses[i].t, b.x1, b.y1, b.cpX, b.cpY, b.x2, b.y2);

        // Outer glow — amethyst
        const outer = ctx.createRadialGradient(px, py, 0, px, py, 16);
        outer.addColorStop(0, "rgba(168,85,247,0.6)");
        outer.addColorStop(0.5, "rgba(99,102,241,0.25)");
        outer.addColorStop(1, "rgba(99,102,241,0)");
        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.fillStyle = outer;
        ctx.fill();

        // Core dot — electric indigo
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#818cf8";
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        if (pulses[i].t >= 1) pulses.splice(i, 1);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-between px-8 py-4", className)}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* WhatsApp source node */}
      <div ref={fromRef} className="relative z-10 flex flex-col items-center gap-2">
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(37,211,102,0.08)",
            border: "1px solid rgba(37,211,102,0.25)",
          }}
          animate={{
            boxShadow: [
              "0 0 0px rgba(37,211,102,0)",
              "0 0 22px rgba(37,211,102,0.4)",
              "0 0 0px rgba(37,211,102,0)",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle className="w-7 h-7" style={{ color: "#25d366" }} />
        </motion.div>
        <span className="text-[10px] font-mono" style={{ color: "var(--color-muted-foreground)" }}>
          WhatsApp
        </span>
      </div>

      {/* Central amount badge */}
      <div className="relative z-10 flex-1 flex justify-center">
        <AnimatePresence>
          {recentAmount && (
            <motion.div
              key={recentAmount + Date.now()}
              initial={{ opacity: 0, scale: 0.6, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.6, y: -6, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="absolute top-0 -translate-y-4 flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(168,85,247,0.35)",
                boxShadow: "0 0 16px rgba(99,102,241,0.25)",
              }}
            >
              <Zap className="w-3 h-3" style={{ color: "#a855f7" }} />
              <span className="text-xs font-mono font-semibold" style={{ color: "#c4b5fd" }}>
                {recentAmount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stripe destination node */}
      <div ref={toRef} className="relative z-10 flex flex-col items-center gap-2">
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.28)",
          }}
          animate={{
            boxShadow: [
              "0 0 0px rgba(99,102,241,0)",
              "0 0 22px rgba(99,102,241,0.45)",
              "0 0 0px rgba(99,102,241,0)",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
        >
          <CreditCard className="w-7 h-7" style={{ color: "#6366f1" }} />
        </motion.div>
        <span className="text-[10px] font-mono" style={{ color: "var(--color-muted-foreground)" }}>
          Stripe
        </span>
      </div>
    </div>
  );
}
