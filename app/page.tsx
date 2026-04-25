import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { BackgroundBeams } from "@/components/background-beams";
import { NexusCore } from "@/components/nexus-core";

const FEATURES = [
  {
    icon: Zap,
    color: "#00d4aa",
    title: "Agentic Automation",
    desc: "AI agents handle revenue, outreach, and task orchestration 24/7 without manual intervention.",
  },
  {
    icon: TrendingUp,
    color: "#6366f1",
    title: "Revenue Intelligence",
    desc: "Real-time market signals and predictive analytics surface growth opportunities before competitors.",
  },
  {
    icon: Shield,
    color: "#f59e0b",
    title: "Secure by Design",
    desc: "Enterprise-grade security with rate limiting, CSP headers, and encrypted data at rest.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <BackgroundBeams />

      {/* Nav */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-12 h-16 glass-bright"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,212,170,0.15)", border: "1px solid rgba(0,212,170,0.35)" }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: "#00d4aa" }} />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--color-foreground)" }}>
            Lumen NEX
          </span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          style={{
            background: "rgba(0,212,170,0.12)",
            border: "1px solid rgba(0,212,170,0.3)",
            color: "#00d4aa",
          }}
        >
          Dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-mono uppercase tracking-widest"
          style={{
            background: "rgba(0,212,170,0.08)",
            border: "1px solid rgba(0,212,170,0.25)",
            color: "#00d4aa",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: "#00d4aa", boxShadow: "0 0 6px #00d4aa" }}
          />
          Autonomous &middot; Intelligent &middot; 2030-ready
        </div>

        {/* Heading */}
        <h1 className="text-balance text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl">
          Your Business&apos;s{" "}
          <span
            className="text-glow-teal"
            style={{ color: "#00d4aa" }}
          >
            Autonomous
          </span>{" "}
          Intelligence Layer
        </h1>
        <p
          className="text-pretty text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Lumen NEX orchestrates revenue, tasks, and market signals with AI agents — so you
          focus on building, not managing.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "#00d4aa",
              color: "#08090c",
              boxShadow: "0 0 24px rgba(0,212,170,0.4)",
            }}
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--color-border-bright)",
              color: "var(--color-foreground)",
            }}
          >
            Watch Demo
          </button>
        </div>

        {/* NexusCore */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #00d4aa 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <NexusCore size={280} state="idle" />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass-bright rounded-2xl p-5"
                style={{ border: `1px solid ${f.color}22` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${f.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--color-foreground)" }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
