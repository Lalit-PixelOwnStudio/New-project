import "server-only";
import { db, schema } from "../db";

/** Adds an email to the business waitlist, or updates what they told us. */
export async function upsertWaitlistEntry(email: string, details: { company?: string; useCase?: string; volume?: string }) {
  await db
    .insert(schema.waitlist)
    .values({ email, ...details })
    .onConflictDoUpdate({ target: schema.waitlist.email, set: details });
}
