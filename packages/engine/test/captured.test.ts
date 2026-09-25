import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createCapturedSource, createFontSource, layoutDocument, type CapturedHand, type DocumentSpec } from "../src/index";

// A tiny hand: "a" drawn twice (a square with a square hole), "b" once.
const square = (x0: number, y0: number, s: number, clockwise = false) =>
  clockwise ? [x0, y0, x0, y0 + s, x0 + s, y0 + s, x0 + s, y0] : [x0, y0, x0 + s, y0, x0 + s, y0 + s, x0, y0 + s];
const hand: CapturedHand = {
  version: 1,
  upem: 1000,
  xHeight: 500,
  capHeight: 700,
  ascender: 800,
  descender: -250,
  space: 300,
  glyphs: [
    { char: "a", advance: 560, variants: [[square(30, 0, 500), square(150, 120, 260, true)]] },
    { char: "b", advance: 520, variants: [[square(30, 0, 460)]] },
    { char: "a", advance: 560, variants: [[square(40, 0, 480)]] },
    { char: "c", advance: 400, variants: [] },
  ],
};

describe("captured hands", () => {
  it("maps characters to their drawings and merges repeats into variants", () => {
    const src = createCapturedSource("mine", hand);
    expect(src.covers("a".codePointAt(0)!)).toBe(true);
    expect(src.covers(" ".codePointAt(0)!)).toBe(true);
    // A character with no drawings isn't covered, so the next source draws it.
    expect(src.covers("c".codePointAt(0)!)).toBe(false);
    const shaped = src.shape("ab a");
    expect(shaped.map((g) => g.advance)).toEqual([560, 520, 300, 560]);
    expect(shaped.map((g) => g.cluster)).toEqual([0, 1, 2, 3]);
    const a = shaped[0]!.glyph;
    expect(src.variants(a)).toBe(2);
    expect(src.outline(a, 0)).toHaveLength(2);
    expect(src.outline(a, 3)).toHaveLength(1);
    expect(src.shape("z")[0]!.glyph).toBe(0);
  });

  it("rejects data it doesn't understand", () => {
    expect(() => createCapturedSource("x", { ...hand, version: 2 as 1 })).toThrow(/version/);
  });

  it("lays out a page, borrowing missing characters from a fallback font", async () => {
    const fallback = await createFontSource("caveat", readFileSync(join(import.meta.dirname, "../../../assets/fonts/caveat/Caveat[wght].ttf")));
    const style = {
      id: "mine",
      sources: [createCapturedSource("mine", hand), fallback],
      connected: false,
      sizeAdjust: 1,
      slant: 0,
      weight: 1,
      tracking: 0,
      wordSpace: 1,
      baselineShift: 0,
    };
    const doc: DocumentSpec = {
      text: "ab ba xyz",
      paper: {
        size: "a4",
        ruling: "ruled",
        spacingMm: 7.1,
        paperColor: "#fff",
        lineColor: "#9bd",
        marginLine: null,
        texture: "smooth",
        holes: "none",
        margins: { topMm: 30, bottomMm: 12, leftMm: 12, rightMm: 10 },
      },
      pen: { kind: "ballpoint", color: "#123", width: 0.3 },
      realism: { seed: 3, messiness: 0.5, slant: 0, fatigue: 0 },
      layout: { size: 1, letterSpacing: 0, wordSpacing: 1, indentMm: 0, paragraphGap: 0, underlineHeadings: false },
    };
    const layout = layoutDocument(doc, style);
    expect(layout.stats.words).toBe(3);
    expect(layout.stats.missing).toEqual([]);
    expect(layout.pages[0]!.ink.length).toBe(3);
  });
});
