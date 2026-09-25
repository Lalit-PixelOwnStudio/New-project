import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";
import { FREE_ENTITLEMENTS, LIMITS, type Entitlements } from "@/lib/plans";
import { db, schema } from "./db";

export async function getEntitlements(userId: string | null | undefined): Promise<Entitlements> {
  if (!userId) return FREE_ENTITLEMENTS;
  const now = new Date();
  const [pass] = await db
    .select({ endsAt: sql<Date>`max(${schema.passes.endsAt})` })
    .from(schema.passes)
    .where(and(eq(schema.passes.userId, userId), gt(schema.passes.endsAt, now)));
  const [credit] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.creditLedger.delta}), 0)` })
    .from(schema.creditLedger)
    .where(eq(schema.creditLedger.userId, userId));
  const unlocks = await db.select({ styleId: schema.styleUnlocks.styleId }).from(schema.styleUnlocks).where(eq(schema.styleUnlocks.userId, userId));

  const proUntil = pass?.endsAt ? new Date(pass.endsAt) : null;
  const plan = proUntil && proUntil > now ? "pro" : "free";
  return {
    plan,
    proUntil: proUntil?.toISOString() ?? null,
    credits: Math.max(0, Number(credit?.total ?? 0)),
    unlockedStyles: unlocks.map((u) => u.styleId),
    limits: LIMITS[plan],
    signedIn: true,
  };
}
