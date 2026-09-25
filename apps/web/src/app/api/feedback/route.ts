import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { countryFromHeaders } from "@/lib/pricing";
import { currentUser } from "@/server/auth";
import { getEntitlements } from "@/server/entitlements";
import { DAILY_LIMIT, FeedbackBody, feedbackToday, saveFeedback } from "@/server/feedback";

export const dynamic = "force-dynamic";

/** Stores a rating, with an optional comment and email. No account needed. */
export async function POST(req: Request) {
  const parsed = FeedbackBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const user = await currentUser();
  const anonId = (await cookies()).get("th_anon")?.value ?? null;
  const who = { userId: user?.id ?? null, anonId: user ? null : anonId };
  if ((await feedbackToday(who)) >= DAILY_LIMIT) return NextResponse.json({ error: "too_many" }, { status: 429 });

  const ent = await getEntitlements(user?.id);
  await saveFeedback(parsed.data, who, { plan: ent.plan, country: countryFromHeaders(await headers()) });
  return NextResponse.json({ ok: true });
}
