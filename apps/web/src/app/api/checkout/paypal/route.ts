import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/server/auth";
import { CheckoutError, fulfilOrder } from "@/server/commerce";
import { capturePaypalOrder } from "@/server/payments/paypal";

export const dynamic = "force-dynamic";

const Body = z.object({ paypalOrderId: z.string().max(64) });

/** Called by the browser after the buyer approves in PayPal; captures the payment server-side. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    const capture = await capturePaypalOrder(parsed.data.paypalOrderId);
    const c = capture.purchase_units[0]?.payments?.captures?.[0];
    if (capture.status !== "COMPLETED" || !c || c.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment was not completed" }, { status: 402 });
    }
    const { order } = await fulfilOrder("paypal", parsed.data.paypalOrderId, c.id, {
      amount: Math.round(Number(c.amount.value) * 100),
      currency: c.amount.currency_code,
    });
    return NextResponse.json({ ok: true, product: order.product });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("paypal capture failed", e);
    return NextResponse.json({ error: "Couldn't confirm the payment. If you were charged, it will be applied automatically within minutes." }, { status: 502 });
  }
}
