import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { ExportInput, QuotaError, reserveExport } from "@/server/services/quota";

export const dynamic = "force-dynamic";

const ANON = "th_anon";

/** Reserves pages for an export before the browser renders it. */
export async function POST(req: Request) {
  const parsed = ExportInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  // Visitors without an account are counted by an anonymous cookie.
  const jar = await cookies();
  let anonId = jar.get(ANON)?.value ?? null;
  const user = await currentUser();
  if (!user && !anonId) {
    anonId = crypto.randomUUID();
    jar.set(ANON, anonId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
  }
  try {
    return NextResponse.json(await reserveExport({ userId: user?.id ?? null, anonId }, parsed.data));
  } catch (e) {
    if (e instanceof QuotaError) return NextResponse.json({ error: e.code, message: e.message }, { status: e.status });
    throw e;
  }
}
