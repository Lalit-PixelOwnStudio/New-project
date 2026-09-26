import { NextResponse } from "next/server";
import { joinWaitlist, WaitlistInput } from "@/server/services/waitlist";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const parsed = WaitlistInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  await joinWaitlist(parsed.data);
  return NextResponse.json({ ok: true });
}
