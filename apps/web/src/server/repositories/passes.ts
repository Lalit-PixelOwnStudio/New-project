import "server-only";
import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { db, schema } from "../db";
import type { Executor } from "./transaction";

export type NewPass = typeof schema.passes.$inferInsert;

/** Plans that haven't ended yet, including ones queued to start later. */
export function runningPasses(userId: string, now = new Date()) {
  return db
    .select({ plan: schema.passes.plan, startsAt: schema.passes.startsAt, endsAt: schema.passes.endsAt })
    .from(schema.passes)
    .where(and(eq(schema.passes.userId, userId), gt(schema.passes.endsAt, now)));
}

/** When the last running plan among `plans` ends, or null if none is running. */
export async function lastEndAmong(ex: Executor, userId: string, plans: string[], now = new Date()): Promise<Date | null> {
  const [row] = await ex
    .select({ endsAt: sql<Date | null>`max(${schema.passes.endsAt})` })
    .from(schema.passes)
    .where(and(eq(schema.passes.userId, userId), gt(schema.passes.endsAt, now), inArray(schema.passes.plan, plans)));
  return row?.endsAt ? new Date(row.endsAt) : null;
}

export async function addPass(ex: Executor, pass: NewPass) {
  await ex.insert(schema.passes).values(pass);
}
