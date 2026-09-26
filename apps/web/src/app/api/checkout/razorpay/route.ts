import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { CheckoutError, confirmRazorpayPayment, RazorpayConfirmation } from "@/server/services/checkout";

export const dynamic = "force-dynamic";

/** Called by the browser after Razorpay Checkout succeeds. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const parsed = RazorpayConfirmation.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    const order = await confirmRazorpayPayment(parsed.data);
    return NextResponse.json({ ok: true, product: order.product });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
