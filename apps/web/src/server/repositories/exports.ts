import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";
import { db, schema } from "../db";
import type { Executor } from "./transaction";

/** A signed-in person, or a visitor known only by their anonymous cookie. */
export interface Visitor {
  userId: string | null;
  anonId: string | null;
}

/** Free pages downloaded since `since`: pages that weren't paid for with credits. */
export async function freePagesSince(who: Visitor, since: Date): Promise<number> {
  const owner = who.userId ? eq(schema.exportLog.userId, who.userId) : who.anonId ? eq(schema.exportLog.anonId, who.anonId) : null;
  if (!owner) return 0;
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.exportLog.pages} - ${schema.exportLog.creditsUsed}), 0)` })
    .from(schema.exportLog)
    .where(and(owner, gt(schema.exportLog.createdAt, since)));
  return Number(row?.total ?? 0);
}

export async function logExport(ex: Executor, who: Visitor, entry: { pages: number; creditsUsed: number; dpi: number }) {
  await ex.insert(schema.exportLog).values({
    id: crypto.randomUUID(),
    userId: who.userId,
    anonId: who.userId ? null : who.anonId,
    ...entry,
  });
}
