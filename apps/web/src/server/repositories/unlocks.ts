import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import type { Executor } from "./transaction";

export async function unlockedStyles(userId: string): Promise<string[]> {
  const rows = await db.select({ styleId: schema.styleUnlocks.styleId }).from(schema.styleUnlocks).where(eq(schema.styleUnlocks.userId, userId));
  return rows.map((r) => r.styleId);
}

/** Unlocks a style for good. Buying it twice changes nothing. */
export async function addUnlock(ex: Executor, unlock: { userId: string; styleId: string; orderId: string }) {
  await ex.insert(schema.styleUnlocks).values(unlock).onConflictDoNothing();
}
