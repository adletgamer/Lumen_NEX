"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight, Zap, Shield, TrendingUp, Cpu, Globe, Lock,
  MessageCircle, CreditCard, CheckCircle2,
} from "lucide-react";
import { BackgroundBeams } from "@/components/background-beams";
import { NexusCore } from "@/components/nexus-core";

// ── Mouse-tilt card ───────────────────────────────────────────────────────────
function TiltCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 800, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated beam: WhatsApp → Stripe ─────────────────────────────────────────
function AnimatedBeam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let t = 0;
    const W = canvas.width;
    const H = canvas.height;

    // Fixed node positions (relative to card)
    const src = { x: W * 0.12, y: H * 0.5 };
    const dst = { x: W * 0.88, y: H * 0.5 };
    const cp = { x: W * 0.5, y: H * 0.15 };

    function quadBez(t: number) {
      const mt = 1 - t;
      return {
        x: mt * mt * src.x + 2 * mt * t * cp.x + t * t * dst.x,
        y: mt * mt * src.y + 2 * mt * t * cp.y + t * t * dst.y,
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Track line
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.quadraticCurveTo(cp.x, cp.y, dst.x, dst.y);
      ctx.strokeStyle = "rgba(139,92,246,0.15)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pulse dot
      const pos = quadBez(t % 1);
      const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 16);
      grd.addColorStop(0, "rgba(139,92,246,0.9)");
      grd.addColorStop(0.4, "rgba(168,85,247,0.4)");
      grd.addColorStop(1, "rgba(168,85,247,0)");
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#8b5cf6";
      ctx.fill();

      t += 0.006;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative w-full h-28">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      {/* Source node — WhatsApp */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)" }}
        >
          <MessageCircle className="w-5 h-5" style={{ color: "#25d366" }} />
        </div>
        <span className="text-[9px] font-mono" style={{ color: "rgba(240,242,248,0.4)" }}>WhatsApp</span>
      </div>
      {/* Destination node — Stripe */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          <CreditCard className="w-5 h-5" style={{ color: "#6366f1" }} />
        </div>
        <span className="text-[9px] font-mono" style={{ color: "rgba(240,242,248,0.4)" }}>Stripe</span>
      </div>
      {/* Success badge */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-1 flex items-center gap-1 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1.02, 0.97] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <CheckCircle2 className="w-3 h-3" style={{ color: "#22c55e" }} />
        <span className="text-[9px] font-semibold font-mono" style={{ color: "#22c55e" }}>Payment confirmed</span>
      </motion.div>
    </div>
  );
}

// ── Bento grid features ───────────────────────────────────────────────────────
const BENTO = [
  {
    icon: Cpu,
    title: "Agentic Automation",
    desc: "AI agents handle revenue, outreach, and tasks 24/7.",
    span: "col-span-2",
    accent: "#6366f1",
  },
  {
    icon: TrendingUp,
    title: "Revenue Intelligence",
    desc: "Predictive signals surface growth before competitors act.",
    span: "col-span-1",
    accent: "#8b5cf6",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    desc: "5-layer security: Auth · Zod · Scoping · Redis rate limit · Env safety.",
    span: "col-span-1",
    accent: "#a855f7",
  },
  {
    icon: Globe,
    title: "Multi-Channel",
    desc: "WhatsApp, Stripe, Notion — one orchestration layer.",
    span: "col-span-1",
    accent: "#6366f1",
  },
  {
    icon: Lock,
    title: "Compliance Ready",
    desc: "GDPR-aligned audit logs and configurable retention.",
    span: "col-span-2",
    accent: "#8b5cf6",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <BackgroundBeams />

      {/* ── Nav ── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 h-14 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,9,12,0.75)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)" }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: "#8b5cf6" }} />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "#f0f2f8" }}>
            Lumen NEX
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-5" aria-label="Primary navigation">
          {["Features", "Integrations", "Security", "Docs"].map((item) => (
            <a key={item} href="#" className="text-xs font-medium" style={{ color: "rgba(240,242,248,0.4)" }}>
              {item}
            </a>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.35)",
            color: "#8b5cf6",
          }}
        >
          Dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* ── Immersive two-column preview ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* Left — Orb + headline */}
        <motion.div
          className="flex flex-col items-center justify-center px-8 py-10 text-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-mono uppercase tracking-widest"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#8b5cf6",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#8b5cf6", boxShadow: "0 0 8px #8b5cf6" }}
              />
              Autonomous · Intelligent · 2030-ready
            </div>
          </motion.div>

          {/* NexusCore orb — Amethyst Nebula */}
          <motion.div variants={fadeUp} className="mb-6">
            <NexusCore size={260} state="idle" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-lg"
          >
            Your Business&apos;s{" "}
            <span
              style={{
                color: "#8b5cf6",
                textShadow: "0 0 40px rgba(139,92,246,0.6)",
              }}
            >
              Autonomous
            </span>{" "}
            Intelligence Layer
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-pretty text-base max-w-md mb-8 leading-relaxed"
            style={{ color: "rgba(240,242,248,0.55)" }}
          >
            Lumen NEX orchestrates revenue, tasks, and market signals with AI agents — so you
            focus on building, not managing.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "#6366f1",
                color: "#f0f2f8",
                boxShadow: "0 0 28px rgba(99,102,241,0.5), 0 4px 16px rgba(99,102,241,0.2)",
              }}
            >
              Enter Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/agent"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(240,242,248,0.7)",
              }}
            >
              Talk to Agent
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — Bento grid + animated beam */}
        <motion.div
          className="flex flex-col justify-center px-6 py-8 gap-4"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Animated beam card */}
          <motion.div variants={fadeUp}>
            <TiltCard>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(14,17,23,0.7)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="px-5 pt-4 pb-1">
                  <p className="text-xs font-mono uppercase tracking-widest mb-0.5" style={{ color: "#8b5cf6" }}>
                    Agent Workflow
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#f0f2f8" }}>
                    WhatsApp lead → Stripe payment
                  </p>
                </div>
                <AnimatedBeam />
              </div>
            </TiltCard>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-3 gap-3">
            {BENTO.map((b) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.title} variants={fadeUp} className={b.span}>
                  <TiltCard className="h-full">
                    <div
                      className="rounded-xl p-4 h-full flex flex-col gap-2"
                      style={{
                        background: "rgba(14,17,23,0.7)",
                        border: `1px solid ${b.accent}22`,
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${b.accent}15`, border: `1px solid ${b.accent}28` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: b.accent }} />
                      </div>
                      <p className="text-xs font-semibold" style={{ color: "#f0f2f8" }}>{b.title}</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "rgba(240,242,248,0.45)" }}>
                        {b.desc}
                      </p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 flex items-center justify-between px-6 md:px-10 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-[10px] font-mono" style={{ color: "rgba(240,242,248,0.2)" }}>
          Lumen NEX © 2025
        </span>
        <span className="text-[10px] font-mono" style={{ color: "rgba(240,242,248,0.2)" }}>
          Built with Next.js 16 · R3F · Vercel AI SDK 6
        </span>
      </footer>
    </main>
  );
}
