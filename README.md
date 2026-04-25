# Lumen NEX

> Autonomous Business Orchestrator — AI-powered command center for creators and SMEs.

Lumen NEX is a full-stack Next.js 16 application that combines a **3D agentic dashboard** with real-time AI reasoning, revenue intelligence, and multi-channel automation. Built as a hackathon showcase of what a 2030-era business OS looks like.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 with semantic design tokens |
| 3D / Shaders | React Three Fiber + Three.js (custom GLSL shader material) |
| Animation | Framer Motion v11 (spring physics, 3D perspective tilt) |
| AI | Vercel AI SDK 6 — `streamText`, `ToolLoopAgent` |
| Charts | Recharts (neon teal Area chart) |
| Icons | Lucide React (dual-tone teal/indigo) |
| Security | CSP headers, rate limiting (20 req/min per IP), Zod input validation |

---

## Features

### NexusCore Orb
A real-time 3D sphere rendered with `@react-three/fiber` and a custom GLSL fragment shader. The shader uses Fractal Brownian Motion (fBm) layered noise to produce swirling teal/indigo/sky energy patterns that morph continuously. A fake-glow mesh (BackSide sphere with additive opacity) surrounds the orb. Two animated torus rings orbit at independent angles. When the agent is processing, the pulse frequency and swirl speed increase via a `uProcessing` uniform that lerps smoothly.

### Agentic Reasoning Feed
A live Chain-of-Thought trace panel that surfaces every agent step — `reasoning`, `action`, `observation`, `conclusion` — as spring-animated cards that slide in from the bottom using `AnimatePresence`. New thoughts arrive every 3.2 seconds.

### Transaction Beam
An SVG animated beam connecting a WhatsApp source node to a Stripe destination node via a cubic bezier path. Motion circles travel along an `offsetPath` and a live amount badge (`$24.99` — `$299.00`) springs in mid-flight.

### Bento Grid Dashboard
Adaptive 3-column grid (collapses to 1 on mobile) with:
- **Revenue Insights** — Generative UI slot that shimmer-loads and then resolves to a live Recharts `AreaChart` with a neon teal stroke
- **Key Metrics** — MRR, Active Users, Churn Rate with delta indicators
- **Active Tasks** — checkbox list with priority dots
- **Market Signals** — animated progress bars with trend arrows
- **Live Transactions** — the animated beam component

All cards have a Framer Motion 3D perspective tilt on hover (`rotateX`, `rotateY`, `scale`).

### Security
- `Content-Security-Policy` with `frame-ancestors *` (allows preview iframe)
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` with `preload`
- `Permissions-Policy` restricting camera/microphone/geolocation
- `/api/agent` — rate limited to 20 requests per IP per minute, Zod-validated request body

---

## Project Structure

```
app/
  page.tsx                  # Landing page (animated hero, stats bar, features grid)
  layout.tsx                # Root layout — Inter + JetBrains Mono fonts, metadata
  dashboard/
    layout.tsx              # Dashboard shell — BackgroundBeams, Sidebar, BottomNav
    page.tsx                # Command Center — status bar + BentoGrid + AgenticFeed
    agent/
      page.tsx              # Full-screen AI agent chat (useChat + ToolLoopAgent)
  api/
    agent/
      route.ts              # POST /api/agent — rate limited, streamed AI responses
components/
  nexus-core.tsx            # R3F canvas with GLSL shader orb + orbital rings
  background-beams.tsx      # Canvas aurora orbs + animated light beams
  bento-grid.tsx            # Adaptive bento grid with glassmorphic cards
  agentic-feed.tsx          # Live Chain-of-Thought reasoning feed
  transaction-beam.tsx      # SVG animated beam (WhatsApp → Stripe)
  generative-slot.tsx       # Shimmer → Recharts AreaChart generative UI slot
  sidebar.tsx               # Collapsible desktop sidebar with spring animation
  bottom-nav.tsx            # Glassmorphic mobile bottom navigation
lib/
  utils.ts                  # cn(), formatCurrency(), formatCompact(), clamp()
```

---

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — the landing page with the 3D NexusCore orb.
Navigate to `/dashboard` for the full Command Center.

---

## Environment Variables

No environment variables are required to run the UI. For live AI agent responses in `/dashboard/agent`, the app uses the **Vercel AI Gateway** which is available zero-config in v0 deployments.

---

## Deployment

```bash
pnpm build
```

Deploy to Vercel — all security headers in `next.config.ts` are applied automatically on every route.
