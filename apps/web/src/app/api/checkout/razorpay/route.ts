import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/server/auth";
import { CheckoutError, fulfilOrder } from "@/server/commerce";
import { verifyCheckoutSignature } from "@/server/payments/razorpay";

export const dynamic = "force-dynamic";

const Body = z.object({
  razorpay_order_id: z.string().max(64),
  razorpay_payment_id: z.string().max(64),
  razorpay_signature: z.string().max(256),
});

/** Called by the browser after Razorpay Checkout succeeds. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = parsed.data;
  if (!verifyCheckoutSignature(orderId, paymentId, signature)) return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  try {
    const { order } = await fulfilOrder("razorpay", orderId, paymentId);
    return NextResponse.json({ ok: true, product: order.product });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
