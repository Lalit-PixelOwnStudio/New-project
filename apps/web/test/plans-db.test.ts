import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

// A throwaway embedded database, migrated like production.
process.env.PGLITE_DIR = mkdtempSync(join(tmpdir(), "truehand-plans-"));
const { db, schema } = await import("@/server/db");
const { fulfilOrder } = await import("@/server/commerce");
const { getEntitlements } = await import("@/server/entitlements");
const { migrate } = await import("drizzle-orm/pglite/migrator");

const DAY = 86_400_000;
let n = 0;

async function buy(userId: string, product: string) {
  const providerOrderId = `test_${++n}`;
  await db.insert(schema.orders).values({ id: `order_${n}`, userId, product, provider: "razorpay", providerOrderId, amount: 100, currency: "INR" });
  return fulfilOrder("razorpay", providerOrderId, `pay_${n}`);
}

beforeAll(async () => {
  await migrate(db as never, { migrationsFolder: join(import.meta.dirname, "..", "drizzle") });
  for (const id of ["a", "b"]) await db.insert(schema.user).values({ id, name: id, email: `${id}@example.com` });
});

describe("plans", () => {
  it("starts as Free", async () => {
    expect(await getEntitlements("a")).toMatchObject({ plan: "free", credits: 0, proUntil: null });
  });

  it("activates Week with its pages, and grants only once", async () => {
    const first = await buy("a", "pass_week");
    expect(first.granted).toBe(true);
    const again = await fulfilOrder("razorpay", first.order.providerOrderId, "pay_again");
    expect(again.granted).toBe(false);
    const ent = await getEntitlements("a");
    expect(ent).toMatchObject({ plan: "week", credits: 150 });
    expect(ent.limits.maxDpi).toBe(200);
    expect(new Date(ent.proUntil!).getTime()).toBeGreaterThan(Date.now() + 6.9 * DAY);
  });

  it("applies an upgrade straight away", async () => {
    await buy("a", "pass_month");
    const ent = await getEntitlements("a");
    expect(ent).toMatchObject({ plan: "month", credits: 950 });
    expect(ent.limits.maxDpi).toBe(300);
  });

  it("queues a cheaper plan behind a better one", async () => {
    await buy("b", "pass_month");
    await buy("b", "pass_week");
    const passes = await db
      .select()
      .from(schema.passes)
      .where((await import("drizzle-orm")).eq(schema.passes.userId, "b"));
    const month = passes.find((p) => p.plan === "month")!;
    const week = passes.find((p) => p.plan === "week")!;
    expect(week.startsAt.getTime()).toBe(month.endsAt.getTime());
    const ent = await getEntitlements("b");
    expect(ent.plan).toBe("month");
    expect(new Date(ent.proUntil!).getTime()).toBe(week.endsAt.getTime());
  });
});
