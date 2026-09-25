import "server-only";

/**
 * PayPal Orders v2 over plain HTTPS, for everyone outside India, in USD.
 * PAYPAL_ENV=live switches from the sandbox to production.
 */
const base = () => (process.env.PAYPAL_ENV?.trim() === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");

export const paypalConfigured = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);

let cached: { token: string; expires: number } | null = null;

async function token() {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal is not configured");
  const res = await fetch(`${base()}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return cached.token;
}

async function call<T>(path: string, init: RequestInit & { idempotencyKey?: string } = {}): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await token()}`,
      "Content-Type": "application/json",
      ...(init.idempotencyKey ? { "PayPal-Request-Id": init.idempotencyKey } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`PayPal ${path} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

export async function createPaypalOrder(input: { orderId: string; amount: number; description: string }) {
  return call<{ id: string; status: string }>("/v2/checkout/orders", {
    method: "POST",
    idempotencyKey: `create-${input.orderId}`,
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.orderId,
          custom_id: input.orderId,
          description: input.description,
          amount: { currency_code: "USD", value: (input.amount / 100).toFixed(2) },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: { brand_name: "Truehand", shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
        },
      },
    }),
  });
}

export interface PaypalCapture {
  id: string;
  status: string;
  purchase_units: {
    custom_id?: string;
    payments?: { captures?: { id: string; status: string; amount: { currency_code: string; value: string } }[] };
  }[];
}

export async function capturePaypalOrder(paypalOrderId: string) {
  return call<PaypalCapture>(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: "POST",
    idempotencyKey: `capture-${paypalOrderId}`,
    body: "{}",
  });
}

/** Asks PayPal to confirm a webhook really came from PayPal. */
export async function verifyPaypalWebhook(headers: Headers, event: unknown) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;
  const result = await call<{ verification_status: string }>("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: event,
    }),
  });
  return result.verification_status === "SUCCESS";
}
