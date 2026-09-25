import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/server/auth";
import { db, schema } from "@/server/db";

export const dynamic = "force-dynamic";

const MAX_BYTES = 600_000;
const MAX_HANDS = 20;

/** Enough shape-checking that a stored hand always loads; the engine does the rest. */
const Hand = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,40}$/),
  name: z.string().trim().min(1).max(40),
  data: z.object({
    version: z.literal(1),
    upem: z.number().positive(),
    xHeight: z.number(),
    capHeight: z.number(),
    ascender: z.number(),
    descender: z.number(),
    space: z.number(),
    glyphs: z.array(z.object({ char: z.string().min(1).max(2), advance: z.number(), variants: z.array(z.array(z.array(z.number()))).max(4) })).max(250),
  }),
});

/** The signed-in person's own handwritings. */
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const rows = await db.select().from(schema.customHands).where(eq(schema.customHands.userId, user.id));
  return NextResponse.json(rows.map((r) => ({ id: r.id, name: r.name, createdAt: r.createdAt.toISOString(), data: r.data })));
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const raw = await req.text();
  if (raw.length > MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });
  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    // Not JSON: rejected below.
  }
  const parsed = Hand.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const existing = await db.select({ id: schema.customHands.id }).from(schema.customHands).where(eq(schema.customHands.userId, user.id));
  if (existing.length >= MAX_HANDS && !existing.some((h) => h.id === parsed.data.id)) return NextResponse.json({ error: "too_many" }, { status: 409 });
  const { id, name, data } = parsed.data;
  await db
    .insert(schema.customHands)
    .values({ id, userId: user.id, name, data })
    .onConflictDoUpdate({ target: [schema.customHands.userId, schema.customHands.id], set: { name, data, updatedAt: new Date() } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  await db.delete(schema.customHands).where(and(eq(schema.customHands.userId, user.id), eq(schema.customHands.id, id)));
  return NextResponse.json({ ok: true });
}
