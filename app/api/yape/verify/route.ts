import { NextResponse } from 'next/server';
import { z } from 'zod';

const verifySchema = z.object({
  webhookId: z.string(),
  otp: z.string().length(6).regex(/^\d+$/),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { webhookId, otp } = verifySchema.parse(body);

    // Fetch to the generated webhook to wake up the Vercel workflow.
    // In actual @vercel/workflow, this might be a specific internal endpoint.
    // For this simulation, we post to the webhook ID endpoint.
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/webhooks/${webhookId}`; 

    console.log(`[API] Despertando workflow con ID: ${webhookId}`);
    
    // Trigger external webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger workflow resume');
    }

    return NextResponse.json({ success: true, message: 'Workflow resumed' });
  } catch (error: any) {
    console.error("[Verify Error]", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
