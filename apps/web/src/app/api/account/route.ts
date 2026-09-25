import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { db, schema } from "@/server/db";

export const dynamic = "force-dynamic";

/** Deletes the account and everything attached to it (documents, passes, credits). */
export async function DELETE() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  await db.delete(schema.user).where(eq(schema.user.id, user.id));
  return NextResponse.json({ ok: true });
}
