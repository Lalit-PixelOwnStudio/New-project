import "server-only";
import { z } from "zod";
import { upsertWaitlistEntry } from "../repositories/waitlist";

/** The business waitlist form. */
export const WaitlistInput = z.object({
  email: z.string().email().max(200),
  company: z.string().max(200).optional(),
  useCase: z.string().max(1000).optional(),
  volume: z.string().max(40).optional(),
});

export async function joinWaitlist(input: z.infer<typeof WaitlistInput>) {
  const { email, ...details } = input;
  await upsertWaitlistEntry(email.toLowerCase(), details);
}
