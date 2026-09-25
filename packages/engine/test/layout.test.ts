import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { createFontSource, layoutDocument, paperGeometry, type DocumentSpec, type HandStyle, type InkFill } from "../src/index";

const FONT = join(import.meta.dirname, "../../../assets/fonts/caveat/Caveat[wght].ttf");

let style: HandStyle;
beforeAll(async () => {
  style = {
    id: "caveat",
    sources: [await createFontSource("caveat", readFileSync(FONT))],
    connected: false,
    sizeAdjust: 1,
    slant: 0,
    weight: 1,
    tracking: 0,
    wordSpace: 1,
    baselineShift: 0,
  };
});

const base = (text: string, seed = 1): DocumentSpec => ({
  text,
  paper: {
    size: "a4",
    ruling: "ruled",
    spacingMm: 7.1,
    paperColor: "#fff",
    lineColor: "#9bd",
    marginLine: { xMm: 31, color: "#e67" },
    texture: "smooth",
    holes: "none",
    margins: { topMm: 30, bottomMm: 12, leftMm: 12, rightMm: 10 },
  },
  pen: { kind: "ballpoint", color: "#123", width: 0.3 },
  realism: { seed, messiness: 0.5, slant: 0, fatigue: 0 },
  layout: { size: 1, letterSpacing: 0, wordSpacing: 1, indentMm: 0, paragraphGap: 0, underlineHeadings: false },
});

const fills = (d: DocumentSpec) => layoutDocument(d, style).pages.flatMap((p) => p.ink.filter((i): i is InkFill => i.kind === "fill"));

/** Glyph shapes relative to each word's first point: position-independent. */
function shapes(items: InkFill[]) {
  return items.map((f) => {
    const c = f.contours[0]!;
    return Array.from(f.contours[f.contours.length - 1]!.slice(0, 6)).map((v, i) => Math.round((v - c[i % 2]!) * 100));
  });
}

describe("paperGeometry", () => {
  it("puts writing lines on ruled lines inside the margins", () => {
    const g = paperGeometry(base("").paper);
    expect(g.baselines.length).toBeGreaterThan(30);
    expect(g.baselines[1]! - g.baselines[0]!).toBeCloseTo(7.1 * (96 / 25.4), 3);
    expect(g.textLeft).toBeGreaterThan(g.marginX!);
    expect(g.baselines.at(-1)!).toBeLessThan(g.heightPx);
  });
});

describe("layoutDocument", () => {
  it("is deterministic for the same seed", () => {
    const a = fills(base("Hello there, general reader."));
    const b = fills(base("Hello there, general reader."));
    expect(a.map((f) => Array.from(f.contours[0]!))).toEqual(b.map((f) => Array.from(f.contours[0]!)));
  });

  it("changes with the seed", () => {
    const a = fills(base("Hello there", 1));
    const b = fills(base("Hello there", 2));
    expect(Array.from(a[0]!.contours[0]!)).not.toEqual(Array.from(b[0]!.contours[0]!));
  });

  it("keeps other paragraphs' letterforms stable when one is edited", () => {
    const before = fills(base("First paragraph stays put.\nMiddle text.\nLast one too."));
    const after = fills(base("First paragraph stays put.\nMiddle text with several new words added.\nLast one too."));
    const first = shapes(before.slice(0, 4));
    expect(shapes(after.slice(0, 4))).toEqual(first);
    expect(shapes(after.slice(-3))).toEqual(shapes(before.slice(-3)));
  });

  it("flows long text onto more pages", () => {
    const long = Array.from({ length: 60 }, (_, i) => `Line ${i} of a fairly long piece of writing that wraps.`).join("\n");
    const layout = layoutDocument(base(long), style);
    expect(layout.stats.pages).toBeGreaterThan(1);
    for (const page of layout.pages) {
      for (const item of page.ink) {
        if (item.kind !== "fill") continue;
        for (const c of item.contours) {
          for (let i = 1; i < c.length; i += 2) expect(c[i]!).toBeLessThan(page.geometry.heightPx);
        }
      }
    }
  });

  it("starts a new page at ---", () => {
    expect(layoutDocument(base("one\n---\ntwo"), style).stats.pages).toBe(2);
    expect(layoutDocument(base("one\n---\n"), style).stats.pages).toBe(1);
  });

  it("substitutes characters the font lacks and reports truly missing ones", () => {
    const layout = layoutDocument(base("a → b ✓"), style);
    expect(layout.stats.missing).toEqual(["✓".codePointAt(0)]);
  });
});
