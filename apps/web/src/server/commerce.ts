import "server-only";
import { STYLES } from "@truehand/catalog";
import { and, eq, gt, inArray, ne, sql } from "drizzle-orm";
import { PLAN_RANK, PLANS, type PaidPlan } from "@/lib/plans";
import { PRODUCTS, priceFor, type Currency, type ProductId, type Provider } from "@/lib/pricing";
import { db, schema } from "./db";
import { createPaypalOrder } from "./payments/paypal";
import { createRazorpayOrder } from "./payments/razorpay";

const id = () => crypto.randomUUID();
const DAY = 86_400_000;

export class CheckoutError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export interface CheckoutStart {
  orderId: string;
  provider: Provider;
  providerOrderId: string;
  amount: number;
  currency: string;
  product: ProductId;
  description: string;
}

/** Creates our order and the matching order at the payment provider. */
export async function startCheckout(input: {
  userId: string;
  email: string;
  product: ProductId;
  styleId?: string | null;
  country: string | null;
  /** The currency the buyer picked on the pricing page, if any. */
  currency?: Currency | null;
}): Promise<CheckoutStart> {
  const product = PRODUCTS[input.product];
  if (!product) throw new CheckoutError("Unknown product");
  if (product.grant.style) {
    const style = STYLES.find((s) => s.id === input.styleId);
    if (!style || style.tier !== "pro") throw new CheckoutError("Choose a Pro handwriting to unlock");
  }
  const price = priceFor(input.product, input.country, input.currency);
  const orderId = id();
  const description = product.grant.style ? `${product.name}: ${STYLES.find((s) => s.id === input.styleId)?.name}` : product.name;

  let providerOrderId: string;
  if (price.provider === "razorpay") {
    const order = await createRazorpayOrder({
      amount: price.amount,
      currency: "INR",
      receipt: orderId,
      notes: { orderId, product: input.product, email: input.email },
    });
    providerOrderId = order.id;
  } else {
    const order = await createPaypalOrder({ orderId, amount: price.amount, description });
    providerOrderId = order.id;
  }

  await db.insert(schema.orders).values({
    id: orderId,
    userId: input.userId,
    product: input.product,
    styleId: product.grant.style ? (input.styleId ?? null) : null,
    provider: price.provider,
    providerOrderId,
    amount: price.amount,
    currency: price.currency,
    country: input.country,
  });

  return { orderId, provider: price.provider, providerOrderId, amount: price.amount, currency: price.currency, product: input.product, description };
}

/**
 * Marks an order paid and grants what was bought. Safe to call more than once
 * (checkout callback and webhook both call it): only the call that flips the
 * status grants anything.
 */
export async function fulfilOrder(provider: Provider, providerOrderId: string, paymentId: string | null, paid?: { amount: number; currency: string }) {
  const [order] = await db
    .select()
    .from(schema.orders)
    .where(and(eq(schema.orders.provider, provider), eq(schema.orders.providerOrderId, providerOrderId)));
  if (!order) throw new CheckoutError("Order not found", 404);
  if (paid && (paid.amount !== order.amount || paid.currency !== order.currency)) {
    throw new CheckoutError("Paid amount does not match the order", 409);
  }

  // Flip and grant atomically: a paid order must never end up without its grant.
  const granted = await db.transaction(async (tx) => {
    const flipped = await tx
      .update(schema.orders)
      .set({ status: "paid", paidAt: new Date(), providerPaymentId: paymentId })
      .where(and(eq(schema.orders.id, order.id), ne(schema.orders.status, "paid")))
      .returning({ id: schema.orders.id });
    if (!flipped.length) return false;

    const grant = PRODUCTS[order.product as ProductId]?.grant ?? {};
    if (grant.plan) {
      // A plan starts now, unless an equal or better plan is already running,
      // in which case it follows on when that one ends. So an upgrade applies
      // straight away, and a cheaper plan bought meanwhile isn't wasted.
      const atLeast = (Object.keys(PLANS) as PaidPlan[]).filter((p) => PLAN_RANK[p] >= PLAN_RANK[grant.plan!]);
      const [current] = await tx
        .select({ endsAt: sql<Date | null>`max(${schema.passes.endsAt})` })
        .from(schema.passes)
        .where(and(eq(schema.passes.userId, order.userId), gt(schema.passes.endsAt, new Date()), inArray(schema.passes.plan, atLeast)));
      const start = current?.endsAt ? new Date(current.endsAt) : new Date();
      await tx.insert(schema.passes).values({
        id: id(),
        userId: order.userId,
        orderId: order.id,
        plan: grant.plan,
        startsAt: start,
        endsAt: new Date(start.getTime() + PLANS[grant.plan].days * DAY),
      });
    }
    if (grant.credits) {
      await tx
        .insert(schema.creditLedger)
        .values({ id: id(), userId: order.userId, delta: grant.credits, reason: `order:${order.product}`, orderId: order.id });
    }
    if (grant.style && order.styleId) {
      await tx.insert(schema.styleUnlocks).values({ userId: order.userId, styleId: order.styleId, orderId: order.id }).onConflictDoNothing();
    }
    return true;
  });
  return { order, granted };
}
