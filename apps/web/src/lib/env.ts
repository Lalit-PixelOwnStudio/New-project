/**
 * Hosting dashboards often save a variable with an empty value; treat that the
 * same as not setting it. Pass `process.env.NAME` literally so Next.js can
 * still inline NEXT_PUBLIC_ values into browser code.
 */
export function present(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

/** The origin of a URL or a bare domain ("truehand.app"), or undefined if it isn't one. */
export function toOrigin(value: string | undefined): string | undefined {
  const v = present(value);
  if (!v) return undefined;
  try {
    return new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).origin;
  } catch {
    return undefined;
  }
}
