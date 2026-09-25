import { PAPERS, STYLES } from "@truehand/catalog";
import { USE_CASES } from "@/content/use-cases";
import type { DocumentSpec } from "@truehand/engine";
import { DEFAULT_SETTINGS, SAMPLE_TEXT, toDocumentSpec, type EditorSettings } from "./settings";

/**
 * Images rendered by the engine at build time. They are the LCP image on the
 * home page and the preview on every style and paper page, so they must look
 * exactly like what the editor produces.
 */
export interface SpecimenJob {
  name: string;
  style: string;
  doc: DocumentSpec;
  scale: number;
  /** Crop in CSS px: x, y, width, height. */
  crop: [number, number, number, number];
  effect?: "none" | "scan" | "photo";
  /** Writing only, on a transparent background. */
  inkOnly?: boolean;
}

const A4_W = 793.7;
const A4_H = 1122.5;

const spec = (over: Partial<EditorSettings>) => toDocumentSpec({ ...DEFAULT_SETTINGS, ...over });

export const STYLE_SAMPLE = (name: string) =>
  `${name}\nThe quick brown fox jumps over the lazy dog. Notes, letters and lab records, written by hand without the hand cramp.`;

export function specimenJobs(): SpecimenJob[] {
  const jobs: SpecimenJob[] = [
    {
      name: "hero",
      style: DEFAULT_SETTINGS.styleId,
      doc: spec({ text: SAMPLE_TEXT }),
      scale: 1.6,
      crop: [0, 0, A4_W, A4_H],
    },
  ];
  for (const s of STYLES) {
    jobs.push({
      name: `style-${s.id}`,
      style: s.id,
      doc: spec({ text: STYLE_SAMPLE(s.name), styleId: s.id, seed: 11 }),
      scale: 1.5,
      crop: [96, 88, 620, 150],
    });
  }
  // Each style's name written in that style: the style picker's labels.
  for (const s of STYLES) {
    jobs.push({
      name: `name-${s.id}`,
      style: s.id,
      doc: spec({ text: s.name, styleId: s.id, paperId: "plain", fontSize: 1.7, messiness: 0.25, seed: 4, penId: "ballpoint-black", underlineHeadings: false }),
      scale: 2,
      crop: [66, 40, 250, 62],
      inkOnly: true,
    });
  }
  // "Is it a font?" comparison: the same line three times, without and with Truehand.
  const repeat = Array.from({ length: 3 }, () => "Handwriting never repeats itself exactly.").join("\n");
  for (const [name, off] of [
    ["compare-font", true],
    ["compare-hand", false],
  ] as const) {
    const doc = spec({ text: repeat, seed: 21, messiness: 0.4 });
    jobs.push({
      name,
      style: DEFAULT_SETTINGS.styleId,
      doc: { ...doc, realism: { ...doc.realism, off } },
      scale: 1.6,
      crop: [96, 88, 450, 110],
    });
  }
  for (const u of USE_CASES) {
    jobs.push({
      name: `use-${u.slug}`,
      style: u.settings.styleId ?? DEFAULT_SETTINGS.styleId,
      doc: spec({ ...u.settings, holes: "none" }),
      scale: 1,
      crop: [0, 0, A4_W, A4_H * 0.55],
    });
    jobs.push({
      name: `use-${u.slug}-page`,
      style: u.settings.styleId ?? DEFAULT_SETTINGS.styleId,
      doc: spec({ ...u.settings }),
      scale: 1.4,
      crop: [0, 0, A4_W, A4_H],
    });
  }
  for (const p of PAPERS) {
    jobs.push({
      name: `paper-${p.id}`,
      style: DEFAULT_SETTINGS.styleId,
      doc: spec({ text: `${p.name}\n${p.blurb}`, paperId: p.id, seed: 5 }),
      scale: 1,
      crop: [0, 0, A4_W, A4_H * 0.42],
    });
  }
  return jobs;
}
