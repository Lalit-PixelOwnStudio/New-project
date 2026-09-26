import shots from "./images.json";
import type { GuideBlock } from "./types";

/** Building blocks for writing a guide. */
export const p = (text: string): GuideBlock => ({ kind: "p", text });
export const list = (...items: string[]): GuideBlock => ({ kind: "list", items });
export const note = (text: string): GuideBlock => ({ kind: "note", text });
export const steps = (...items: string[]): GuideBlock => ({ kind: "steps", items });

type Shot = keyof typeof shots;
/** A screenshot from public/guides, made by scripts/guide-shots.ts. */
export const shot = (name: Shot, alt: string, caption?: string, narrow = name.startsWith("phone-")): GuideBlock => ({
  kind: "image",
  image: { src: `/guides/${name}.webp`, ...shots[name], alt, caption, narrow },
});
/** A finished page, rendered by the engine at build time. */
export const sample = (name: string, alt: string, caption?: string): GuideBlock => ({
  kind: "image",
  image: { src: `/specimens/${name}.webp`, width: 1111, height: 1572, alt, caption, narrow: true },
});

export const UPDATED = "2026-09-25";
