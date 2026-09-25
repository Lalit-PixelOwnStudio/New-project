import { NextResponse } from "next/server";
import { db, schema } from "@/server/db";
import { fulfilOrder } from "@/server/commerce";
import { verifyWebhookSignature } from "@/server/payments/razorpay";

export const dynamic = "force-dynamic";

/**
 * Backup path for fulfilment: if the buyer closes the tab before the browser
 * reports success, Razorpay still tells us. Subscribe to payment.captured.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature") ?? "")) {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }
  const event = JSON.parse(raw) as {
    event: string;
    payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; currency: string } } };
  };
  const eventId = req.headers.get("x-razorpay-event-id") ?? crypto.randomUUID();
  await db
    .insert(schema.webhookEvents)
    .values({ id: `razorpay:${eventId}`, provider: "razorpay", type: event.event, payload: event })
    .onConflictDoNothing();

  const payment = event.payload?.payment?.entity;
  if ((event.event === "payment.captured" || event.event === "order.paid") && payment?.order_id) {
    try {
      await fulfilOrder("razorpay", payment.order_id, payment.id, { amount: payment.amount, currency: payment.currency });
    } catch (e) {
      console.error("razorpay webhook fulfilment failed", e);
      return NextResponse.json({ error: "fulfilment_failed" }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
