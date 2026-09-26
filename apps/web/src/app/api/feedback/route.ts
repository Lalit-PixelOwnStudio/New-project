import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { countryFromHeaders } from "@/lib/pricing";
import { currentUser } from "@/server/auth";
import { ServiceError } from "@/server/services/errors";
import { FeedbackInput, submitFeedback } from "@/server/services/feedback";

export const dynamic = "force-dynamic";

/** Stores a rating, with an optional comment and email. No account needed. */
export async function POST(req: Request) {
  const parsed = FeedbackInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const user = await currentUser();
  const anonId = (await cookies()).get("th_anon")?.value ?? null;
  try {
    await submitFeedback(parsed.data, { userId: user?.id ?? null, anonId: user ? null : anonId }, countryFromHeaders(await headers()));
  } catch (e) {
    if (e instanceof ServiceError) return NextResponse.json({ error: e.code }, { status: e.status });
    throw e;
  }
  return NextResponse.json({ ok: true });
}
