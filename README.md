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
| Database | **Neon DB** (Serverless PostgreSQL) |
| Auth | Custom Auth Flow (Server Actions, **Bcrypt.js**) |
| Cache/Limit | **Upstash Redis** (Rate limiting) |
| Charts | Recharts (neon teal Area chart) |
| Icons | Lucide React (dual-tone teal/indigo) |
| Security | CSP headers, rate limiting, Zod input validation |

---

## Features

### NexusCore Orb
A real-time 3D sphere rendered with `@react-three/fiber` and a custom GLSL fragment shader. The shader uses Fractal Brownian Motion (fBm) layered noise to produce swirling teal/indigo/sky energy patterns that morph continuously.

### Agentic Reasoning Feed
A live Chain-of-Thought trace panel that surfaces every agent step — `reasoning`, `action`, `observation`, `conclusion` — as spring-animated cards that slide in from the bottom.

### Hybrid Authentication
Secure, custom-built authentication system leveraging Next.js Server Actions and Bcrypt for password hashing, integrated with Neon DB for persistent user sessions.

### Profile Customization
Basic profile editing interface (`/dashboard/profile`) allowing users to update their identity and business preferences with real-time validation.

### Roadmap 2026
- [ ] **Revenue Dashboard**: Deep-dive analytics, subscription tracking, and churn prediction.
- [ ] **Omni-Channel Messages**: Centralized AI-managed inbox for WhatsApp, Email, and Slack.
- [ ] **Strategic Settings**: Granular agent controls, API integrations, and billing management.
- [ ] **AI Autonomous Actions**: Letting the agent execute business logic (invoicing, customer support) directly.

---

## Project Structure

```
app/
  page.tsx                  # Landing page (animated hero, stats bar)
  layout.tsx                # Root layout — Fonts, Metadata, Providers
  auth/                     # Custom Auth pages (Login, Register)
  dashboard/
    layout.tsx              # Dashboard shell — Sidebar, NexusCore
    page.tsx                # Command Center — BentoGrid + AgenticFeed
    profile/                # User Profile & Settings management
    agent/                  # Full-screen AI agent chat
    revenue/                # [Planned] Financial intelligence
    messages/               # [Planned] AI-managed inbox
    settings/               # [Planned] Advanced configurations
  api/
    agent/                  # POST /api/agent — Rate limited agent logic
components/
  nexus-core.tsx            # R3F canvas with GLSL shader orb
  sidebar.tsx               # Collapsible desktop sidebar with spring animation
  profile-form.tsx          # Dynamic profile editing form
  bento-grid.tsx            # Adaptive bento grid with glassmorphic cards
  agentic-feed.tsx          # Live Chain-of-Thought reasoning feed
  transaction-beam.tsx      # SVG animated beam (WhatsApp → Stripe)
lib/
  db.ts                     # Neon DB connection and schemas
  auth.ts                   # Auth utilities and server actions
  utils.ts                  # cn(), formatters, and helpers
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the NexusCore orb and start your autonomous business journey.

---

## Environment Variables

To run the full agentic and database features, create a `.env.local` file:

```env
DATABASE_URL=your_neon_db_url
AI_GATEWAY_API_KEY=your_vercel_ai_key
```

---

## Deployment

```bash
npm run build
```

Deploy to Vercel — ensure you set up your Neon DB and AI Gateway keys in the Vercel dashboard for production.
