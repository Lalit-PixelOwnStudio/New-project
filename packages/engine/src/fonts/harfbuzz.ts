import type * as HB from "harfbuzzjs";
import { flatten, type Outline } from "../path/outline";
import type { GlyphSource, ShapedGlyph } from "../types";

export type HarfBuzz = typeof HB;

let hbPromise: Promise<HarfBuzz> | null = null;

/**
 * Loads the HarfBuzz WebAssembly module once per realm. The module resolves its
 * own .wasm file relative to itself, which bundlers understand.
 */
export function loadHarfBuzz(): Promise<HarfBuzz> {
  hbPromise ??= import("harfbuzzjs");
  return hbPromise;
}

const SHAPE_CACHE_LIMIT = 20_000;

/** An OpenType font shaped by HarfBuzz. Handles any script HarfBuzz supports. */
export class HarfBuzzSource implements GlyphSource {
  readonly upem: number;
  readonly xHeight: number;
  readonly capHeight: number;
  readonly ascender: number;
  readonly descender: number;

  private readonly font: HB.Font;
  private readonly buffer: HB.Buffer;
  private readonly coverage: Set<number>;
  private readonly shapes = new Map<string, ShapedGlyph[]>();
  private readonly outlines = new Map<number, Outline>();

  constructor(
    private readonly hb: HarfBuzz,
    readonly id: string,
    data: ArrayBuffer | Uint8Array,
  ) {
    const face = new hb.Face(new hb.Blob(data instanceof Uint8Array ? data : new Uint8Array(data)));
    this.font = new hb.Font(face);
    this.buffer = new hb.Buffer();
    this.upem = face.upem;
    this.coverage = new Set(face.collectUnicodes());
    const ext = this.font.hExtents();
    this.ascender = ext.ascender;
    this.descender = ext.descender;
    // Handwriting fonts often have one odd letter, so take the median height of
    // several flat-topped letters instead of trusting "x" or the OS/2 table.
    this.xHeight =
      this.medianTop("acemnorsuvwxz") ??
      this.font.getMetricPosition(hb.MetricsTag.X_HEIGHT) ??
      this.upem * 0.48;
    this.capHeight =
      this.medianTop("EFHILTZ") ??
      this.font.getMetricPosition(hb.MetricsTag.CAP_HEIGHT) ??
      this.upem * 0.7;
  }

  private medianTop(chars: string): number | undefined {
    const tops: number[] = [];
    for (const ch of chars) {
      const gid = this.font.nominalGlyph(ch.codePointAt(0)!);
      if (!gid) continue;
      const ext = this.font.glyphExtents(gid);
      if (ext && ext.yBearing > 0) tops.push(ext.yBearing);
    }
    if (tops.length < 3) return undefined;
    tops.sort((a, b) => a - b);
    return tops[tops.length >> 1];
  }

  covers(codePoint: number): boolean {
    return this.coverage.has(codePoint);
  }

  shape(text: string): ShapedGlyph[] {
    const cached = this.shapes.get(text);
    if (cached) return cached;
    const buf = this.buffer;
    buf.reset();
    buf.addText(text);
    buf.guessSegmentProperties();
    this.hb.shape(this.font, buf);
    const out: ShapedGlyph[] = buf.getGlyphInfosAndPositions().map((g) => ({
      glyph: g.codepoint,
      cluster: g.cluster,
      advance: g.xAdvance ?? 0,
      dx: g.xOffset ?? 0,
      dy: g.yOffset ?? 0,
    }));
    if (this.shapes.size > SHAPE_CACHE_LIMIT) this.shapes.clear();
    this.shapes.set(text, out);
    return out;
  }

  variants(): number {
    return 1;
  }

  outline(glyph: number): Outline {
    let o = this.outlines.get(glyph);
    if (!o) {
      o = flatten(this.font.glyphToJson(glyph), this.upem / 900);
      this.outlines.set(glyph, o);
    }
    return o;
  }
}

export async function createFontSource(id: string, data: ArrayBuffer | Uint8Array): Promise<HarfBuzzSource> {
  const hb = await loadHarfBuzz();
  return new HarfBuzzSource(hb, id, data);
}
