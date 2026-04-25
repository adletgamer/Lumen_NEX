import { ToolLoopAgent, createAgentUIStreamResponse, tool } from "ai";
import { z } from "zod";

// Rate limit map (in-memory, per deploy instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const limit = 20;

  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
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
  // Security: rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "60" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = z
    .object({ messages: z.array(z.any()).min(1).max(100) })
    .safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return createAgentUIStreamResponse({
    agent: nexusAgent,
    uiMessages: parsed.data.messages,
  });
}
