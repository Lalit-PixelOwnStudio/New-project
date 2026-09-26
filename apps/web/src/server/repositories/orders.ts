import "server-only";
import { and, desc, eq, ne } from "drizzle-orm";
import type { Provider } from "@/lib/pricing";
import { db, schema } from "../db";
import type { Executor } from "./transaction";

export type Order = typeof schema.orders.$inferSelect;
export type NewOrder = typeof schema.orders.$inferInsert;

export async function createOrder(order: NewOrder) {
  await db.insert(schema.orders).values(order);
}

export async function findOrderByProviderId(provider: Provider, providerOrderId: string): Promise<Order | undefined> {
  const [order] = await db
    .select()
    .from(schema.orders)
    .where(and(eq(schema.orders.provider, provider), eq(schema.orders.providerOrderId, providerOrderId)));
  return order;
}

/** Marks an order paid. False if it already was, so the caller grants nothing twice. */
export async function markOrderPaid(ex: Executor, orderId: string, paymentId: string | null): Promise<boolean> {
  const flipped = await ex
    .update(schema.orders)
    .set({ status: "paid", paidAt: new Date(), providerPaymentId: paymentId })
    .where(and(eq(schema.orders.id, orderId), ne(schema.orders.status, "paid")))
    .returning({ id: schema.orders.id });
  return flipped.length > 0;
}

export function ordersForUser(userId: string, limit = 50): Promise<Order[]> {
  return db.select().from(schema.orders).where(eq(schema.orders.userId, userId)).orderBy(desc(schema.orders.createdAt)).limit(limit);
}
