import "server-only";
import { and, avg, count, desc, eq, gte } from "drizzle-orm";
import { db, schema } from "../db";
import type { Visitor } from "./exports";

export type FeedbackRow = typeof schema.feedback.$inferSelect;
export type NewFeedback = typeof schema.feedback.$inferInsert;

export async function feedbackCountSince(who: Visitor, since: Date): Promise<number> {
  const whose = who.userId ? eq(schema.feedback.userId, who.userId) : who.anonId ? eq(schema.feedback.anonId, who.anonId) : null;
  if (!whose) return 0;
  const [row] = await db
    .select({ n: count() })
    .from(schema.feedback)
    .where(and(whose, gte(schema.feedback.createdAt, since)));
  return row?.n ?? 0;
}

export async function insertFeedback(entry: NewFeedback) {
  await db.insert(schema.feedback).values(entry);
}

export async function feedbackStats(latest = 200) {
  const [totals] = await db.select({ n: count(), average: avg(schema.feedback.rating) }).from(schema.feedback);
  const byRating = await db.select({ rating: schema.feedback.rating, n: count() }).from(schema.feedback).groupBy(schema.feedback.rating);
  const rows = await db.select().from(schema.feedback).orderBy(desc(schema.feedback.createdAt)).limit(latest);
  return { total: totals?.n ?? 0, average: totals?.average ?? null, byRating, latest: rows };
}
