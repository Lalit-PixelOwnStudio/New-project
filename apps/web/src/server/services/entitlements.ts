import "server-only";
import { FREE_ENTITLEMENTS, LIMITS, PLAN_RANK, type Entitlements, type PlanId } from "@/lib/plans";
import { creditBalance } from "../repositories/credits";
import { runningPasses } from "../repositories/passes";
import { unlockedStyles } from "../repositories/unlocks";

/** What a person may do right now: their plan, pages left and unlocks. */
export async function getEntitlements(userId: string | null | undefined): Promise<Entitlements> {
  if (!userId) return FREE_ENTITLEMENTS;
  const now = new Date();
  const [running, credits, unlocks] = await Promise.all([runningPasses(userId, now), creditBalance(userId), unlockedStyles(userId)]);

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
    credits: Math.max(0, credits),
    unlockedStyles: unlocks,
    limits: LIMITS[plan],
    signedIn: true,
  };
}
