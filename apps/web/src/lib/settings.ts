import { DEFAULT_PAPER_ID, DEFAULT_PEN_ID, DEFAULT_STYLE_ID, paperById, penById, styleById, type Tier } from "@truehand/catalog";
import type { DocumentSpec, PaperSize } from "@truehand/engine";

export type Effect = "none" | "scan" | "photo";

/** Everything the editor lets people change. Serialisable; stored locally and in saved documents. */
export interface EditorSettings {
  text: string;
  styleId: string;
  paperId: string;
  penId: string;
  /** Custom ink colour (Pro). Null uses the pen's colour. */
  inkColor: string | null;
  size: PaperSize;
  fontSize: number;
  messiness: number;
  slant: number;
  fatigue: number;
  letterSpacing: number;
  wordSpacing: number;
  seed: number;
  effect: Effect;
  holes: "none" | "two" | "three";
  headerLeft: string;
  headerRight: string;
  pageNumbers: boolean;
  underlineHeadings: boolean;
  paragraphGap: number;
}

export const SAMPLE_TEXT = `# This page was typed.
Not scanned, not traced, and not a font with a shaky filter. Every letter here was __redrawn by Truehand__ a moment ago, with its own slant, its own pressure and its own small wobble off the line.
Change anything and watch it rewrite itself.
- Paste an assignment, a letter or your notes
- Pick a hand, a paper and a pen
- Download pages that ==look written by hand==`;

export const DEFAULT_SETTINGS: EditorSettings = {
  text: SAMPLE_TEXT,
  styleId: DEFAULT_STYLE_ID,
  paperId: DEFAULT_PAPER_ID,
  penId: DEFAULT_PEN_ID,
  inkColor: null,
  size: "a4",
  fontSize: 1,
  messiness: 0.35,
  slant: 0,
  fatigue: 0.4,
  letterSpacing: 0,
  wordSpacing: 1,
  seed: 7,
  effect: "none",
  holes: "none",
  headerLeft: "",
  headerRight: "",
  pageNumbers: false,
  underlineHeadings: true,
  paragraphGap: 0,
};

/** Countries that mostly use US Letter paper. */
const LETTER_COUNTRIES = new Set(["US", "CA", "MX", "PH", "CL", "CO", "VE", "GT", "CR", "PA", "DO", "PR", "SV", "NI", "HN", "BO"]);
export const defaultPaperSize = (country: string | null | undefined): PaperSize => (country && LETTER_COUNTRIES.has(country.toUpperCase()) ? "letter" : "a4");

export function toDocumentSpec(s: EditorSettings): DocumentSpec {
  const paper = paperById(s.paperId) ?? paperById(DEFAULT_PAPER_ID)!;
  const pen = penById(s.penId) ?? penById(DEFAULT_PEN_ID)!;
  const hasHeader = Boolean(s.headerLeft || s.headerRight || s.pageNumbers);
  return {
    text: s.text,
    paper: { ...paper.spec, size: s.size, holes: s.holes },
    pen: { ...pen.spec, color: s.inkColor ?? pen.spec.color },
    realism: { seed: s.seed, messiness: s.messiness, slant: s.slant, fatigue: s.fatigue },
    layout: {
      size: s.fontSize,
      letterSpacing: s.letterSpacing,
      wordSpacing: s.wordSpacing,
      indentMm: 0,
      paragraphGap: s.paragraphGap,
      underlineHeadings: s.underlineHeadings,
    },
    header: hasHeader ? { left: s.headerLeft, right: s.headerRight, pageNumbers: s.pageNumbers } : undefined,
  };
}

/** Pro features a set of settings uses; drives the lock badges and the export check. */
export function proFeaturesUsed(s: EditorSettings): string[] {
  const used: string[] = [];
  const tierOf = (t: Tier | undefined) => t === "pro";
  // Every custom hand ("mine:…") is covered by the same unlock.
  if (s.styleId.startsWith("mine:")) used.push("style:mine");
  else if (tierOf(styleById(s.styleId)?.tier)) used.push(`style:${s.styleId}`);
  if (tierOf(paperById(s.paperId)?.tier)) used.push(`paper:${s.paperId}`);
  if (tierOf(penById(s.penId)?.tier)) used.push(`pen:${s.penId}`);
  if (s.inkColor) used.push("ink-color");
  if (s.effect !== "none") used.push(`effect:${s.effect}`);
  if (s.fatigue > DEFAULT_SETTINGS.fatigue + 1e-9) used.push("fatigue");
  return used;
}
