import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { countryFromHeaders } from "@/lib/pricing";
import { currentUser } from "@/server/auth";
import { CheckoutError, startCheckout } from "@/server/commerce";

export const dynamic = "force-dynamic";

const Body = z.object({
  product: z.enum(["pass_week", "pass_month", "pass_year", "pages_100", "style"]),
  styleId: z.string().max(40).nullish(),
});

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    const start = await startCheckout({
      userId: user.id,
      email: user.email,
      product: parsed.data.product,
      styleId: parsed.data.styleId,
      country: countryFromHeaders(await headers()),
    });
    return NextResponse.json({
      ...start,
      razorpayKey: start.provider === "razorpay" ? (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID) : undefined,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("checkout failed", e);
    return NextResponse.json({ error: "Payments are unavailable right now. Please try again shortly." }, { status: 503 });
  }
}
