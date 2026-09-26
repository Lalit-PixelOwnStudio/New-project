import "server-only";
import { z } from "zod";
import { present } from "@/lib/env";
import { PLAN_RANK, PLANS, type PaidPlan } from "@/lib/plans";
import { PRODUCTS, priceFor, type Currency, type ProductId, type Provider } from "@/lib/pricing";
import { capturePaypalOrder, createPaypalOrder } from "../integrations/paypal";
import { createRazorpayOrder, verifyCheckoutSignature } from "../integrations/razorpay";
import { addCredits } from "../repositories/credits";
import { createOrder, findOrderByProviderId, markOrderPaid, type Order } from "../repositories/orders";
import { addPass, lastEndAmong } from "../repositories/passes";
import { withTransaction } from "../repositories/transaction";
import { addUnlock } from "../repositories/unlocks";
import { ServiceError } from "./errors";

const DAY = 86_400_000;
const id = () => crypto.randomUUID();

export class CheckoutError extends ServiceError {}

/** What the pricing page may ask to buy. */
export const CheckoutInput = z.object({
  product: z.enum(["pass_week", "pass_month", "pass_year", "pages_100", "my_hand"]),
  currency: z.enum(["INR", "USD"]).nullish(),
});

export interface CheckoutStart {
  orderId: string;
  provider: Provider;
  providerOrderId: string;
  amount: number;
  currency: string;
  product: ProductId;
  description: string;
  /** Razorpay's public key, which its checkout needs in the browser. */
  razorpayKey?: string;
}

/** Creates our order and the matching order at the payment provider. */
export async function startCheckout(input: {
  userId: string;
  email: string;
  product: ProductId;
  country: string | null;
  /** The currency the buyer picked on the pricing page, if any. */
  currency?: Currency | null;
}): Promise<CheckoutStart> {
  const product = PRODUCTS[input.product];
  if (!product) throw new CheckoutError("Unknown product");
  const price = priceFor(input.product, input.country, input.currency);
  const orderId = id();
  const description = product.name;

  const providerOrderId =
    price.provider === "razorpay"
      ? (
          await createRazorpayOrder({
            amount: price.amount,
            currency: price.currency,
            receipt: orderId,
            notes: { orderId, product: input.product, email: input.email },
          })
        ).id
      : (await createPaypalOrder({ orderId, amount: price.amount, description })).id;

  await createOrder({
    id: orderId,
    userId: input.userId,
    product: input.product,
    styleId: null,
    provider: price.provider,
    providerOrderId,
    amount: price.amount,
    currency: price.currency,
    country: input.country,
  });

  return {
    orderId,
    provider: price.provider,
    providerOrderId,
    amount: price.amount,
    currency: price.currency,
    product: input.product,
    description,
    razorpayKey: price.provider === "razorpay" ? (present(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) ?? present(process.env.RAZORPAY_KEY_ID)) : undefined,
  };
}

/**
 * Marks an order paid and grants what was bought. Safe to call more than once
 * (checkout callback and webhook both call it): only the call that flips the
 * status grants anything.
 */
export async function fulfilOrder(provider: Provider, providerOrderId: string, paymentId: string | null, paid?: { amount: number; currency: string }) {
  const order = await findOrderByProviderId(provider, providerOrderId);
  if (!order) throw new CheckoutError("Order not found", 404);
  if (paid && (paid.amount !== order.amount || paid.currency !== order.currency)) {
    throw new CheckoutError("Paid amount does not match the order", 409);
  }

  // Flip and grant atomically: a paid order must never end up without its grant.
  const granted = await withTransaction(async (tx) => {
    if (!(await markOrderPaid(tx, order.id, paymentId))) return false;

    const grant = PRODUCTS[order.product as ProductId]?.grant ?? {};
    if (grant.plan) {
      // A plan starts now, unless an equal or better plan is already running,
      // in which case it follows on when that one ends. So an upgrade applies
      // straight away, and a cheaper plan bought meanwhile isn't wasted.
      const atLeast = (Object.keys(PLANS) as PaidPlan[]).filter((p) => PLAN_RANK[p] >= PLAN_RANK[grant.plan!]);
      const start = (await lastEndAmong(tx, order.userId, atLeast)) ?? new Date();
      await addPass(tx, {
        id: id(),
        userId: order.userId,
        orderId: order.id,
        plan: grant.plan,
        startsAt: start,
        endsAt: new Date(start.getTime() + PLANS[grant.plan].days * DAY),
      });
    }
    if (grant.credits) {
      await addCredits(tx, { userId: order.userId, delta: grant.credits, reason: `order:${order.product}`, orderId: order.id });
    }
    if (grant.hand) {
      // One unlock covers every handwriting the person makes from their own writing.
      await addUnlock(tx, { userId: order.userId, styleId: "mine", orderId: order.id });
    }
    return true;
  });
  return { order, granted };
}

/** What Razorpay Checkout hands the browser after a successful payment. */
export const RazorpayConfirmation = z.object({
  razorpay_order_id: z.string().max(64),
  razorpay_payment_id: z.string().max(64),
  razorpay_signature: z.string().max(256),
});

/** Confirms a Razorpay payment the browser reports, by its signature, and fulfils the order. */
export async function confirmRazorpayPayment(c: z.infer<typeof RazorpayConfirmation>): Promise<Order> {
  if (!verifyCheckoutSignature(c.razorpay_order_id, c.razorpay_payment_id, c.razorpay_signature)) {
    throw new CheckoutError("bad_signature", 400, "bad_signature");
  }
  return (await fulfilOrder("razorpay", c.razorpay_order_id, c.razorpay_payment_id)).order;
}

/** Captures a PayPal payment the buyer approved, then fulfils the order. */
export async function confirmPaypalPayment(paypalOrderId: string): Promise<Order> {
  const capture = await capturePaypalOrder(paypalOrderId);
  const c = capture.purchase_units[0]?.payments?.captures?.[0];
  if (capture.status !== "COMPLETED" || !c || c.status !== "COMPLETED") {
    throw new CheckoutError("Payment was not completed", 402, "not_completed");
  }
  const { order } = await fulfilOrder("paypal", paypalOrderId, c.id, {
    amount: Math.round(Number(c.amount.value) * 100),
    currency: c.amount.currency_code,
  });
  return order;
}
