'use workflow';

// @ts-ignore - Assuming @vercel/workflow is provided via hackathon env
import { createWebhook, waitForWebhook } from '@vercel/workflow';
import { generateText } from 'ai';
import { neon } from '@neondatabase/serverless';

// ── Idempotent Step for Payment ─────────────────────────────────────────────
// Wrap the final API call in 'use step' to ensure idempotency.
async function executePaymentStep(otp: string, amount: number) {
  'use step';
  console.log(`[MercadoPago/Yape] Processing payment for ${amount} with OTP: ${otp}`);
  // Simulated success
  return { 
    status: 'approved', 
    transaction_id: 'mp_' + Math.random().toString(36).substring(7) 
  };
}

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount } = await req.json();

    // 1. Webhook Generation
    const webhook = await createWebhook();

    // 2. Neon DB Notification (Audit)
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO user_workflows (workflow_id, phone_number, status)
      VALUES (${webhook.id}, ${phoneNumber}, 'waiting_for_otp')
    `;

    console.log(`[WhatsApp Triggered] Envia OTP a /api/yape/verify con webhookId=${webhook.id}`);

    // 3. State Suspension (Fluid Compute)
    console.log('[Workflow] Suspending state and waiting for webhook...', webhook.id);
    const webhookResponse = await waitForWebhook(webhook.id);
    const { otp } = webhookResponse.body;

    // 4. Verification & Idempotent Execution
    const paymentResult = await executePaymentStep(otp, amount);

    // 5. Agentic Reasoning (Gemini 3.1 Pro with thought signatures)
    // @ts-ignore
    const { text, reasoning_details, thought_signature } = await generateText({
      model: 'gemini-3.1-pro', // Mock identifier for the hackathon model
      prompt: `El pago de Yape devolvió: ${JSON.stringify(paymentResult)}. 
      ¿Fue exitoso? Explica tu razonamiento basándote en la intención del usuario detectada en WhatsApp.`,
      experimental_thoughtSignatures: true,
    });

    // 6. Final DB Update
    await sql`
      UPDATE user_workflows 
      SET status = 'completed', reasoning = ${JSON.stringify(reasoning_details)}
      WHERE workflow_id = ${webhook.id}
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      paymentResult, 
      thought_signature,
      reasoning_details,
      agent_conclusion: text
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("[Workflow Error]", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
