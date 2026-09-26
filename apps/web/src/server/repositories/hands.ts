import "server-only";
import { and, eq } from "drizzle-orm";
import type { CapturedHand } from "@truehand/engine";
import { db, schema } from "../db";

export type HandRow = typeof schema.customHands.$inferSelect;

export function handsFor(userId: string): Promise<HandRow[]> {
  return db.select().from(schema.customHands).where(eq(schema.customHands.userId, userId));
}

export async function handIdsFor(userId: string): Promise<string[]> {
  const rows = await db.select({ id: schema.customHands.id }).from(schema.customHands).where(eq(schema.customHands.userId, userId));
  return rows.map((r) => r.id);
}

/** Saves a hand, replacing the one with the same id. */
export async function upsertHand(userId: string, hand: { id: string; name: string; data: CapturedHand }) {
  await db
    .insert(schema.customHands)
    .values({ ...hand, userId })
    .onConflictDoUpdate({ target: [schema.customHands.userId, schema.customHands.id], set: { name: hand.name, data: hand.data, updatedAt: new Date() } });
}

export async function deleteHand(userId: string, id: string) {
  await db.delete(schema.customHands).where(and(eq(schema.customHands.userId, userId), eq(schema.customHands.id, id)));
}
