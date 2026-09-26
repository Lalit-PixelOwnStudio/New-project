import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { countryFromHeaders } from "@/lib/pricing";
import { currentUser } from "@/server/auth";
import { CheckoutError, CheckoutInput, startCheckout } from "@/server/services/checkout";

export const dynamic = "force-dynamic";

/** Starts a purchase: creates the order here and at the payment provider. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const parsed = CheckoutInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    const start = await startCheckout({
      userId: user.id,
      email: user.email,
      product: parsed.data.product,
      country: countryFromHeaders(await headers()),
      currency: parsed.data.currency,
    });
    return NextResponse.json({ ...start, email: user.email, name: user.name });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("checkout failed", e);
    return NextResponse.json({ error: "Payments are unavailable right now. Please try again shortly." }, { status: 503 });
  }
}
