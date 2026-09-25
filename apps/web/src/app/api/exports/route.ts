import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/server/auth";
import { getEntitlements } from "@/server/entitlements";
import { decide, pagesUsedToday, QuotaError, recordExport } from "@/server/quota";

export const dynamic = "force-dynamic";

const Body = z.object({
  pages: z.number().int().min(1).max(500),
  dpi: z.number().int().min(72).max(600),
  pro: z.array(z.string().max(64)).max(20),
});

const ANON = "th_anon";

/** Reserves pages for an export before the browser renders it. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const jar = await cookies();
  let anonId = jar.get(ANON)?.value ?? null;
  const user = await currentUser();
  if (!user && !anonId) {
    anonId = crypto.randomUUID();
    jar.set(ANON, anonId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
  }
  const who = { userId: user?.id ?? null, anonId };
  const ent = await getEntitlements(user?.id);
  try {
    const grant = decide(parsed.data, ent, await pagesUsedToday(who));
    await recordExport(who, grant, parsed.data.dpi);
    return NextResponse.json(grant);
  } catch (e) {
    if (e instanceof QuotaError) return NextResponse.json({ error: e.code, message: e.message }, { status: e.code === "bad_request" ? 400 : 402 });
    throw e;
  }
}
