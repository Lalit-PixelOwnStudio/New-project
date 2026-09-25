import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/server/db";

export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email().max(200),
  company: z.string().max(200).optional(),
  useCase: z.string().max(1000).optional(),
  volume: z.string().max(40).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  const { email, ...rest } = parsed.data;
  await db
    .insert(schema.waitlist)
    .values({ email: email.toLowerCase(), ...rest })
    .onConflictDoUpdate({ target: schema.waitlist.email, set: rest });
  return NextResponse.json({ ok: true });
}
