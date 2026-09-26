import "server-only";
import { z } from "zod";
import type { Entitlements } from "@/lib/plans";
import { addCredits } from "../repositories/credits";
import { freePagesSince, logExport, type Visitor } from "../repositories/exports";
import { withTransaction } from "../repositories/transaction";
import { getEntitlements } from "./entitlements";
import { ServiceError } from "./errors";

/** What the download window asks for before rendering. */
export const ExportInput = z.object({
  pages: z.number().int().min(1).max(500),
  dpi: z.number().int().min(72).max(600),
  /** Pro-only choices the export uses (style:x, paper:y, effect:z…). */
  pro: z.array(z.string().max(64)).max(20),
});
export type ExportRequest = z.infer<typeof ExportInput>;

export interface ExportGrant {
  allowed: number;
  creditsUsed: number;
  freeLeftToday: number;
  creditsLeft: number;
}

export class QuotaError extends ServiceError {
  constructor(
    message: string,
    override readonly code: "pro_required" | "daily_limit" | "bad_request",
  ) {
    super(message, code === "bad_request" ? 400 : 402, code);
  }
}

/**
 * Pure decision: how many pages this export may include and how many credits
 * it spends. Everyone gets up to `pagesPerExport` per download and `pagesPerDay`
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

/** Free pages used in the last 24 hours. */
export const pagesUsedToday = (who: Visitor) => freePagesSince(who, new Date(Date.now() - 86_400_000));

/** Decides an export for this visitor and records it, spending credits if it needs them. */
export async function reserveExport(who: Visitor, req: ExportRequest): Promise<ExportGrant> {
  const ent = await getEntitlements(who.userId);
  const grant = decide(req, ent, await pagesUsedToday(who));
  await withTransaction(async (tx) => {
    await logExport(tx, who, { pages: grant.allowed, creditsUsed: grant.creditsUsed, dpi: req.dpi });
    if (grant.creditsUsed && who.userId) await addCredits(tx, { userId: who.userId, delta: -grant.creditsUsed, reason: "export" });
  });
  return grant;
}
