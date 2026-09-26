import "server-only";
import { verifyPaypalWebhook } from "../integrations/paypal";
import { verifyWebhookSignature } from "../integrations/razorpay";
import { recordWebhookEvent } from "../repositories/webhookEvents";
import { fulfilOrder } from "./checkout";
import { ServiceError } from "./errors";

/**
 * Webhooks are the backup path for fulfilment: if the buyer closes the tab
 * before the browser reports success, the provider still tells us. Every
 * event is kept once; fulfilment is idempotent, so a repeat grants nothing.
 */

const badSignature = () => new ServiceError("bad_signature", 400, "bad_signature");

async function fulfil(...args: Parameters<typeof fulfilOrder>) {
  try {
    await fulfilOrder(...args);
  } catch (e) {
    console.error(`${args[0]} webhook fulfilment failed`, e);
    // A 5xx makes the provider retry later.
    throw new ServiceError("fulfilment_failed", 500, "fulfilment_failed");
  }
}

interface RazorpayEvent {
  event: string;
  payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; currency: string } } };
}

/** Razorpay: subscribe to payment.captured (order.paid works too). */
export async function handleRazorpayWebhook(raw: string, signature: string, eventId: string | null) {
  if (!verifyWebhookSignature(raw, signature)) throw badSignature();
  const event = JSON.parse(raw) as RazorpayEvent;
  await recordWebhookEvent({ id: `razorpay:${eventId ?? crypto.randomUUID()}`, provider: "razorpay", type: event.event, payload: event });

  const payment = event.payload?.payment?.entity;
  if ((event.event === "payment.captured" || event.event === "order.paid") && payment?.order_id) {
    await fulfil("razorpay", payment.order_id, payment.id, { amount: payment.amount, currency: payment.currency });
  }
}

export interface PaypalEvent {
  id: string;
  event_type: string;
  resource?: { id: string; amount?: { value: string; currency_code: string }; supplementary_data?: { related_ids?: { order_id?: string } } };
}

/** PayPal: subscribe to PAYMENT.CAPTURE.COMPLETED. */
export async function handlePaypalWebhook(headers: Headers, event: PaypalEvent | null) {
  if (!event || !(await verifyPaypalWebhook(headers, event))) throw badSignature();
  await recordWebhookEvent({ id: `paypal:${event.id}`, provider: "paypal", type: event.event_type, payload: event });

  const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" && orderId && event.resource?.amount) {
    await fulfil("paypal", orderId, event.resource.id, {
      amount: Math.round(Number(event.resource.amount.value) * 100),
      currency: event.resource.amount.currency_code,
    });
  }
}
