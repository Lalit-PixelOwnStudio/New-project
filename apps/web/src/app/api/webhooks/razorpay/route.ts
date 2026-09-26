import { NextResponse } from "next/server";
import { ServiceError } from "@/server/services/errors";
import { handleRazorpayWebhook } from "@/server/services/webhooks";

export const dynamic = "force-dynamic";

/** Razorpay tells us about payments here, even if the buyer closed the tab. */
export async function POST(req: Request) {
  try {
    await handleRazorpayWebhook(await req.text(), req.headers.get("x-razorpay-signature") ?? "", req.headers.get("x-razorpay-event-id"));
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ServiceError) return NextResponse.json({ error: e.code }, { status: e.status });
    throw e;
  }
}
