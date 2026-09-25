import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";
import type { Entitlements } from "@/lib/plans";
import { db, schema } from "./db";

export interface ExportRequest {
  pages: number;
  dpi: number;
  /** Pro-only choices the export uses (style:x, paper:y, effect:z…). */
  pro: string[];
}

export interface ExportGrant {
  allowed: number;
  creditsUsed: number;
  freeLeftToday: number;
  creditsLeft: number;
}

export class QuotaError extends Error {
  constructor(
    message: string,
    readonly code: "pro_required" | "daily_limit" | "bad_request",
  ) {
    super(message);
  }
}

/**
 * Pure decision: how many pages this export may include and how many credits
 * it spends. Free users get `pagesPerExport` per download and `pagesPerDay`
 * per rolling day; page credits cover anything beyond that.
 */
export function decide(req: ExportRequest, ent: Entitlements, usedToday: number): ExportGrant {
  const pages = Math.max(0, Math.floor(req.pages));
  if (!pages) throw new QuotaError("Nothing to export", "bad_request");
  const l = ent.limits;
  const lockedPro = req.pro.filter((p) => {
    if (p.startsWith("style:")) return !l.proStyles && !ent.unlockedStyles.includes(p.slice(6));
    if (p.startsWith("paper:")) return !l.proPapers;
    if (p.startsWith("pen:")) return !l.proPens;
    if (p.startsWith("effect:")) return !l.effects;
    if (p === "ink-color") return !l.customInk;
    if (p === "fatigue") return !l.fatigue;
    if (p === "transparent") return !l.transparent;
    return false;
  });
  if (lockedPro.length || req.dpi > l.maxDpi) throw new QuotaError("This export uses Pro features", "pro_required");

  const freeLeftToday = Math.max(0, l.pagesPerDay - usedToday);
  const free = Math.min(pages, l.pagesPerExport, freeLeftToday);
  const creditsUsed = Math.min(pages - free, ent.credits);
  const allowed = free + creditsUsed;
  if (!allowed) throw new QuotaError("You've used today's free pages", "daily_limit");
  return { allowed, creditsUsed, freeLeftToday: freeLeftToday - free, creditsLeft: ent.credits - creditsUsed };
}

export async function pagesUsedToday(who: { userId: string | null; anonId: string | null }) {
  const since = new Date(Date.now() - 86_400_000);
  const owner = who.userId ? eq(schema.exportLog.userId, who.userId) : who.anonId ? eq(schema.exportLog.anonId, who.anonId) : null;
  if (!owner) return 0;
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.exportLog.pages} - ${schema.exportLog.creditsUsed}), 0)` })
    .from(schema.exportLog)
    .where(and(owner, gt(schema.exportLog.createdAt, since)));
  return Number(row?.total ?? 0);
}

export async function recordExport(who: { userId: string | null; anonId: string | null }, grant: ExportGrant, dpi: number) {
  await db.transaction(async (tx) => {
    await tx.insert(schema.exportLog).values({
      id: crypto.randomUUID(),
      userId: who.userId,
      anonId: who.userId ? null : who.anonId,
      pages: grant.allowed,
      creditsUsed: grant.creditsUsed,
      dpi,
    });
    if (grant.creditsUsed && who.userId) {
      await tx.insert(schema.creditLedger).values({ id: crypto.randomUUID(), userId: who.userId, delta: -grant.creditsUsed, reason: "export" });
    }
  });
}
