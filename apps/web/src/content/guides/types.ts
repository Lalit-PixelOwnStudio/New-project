/** The shape of a starter guide and its blocks. */

export interface GuideBlock {
  kind: "p" | "list" | "steps" | "note" | "image";
  text?: string;
  items?: string[];
  image?: { src: string; width: number; height: number; alt: string; caption?: string; narrow?: boolean };
}

/**
 * A starter guide answers one question a student would ask. It opens with a
 * short answer, then shows each step on a screenshot of the real editor, and
 * ends with fixes for what usually goes wrong.
 */
export interface Guide {
  slug: string;
  /** The question, as someone would ask it. */
  title: string;
  description: string;
  /** Two or three sentences that answer the question on their own. */
  answer: string;
  /** Minutes to read, rounded. */
  minutes: number;
  updated: string;
  sections: { heading: string; blocks: GuideBlock[] }[];
  /** Common problems and their fixes. */
  faqs: { q: string; a: string }[];
  related: string[];
  /** Where "try it" goes: usually the editor, already set up for this job. */
  cta: { href: string; label: string };
}
