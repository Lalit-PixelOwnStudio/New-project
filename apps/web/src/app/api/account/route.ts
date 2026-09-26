import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { deleteAccount } from "@/server/services/account";

export const dynamic = "force-dynamic";

/** Deletes the account and everything attached to it. */
export async function DELETE() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  await deleteAccount(user.id);
  return NextResponse.json({ ok: true });
}
