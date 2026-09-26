import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/server/auth";
import { CheckoutError, confirmPaypalPayment } from "@/server/services/checkout";

export const dynamic = "force-dynamic";

const Body = z.object({ paypalOrderId: z.string().max(64) });

/** Called by the browser after the buyer approves in PayPal; captures the payment server-side. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    const order = await confirmPaypalPayment(parsed.data.paypalOrderId);
    return NextResponse.json({ ok: true, product: order.product });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("paypal capture failed", e);
    return NextResponse.json({ error: "Couldn't confirm the payment. If you were charged, it will be applied automatically within minutes." }, { status: 502 });
  }
}
