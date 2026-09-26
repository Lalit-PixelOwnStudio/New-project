import "server-only";
import { z } from "zod";
import { present } from "@/lib/env";
import type { Visitor } from "../repositories/exports";
import { feedbackCountSince, feedbackStats, insertFeedback } from "../repositories/feedback";
import { getEntitlements } from "./entitlements";
import { ServiceError } from "./errors";

/** What the browser may send. The written text itself is never part of it. */
export const FeedbackInput = z.object({
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
export type Feedback = z.infer<typeof FeedbackInput>;

/** More than this from one visitor in a day is someone spamming the form. */
export const DAILY_LIMIT = 20;

/** Stores a rating, with the visitor's plan and country for context. */
export async function submitFeedback(input: Feedback, who: Visitor, country: string | null) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if ((await feedbackCountSince(who, since)) >= DAILY_LIMIT) throw new ServiceError("too_many", 429, "too_many");
  const { plan } = await getEntitlements(who.userId);
  await insertFeedback({
    id: crypto.randomUUID(),
    rating: input.rating,
    message: input.message || null,
    email: input.email ? input.email.toLowerCase() : null,
    userId: who.userId,
    anonId: who.anonId,
    context: { ...input.context, plan, country },
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

/** Totals, the spread of ratings, and the latest comments, for the admin page. */
export async function feedbackSummary() {
  const stats = await feedbackStats();
  return {
    total: stats.total,
    average: stats.average ? Number(stats.average) : null,
    byRating: Object.fromEntries(stats.byRating.map((r) => [r.rating, r.n])) as Record<number, number>,
    latest: stats.latest,
  };
}
