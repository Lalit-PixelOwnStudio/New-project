import { describe, expect, it } from "vitest";
import { captureTemplate } from "@/myhand/capture";
import { CELLS } from "@/myhand/template";
import { fakeTemplatePhoto as photo, PHOTO } from "./fixtures/fake-photo";

const contours = (hand: ReturnType<typeof captureTemplate>["hand"], ch: string) => hand.glyphs.find((g) => g.char === ch)!.variants[0]!.length;

// Building each synthetic photo pixel by pixel takes a few seconds.
describe("reading a filled-in template", { timeout: 60_000 }, () => {
  it("finds every character in a tilted, unevenly lit photo", () => {
    const img = photo();
    const started = performance.now();
    const { hand, found, missing } = captureTemplate(img, PHOTO.width, PHOTO.height);
    if (process.env.MEASURE) console.log(`capture ${Math.round(performance.now() - started)} ms, ${Math.round(JSON.stringify(hand).length / 1024)} KB`);
    expect(missing).toEqual([]);
    expect(found.length).toBe(new Set(CELLS).size);
    expect(hand.glyphs.length).toBe(CELLS.length);
    // Holes stay holes, dots stay separate, single strokes stay single.
    expect(contours(hand, "o")).toBe(2);
    expect(contours(hand, "i")).toBe(2);
    expect(contours(hand, "l")).toBe(1);
    expect(contours(hand, "8")).toBe(3);
    expect(hand.capHeight).toBeGreaterThan(550);
    expect(hand.capHeight).toBeLessThan(1000);
    // Descenders go below the baseline.
    const g = hand.glyphs.find((x) => x.char === "g")!.variants[0]!.flat();
    expect(Math.min(...g.filter((_, i) => i % 2 === 1))).toBeLessThan(-150);
  });

  it("reads a photo taken upside down the same way", () => {
    const { hand, missing } = captureTemplate(photo(true), PHOTO.width, PHOTO.height);
    expect(missing).toEqual([]);
    expect(contours(hand, "o")).toBe(2);
    expect(contours(hand, "l")).toBe(1);
    const g = hand.glyphs.find((x) => x.char === "g")!.variants[0]!.flat();
    expect(Math.min(...g.filter((_, i) => i % 2 === 1))).toBeLessThan(-150);
  });

  it("explains when there's no template in the photo", () => {
    const blank = new Uint8ClampedArray(800 * 600 * 4).fill(200);
    expect(() => captureTemplate(blank, 800, 600)).toThrow(/four black squares/);
  });
});
