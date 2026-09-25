import type { Contour, Outline } from "../path/outline";
import type { GlyphSource, ShapedGlyph } from "../types";

/**
 * Someone's own handwriting, captured from a filled-in template or drawn on
 * screen: one or more drawings per character, as polygons in font units with
 * y pointing up and the baseline at 0. Plain JSON, so it can be saved anywhere.
 */
export interface CapturedHand {
  version: 1;
  upem: number;
  xHeight: number;
  capHeight: number;
  ascender: number;
  descender: number;
  /** Width of a space, in font units. */
  space: number;
  glyphs: CapturedGlyph[];
}

export interface CapturedGlyph {
  char: string;
  /** Advance width in font units, including side bearings. */
  advance: number;
  /** Each drawing is a list of closed contours of packed x,y pairs. */
  variants: number[][][];
}

const SPACE = 1;

/**
 * A glyph source for a captured hand. There is no shaping to do: every
 * character maps to its own drawings, and characters the hand lacks are left
 * to the next source in the style (see words.ts).
 */
export class CapturedSource implements GlyphSource {
  readonly upem: number;
  readonly xHeight: number;
  readonly capHeight: number;
  readonly ascender: number;
  readonly descender: number;

  private readonly glyphOf = new Map<number, number>();
  // Glyph 0 is "missing", glyph 1 the space.
  private readonly advances: number[] = [0];
  private readonly drawings: Outline[][] = [[[]]];

  constructor(
    readonly id: string,
    data: CapturedHand,
  ) {
    if (data.version !== 1) throw new Error(`Unsupported handwriting data (version ${String(data.version)})`);
    this.upem = data.upem;
    this.xHeight = data.xHeight;
    this.capHeight = data.capHeight;
    this.ascender = data.ascender;
    this.descender = data.descender;

    this.advances.push(data.space);
    this.drawings.push([[]]);
    this.glyphOf.set(0x20, SPACE);
    this.glyphOf.set(0xa0, SPACE);

    for (const g of data.glyphs) {
      const cp = g.char.codePointAt(0);
      const drawings = g.variants.filter((v) => v.length > 0).map((v) => v.map((c): Contour => Float32Array.from(c)));
      if (cp === undefined || !drawings.length || !Number.isFinite(g.advance)) continue;
      const existing = this.glyphOf.get(cp);
      if (existing !== undefined && existing !== SPACE) {
        this.drawings[existing]!.push(...drawings);
        continue;
      }
      this.glyphOf.set(cp, this.advances.length);
      this.advances.push(g.advance);
      this.drawings.push(drawings);
    }

    // A letter drawn in only one case writes the other case too, so words stay in
    // the person's hand (all capitals, say) instead of mixing in the fallback font.
    for (let upper = 0x41; upper <= 0x5a; upper++) {
      const lower = upper + 0x20;
      const u = this.glyphOf.get(upper);
      const l = this.glyphOf.get(lower);
      if (u === undefined && l !== undefined) this.glyphOf.set(upper, l);
      if (l === undefined && u !== undefined) this.glyphOf.set(lower, u);
    }
  }

  covers(codePoint: number): boolean {
    return this.glyphOf.has(codePoint);
  }

  shape(text: string): ShapedGlyph[] {
    const out: ShapedGlyph[] = [];
    for (let i = 0; i < text.length;) {
      const cp = text.codePointAt(i)!;
      const glyph = this.glyphOf.get(cp) ?? 0;
      out.push({ glyph, cluster: i, advance: this.advances[glyph] ?? 0, dx: 0, dy: 0 });
      i += cp > 0xffff ? 2 : 1;
    }
    return out;
  }

  variants(glyph: number): number {
    return Math.max(1, this.drawings[glyph]?.length ?? 1);
  }

  outline(glyph: number, variant: number): Outline {
    const d = this.drawings[glyph];
    return d?.length ? d[variant % d.length]! : [];
  }
}

export function createCapturedSource(id: string, data: CapturedHand): CapturedSource {
  return new CapturedSource(id, data);
}
