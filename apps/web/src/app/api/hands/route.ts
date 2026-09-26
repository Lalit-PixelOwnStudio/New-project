import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { ServiceError } from "@/server/services/errors";
import { HandInput, listHands, MAX_HAND_BYTES, removeHand, saveHand } from "@/server/services/hands";

export const dynamic = "force-dynamic";

/** The signed-in person's own handwritings. */
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  return NextResponse.json(await listHands(user.id));
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const raw = await req.text();
  if (raw.length > MAX_HAND_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });
  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    // Not JSON: rejected below.
  }
  const parsed = HandInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    await saveHand(user.id, parsed.data);
  } catch (e) {
    if (e instanceof ServiceError) return NextResponse.json({ error: e.code }, { status: e.status });
    throw e;
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  await removeHand(user.id, new URL(req.url).searchParams.get("id") ?? "");
  return NextResponse.json({ ok: true });
}
