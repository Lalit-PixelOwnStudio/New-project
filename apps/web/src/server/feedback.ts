import "server-only";
import { and, avg, count, desc, eq, gte } from "drizzle-orm";
import { z } from "zod";
import { present } from "@/lib/env";
import { db, schema } from "./db";

/** What the browser may send. The written text itself is never part of it. */
export const FeedbackBody = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().max(2000).optional(),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]).optional(),
  context: z
    .object({
      source: z.enum(["download", "page", "guide"]),
      guide: z.string().max(80).optional(),
      style: z.string().max(40).optional(),
      paper: z.string().max(40).optional(),
      pen: z.string().max(40).optional(),
      pages: z.number().int().min(0).max(1000).optional(),
      format: z.enum(["pdf", "png", "zip"]).optional(),
      dpi: z.number().int().min(72).max(600).optional(),
      effect: z.string().max(20).optional(),
    })
    .strict(),
});
export type FeedbackInput = z.infer<typeof FeedbackBody>;

/** More than this from one visitor in a day is someone spamming the form. */
export const DAILY_LIMIT = 20;

export async function feedbackToday(who: { userId: string | null; anonId: string | null }) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const whose = who.userId ? eq(schema.feedback.userId, who.userId) : who.anonId ? eq(schema.feedback.anonId, who.anonId) : null;
  if (!whose) return 0;
  const [row] = await db
    .select({ n: count() })
    .from(schema.feedback)
    .where(and(whose, gte(schema.feedback.createdAt, since)));
  return row?.n ?? 0;
}

export async function saveFeedback(
  input: FeedbackInput,
  who: { userId: string | null; anonId: string | null },
  extra: { plan: string; country: string | null },
) {
  await db.insert(schema.feedback).values({
    id: crypto.randomUUID(),
    rating: input.rating,
    message: input.message || null,
    email: input.email ? input.email.toLowerCase() : null,
    userId: who.userId,
    anonId: who.anonId,
    context: { ...input.context, ...extra },
  });
}

/** Emails listed in ADMIN_EMAILS (comma separated) can read feedback. */
export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const admins = (present(process.env.ADMIN_EMAILS) ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export async function feedbackSummary() {
  const [totals] = await db.select({ n: count(), average: avg(schema.feedback.rating) }).from(schema.feedback);
  const byRating = await db.select({ rating: schema.feedback.rating, n: count() }).from(schema.feedback).groupBy(schema.feedback.rating);
  const latest = await db.select().from(schema.feedback).orderBy(desc(schema.feedback.createdAt)).limit(200);
  return {
    total: totals?.n ?? 0,
    average: totals?.average ? Number(totals.average) : null,
    byRating: Object.fromEntries(byRating.map((r) => [r.rating, r.n])) as Record<number, number>,
    latest,
  };
}
