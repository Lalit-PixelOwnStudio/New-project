import "server-only";
import { z } from "zod";
import { deleteHand, handIdsFor, handsFor, upsertHand } from "../repositories/hands";
import { ServiceError } from "./errors";

/** The largest hand we store, as JSON. A full template is about 90 KB. */
export const MAX_HAND_BYTES = 600_000;
/** How many handwritings one account can keep. */
export const MAX_HANDS = 20;

/** Enough shape-checking that a stored hand always loads; the engine does the rest. */
export const HandInput = z.object({
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
export type Hand = z.infer<typeof HandInput>;

/** A person's handwritings, as the browser stores them. */
export async function listHands(userId: string) {
  const rows = await handsFor(userId);
  return rows.map((r) => ({ id: r.id, name: r.name, createdAt: r.createdAt.toISOString(), data: r.data }));
}

/** Saves or replaces a handwriting, up to MAX_HANDS per account. */
export async function saveHand(userId: string, hand: Hand) {
  const ids = await handIdsFor(userId);
  if (ids.length >= MAX_HANDS && !ids.includes(hand.id)) throw new ServiceError("too_many", 409, "too_many");
  await upsertHand(userId, hand);
}

export const removeHand = (userId: string, id: string) => deleteHand(userId, id);
