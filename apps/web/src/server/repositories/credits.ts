import "server-only";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "../db";
import type { Executor } from "./transaction";

/** Pages bought and not yet used: the sum of every credit and debit. */
export async function creditBalance(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.creditLedger.delta}), 0)` })
    .from(schema.creditLedger)
    .where(eq(schema.creditLedger.userId, userId));
  return Number(row?.total ?? 0);
}

/** Adds (or, with a negative delta, spends) page credits. */
export async function addCredits(ex: Executor, entry: { userId: string; delta: number; reason: string; orderId?: string }) {
  await ex.insert(schema.creditLedger).values({ id: crypto.randomUUID(), ...entry });
}
