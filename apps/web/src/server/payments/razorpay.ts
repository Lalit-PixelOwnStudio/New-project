import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Currency } from "@/lib/pricing";

/**
 * Razorpay Orders API over plain HTTPS. Used for payments from India in INR
 * (UPI, cards, net banking and wallets through Razorpay Checkout), and for
 * international cards in USD once the account has international payments.
 */
/** RAZORPAY_API_URL only points tests at a stand-in server; it is never set in production. */
const api = () => process.env.RAZORPAY_API_URL?.trim() || "https://api.razorpay.com/v1";

export const razorpayConfigured = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

function authHeader() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new Error("Razorpay is not configured");
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

export async function createRazorpayOrder(input: { amount: number; currency: Currency; receipt: string; notes: Record<string, string> }) {
  const res = await fetch(`${api()}/orders`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, payment_capture: 1 }),
  });
  if (!res.ok) throw new Error(`Razorpay order failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as { id: string; amount: number; currency: string; status: string };
}

function safeEqualHex(a: string, b: string) {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

/** Checkout returns order id, payment id and signature; the signature proves Razorpay sent them. */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string, secret = process.env.RAZORPAY_KEY_SECRET ?? "") {
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Webhooks are signed over the raw body with the webhook secret. */
export function verifyWebhookSignature(rawBody: string, signature: string, secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "") {
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
