import { ToolLoopAgent, createAgentUIStreamResponse, tool } from "ai";
import { Redis } from "@upstash/redis";
import { z } from "zod";

// ── Upstash Redis — distributed sliding-window rate limiter ──────────────────
// Works across all serverless instances, unlike an in-memory Map
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const RATE_LIMIT = 20;  // requests
const RATE_WINDOW = 60; // seconds

async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rl:agent:${ip}`;
  const now = Date.now();
  const windowStart = now - RATE_WINDOW * 1000;

  // Atomic pipeline: remove stale, add current, count, set TTL
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  pipeline.zcard(key);
  pipeline.expire(key, RATE_WINDOW);

  const results = await pipeline.exec();
  const count = (results[2] as number) ?? 0;

  return {
    allowed: count <= RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - count),
  };
}

const nexusAgent = new ToolLoopAgent({
  model: "openai/gpt-4o-mini",
  instructions: `You are Lumen NEX, an autonomous business orchestrator for creators and SMEs.
You help users understand their business metrics, manage tasks, and identify growth opportunities.
Be concise, insightful, and proactive. When answering questions about revenue or metrics, 
always call the appropriate tool to fetch real data rather than guessing.`,
  tools: {
    getRevenueSummary: tool({
      description: "Fetch a summary of recent revenue metrics",
      inputSchema: z.object({
        period: z.enum(["7d", "30d", "90d"]).describe("Time period to analyze"),
      }),
      execute: async ({ period }) => {
        // Simulated data — replace with real Stripe/DB call
        const data: Record<string, object> = {
          "7d": { mrr: 11200, growth: 14.2, transactions: 148, topProduct: "Pro Plan" },
          "30d": { mrr: 11200, growth: 51.4, transactions: 612, topProduct: "Pro Plan" },
          "90d": { mrr: 9800, growth: 82.0, transactions: 1847, topProduct: "Starter Plan" },
        };
        return data[period];
      },
    }),
    getActiveTasks: tool({
      description: "Retrieve current open tasks and their priorities",
      inputSchema: z.object({}),
      execute: async () => ({
        open: 3,
        tasks: [
          { label: "Review Stripe payout schedule", priority: "high" },
          { label: "Respond to 3 pending leads", priority: "medium" },
          { label: "Optimize checkout funnel", priority: "medium" },
        ],
      }),
    }),
    getMarketSignals: tool({
      description: "Retrieve current market signals relevant to the business",
      inputSchema: z.object({}),
      execute: async () => ({
        signals: [
          { label: "Black Friday", relevance: 94, trend: "up" },
          { label: "Competitor pricing change", relevance: 82, trend: "up" },
          { label: "AI tooling interest", relevance: 88, trend: "up" },
        ],
      }),
    }),
  },
});

export async function POST(req: Request) {
  // Layer 1 — Distributed IP rate limiting via Upstash Redis
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining } = await checkRateLimit(ip);

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait and try again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(RATE_WINDOW),
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + RATE_WINDOW),
        },
      }
    );
  }

  // Layer 2 — Parse JSON body safely
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Layer 3 — Zod schema validation (never trust raw input)
  const parsed = z
    .object({ messages: z.array(z.any()).min(1).max(100) })
    .safeParse(body);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request body", details: parsed.error.flatten() }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Layer 4 — Stream the agent response with rate limit headers
  const response = await createAgentUIStreamResponse({
    agent: nexusAgent,
    uiMessages: parsed.data.messages,
  });

  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", String(remaining - 1));

  return response;
}
