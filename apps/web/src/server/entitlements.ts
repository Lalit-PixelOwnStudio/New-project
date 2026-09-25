import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";
import { FREE_ENTITLEMENTS, LIMITS, PLAN_RANK, type Entitlements, type PlanId } from "@/lib/plans";
import { db, schema } from "./db";

export async function getEntitlements(userId: string | null | undefined): Promise<Entitlements> {
  if (!userId) return FREE_ENTITLEMENTS;
  const now = new Date();
  const running = await db
    .select({ plan: schema.passes.plan, startsAt: schema.passes.startsAt, endsAt: schema.passes.endsAt })
    .from(schema.passes)
    .where(and(eq(schema.passes.userId, userId), gt(schema.passes.endsAt, now)));
  const [credit] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.creditLedger.delta}), 0)` })
    .from(schema.creditLedger)
    .where(eq(schema.creditLedger.userId, userId));
  const unlocks = await db.select({ styleId: schema.styleUnlocks.styleId }).from(schema.styleUnlocks).where(eq(schema.styleUnlocks.userId, userId));

  // The best plan that has started; later plans queued behind it don't count yet.
  let plan: PlanId = "free";
  for (const p of running) {
    const id = (p.plan in PLAN_RANK ? p.plan : "month") as PlanId;
    if (new Date(p.startsAt) <= now && PLAN_RANK[id] > PLAN_RANK[plan]) plan = id;
  }
  // Paid access runs until the last of the user's plans ends.
  const until = running.reduce<Date | null>((max, p) => (!max || new Date(p.endsAt) > max ? new Date(p.endsAt) : max), null);

  return {
    plan,
    proUntil: plan === "free" ? null : (until?.toISOString() ?? null),
    credits: Math.max(0, Number(credit?.total ?? 0)),
    unlockedStyles: unlocks.map((u) => u.styleId),
    limits: LIMITS[plan],
    signedIn: true,
  };
}
