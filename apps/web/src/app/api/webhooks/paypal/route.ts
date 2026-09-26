import { NextResponse } from "next/server";
import { ServiceError } from "@/server/services/errors";
import { handlePaypalWebhook, type PaypalEvent } from "@/server/services/webhooks";

export const dynamic = "force-dynamic";

/** PayPal tells us about payments here, even if the buyer closed the tab. */
export async function POST(req: Request) {
  try {
    await handlePaypalWebhook(req.headers, (await req.json().catch(() => null)) as PaypalEvent | null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ServiceError) return NextResponse.json({ error: e.code }, { status: e.status });
    throw e;
  }
}
