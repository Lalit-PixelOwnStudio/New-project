import { NextResponse } from "next/server";
import { db, schema } from "@/server/db";
import { fulfilOrder } from "@/server/commerce";
import { verifyPaypalWebhook } from "@/server/payments/paypal";

export const dynamic = "force-dynamic";

/** Backup path for fulfilment. Subscribe to PAYMENT.CAPTURE.COMPLETED. */
export async function POST(req: Request) {
  const event = (await req.json().catch(() => null)) as {
    id: string;
    event_type: string;
    resource?: { id: string; amount?: { value: string; currency_code: string }; supplementary_data?: { related_ids?: { order_id?: string } } };
  } | null;
  if (!event || !(await verifyPaypalWebhook(req.headers, event))) {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }
  await db
    .insert(schema.webhookEvents)
    .values({ id: `paypal:${event.id}`, provider: "paypal", type: event.event_type, payload: event })
    .onConflictDoNothing();

  const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" && orderId && event.resource?.amount) {
    try {
      await fulfilOrder("paypal", orderId, event.resource.id, {
        amount: Math.round(Number(event.resource.amount.value) * 100),
        currency: event.resource.amount.currency_code,
      });
    } catch (e) {
      console.error("paypal webhook fulfilment failed", e);
      return NextResponse.json({ error: "fulfilment_failed" }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
