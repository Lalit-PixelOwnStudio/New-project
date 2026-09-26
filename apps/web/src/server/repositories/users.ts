import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";

/** Deletes a user; their orders, plans, credits, hands and sessions go with them (cascade). */
export async function deleteUser(userId: string) {
  await db.delete(schema.user).where(eq(schema.user.id, userId));
}
