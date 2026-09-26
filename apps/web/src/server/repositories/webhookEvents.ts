import "server-only";
import { db, schema } from "../db";

/** Keeps every provider event we receive, once, for auditing and replays. */
export async function recordWebhookEvent(event: { id: string; provider: "razorpay" | "paypal"; type: string; payload: unknown }) {
  await db.insert(schema.webhookEvents).values(event).onConflictDoNothing();
}
