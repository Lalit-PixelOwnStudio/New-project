import { compose, rotate, scale, skewX, translate, type Matrix } from "../math/matrix";
import { noise1, noise2 } from "../math/noise";
import { gaussian, hash, rand } from "../math/random";
import type { Mark } from "../text/markup";
import type { Highlight, InkFill, InkLine } from "../types";
import type { Word } from "./words";

/** Realism amounts for one page, already combined from messiness and fine controls. */
export interface Amounts {
  size: number;
  baseline: number;
  slope: number;
  spacing: number;
  shape: number;
  ink: number;
  /** Rotation and offset of individual letters. */
  letter: number;
}

export interface LineFrame {
  /** Deterministic key of the line on its page. */
  key: number;
  baseline: number;
  /** Line tilt in radians, applied relative to the start of the line. */
  slope: number;
  startX: number;
  /** Baseline wobble amplitude in px and its wavelength. */
  wobble: number;
  wavelength: number;
  /** Fatigue multiplier for everything on this line. */
  fatigue: number;
}

export interface PlaceContext {
  xHeight: number;
  amounts: Amounts;
  connected: boolean;
  /** Natural slant in degrees (style + user). */
  slant: number;
  penWidth: number;
  highlightColor: string;
}

/** Where a word ended up, used to draw marks that continue across words. */
export interface PlacedSpan {
  mark: Mark;
  x0: number;
  x1: number;
}

const DEG = Math.PI / 180;

/** y of the line's baseline at page x, including tilt and wobble. */
export function baselineAt(line: LineFrame, x: number): number {
  return (
    line.baseline +
    (x - line.startX) * Math.tan(line.slope) +
    line.wobble * noise1(line.key, x / line.wavelength)
  );
}

/**
 * Turns a word into inked outlines on the page.
 *
 * Order of operations for every outline point:
 *   glyph space → letter jitter → word size & slant → smooth warp → word
 *   rotation → page position → baseline wobble.
 * The warp field lives in word space, so a word keeps its exact shape when a
 * reflow moves it, and joins in cursive words stay connected.
 */
export function placeWord(
  word: Word,
  x: number,
  line: LineFrame,
  ctx: PlaceContext,
): { fill: InkFill; spans: PlacedSpan[]; bold: boolean } {
  const { amounts: a, xHeight: xh } = ctx;
  const k = word.key;
  const f = line.fatigue;

  const wordRot = gaussian(k, 20) * 0.01 * a.letter * f;
  const wordDy = gaussian(k, 21) * 0.045 * xh * a.baseline * f;
  const slant = (ctx.slant + gaussian(k, 22) * 1.3 * a.letter * f) * DEG;
  const warpAmp = xh * (0.018 + 0.05 * a.shape * f);
  const warpFreq = 1 / (xh * 1.05);
  const seedX = hash(k, 30);
  const seedY = hash(k, 31);

  const y0 = baselineAt(line, x) + wordDy;
  const toPage: Matrix = compose(rotate(wordRot + line.slope), translate(x, y0));
  const wordSpace: Matrix = skewX(slant);

  const contours: Float32Array[] = [];
  const spans: PlacedSpan[] = [];
  let bold = false;

  for (const g of word.glyphs) {
    if (g.marks.includes("bold")) bold = true;
    let local: Matrix = translate(g.dx, -g.dy);
    if (!ctx.connected && g.advance > 0) {
      const cx = g.advance / 2;
      const cy = -xh / 2;
      local = compose(
        local,
        translate(-cx, -cy),
        rotate(gaussian(k, g.index, 40) * 0.028 * a.letter * f),
        scale(1 + gaussian(k, g.index, 41) * 0.03 * a.size * f),
        translate(cx, cy + gaussian(k, g.index, 42) * 0.035 * xh * a.baseline * f),
      );
    }
    const m = compose(scale(g.unit, -g.unit), local, translate(g.x, 0), wordSpace);
    const variant = Math.floor(rand(k, g.index, 43) * g.source.variants(g.glyph));
    for (const src of g.source.outline(g.glyph, variant)) {
      const out = new Float32Array(src.length);
      for (let i = 0; i < src.length; i += 2) {
        const u = src[i]!;
        const v = src[i + 1]!;
        let wx = m[0] * u + m[2] * v + m[4];
        let wy = m[1] * u + m[3] * v + m[5];
        wx += warpAmp * noise2(seedX, wx * warpFreq, wy * warpFreq);
        wy += warpAmp * noise2(seedY, wx * warpFreq, wy * warpFreq);
        const px = toPage[0] * wx + toPage[2] * wy + toPage[4];
        const py = toPage[1] * wx + toPage[3] * wy + toPage[5];
        out[i] = px;
        out[i + 1] = py + line.wobble * (noise1(line.key, px / line.wavelength) - noise1(line.key, x / line.wavelength));
      }
      contours.push(out);
    }

    for (const mark of g.marks) {
      if (mark === "bold") continue;
      const gx0 = x + g.x;
      const gx1 = gx0 + g.advance;
      const open = spans.find((s) => s.mark === mark && Math.abs(s.x1 - gx0) < xh * 0.6);
      if (open) open.x1 = gx1;
      else spans.push({ mark, x0: gx0, x1: gx1 });
    }
  }

  const ink = inkFor(k, ctx, f, bold);
  return { fill: { kind: "fill", contours, ...ink }, spans, bold };
}

function inkFor(k: number, ctx: PlaceContext, fatigue: number, bold: boolean) {
  const a = ctx.amounts;
  return {
    alpha: Math.min(1, 0.9 + rand(k, 60) * 0.08 + (bold ? 0.04 : 0)),
    tone: gaussian(k, 61) * 0.3 * a.ink,
    weight: Math.max(0, ctx.penWidth * (1 + gaussian(k, 62) * 0.22 * a.ink) * (0.95 + 0.05 * fatigue) + (bold ? 0.75 : 0)),
  };
}

/** A hand-drawn horizontal line (underline or strike-through) from x0 to x1. */
export function drawnLine(
  x0: number,
  x1: number,
  offset: number,
  line: LineFrame,
  ctx: PlaceContext,
  key: number,
): InkLine {
  const a = ctx.amounts;
  const len = Math.max(1, x1 - x0);
  const n = Math.max(2, Math.ceil(len / 6));
  const pts = new Float32Array((n + 1) * 2);
  // People start slightly late, finish slightly early, and drift off level.
  const start = x0 - ctx.xHeight * 0.1 + gaussian(key, 1) * ctx.xHeight * 0.08;
  const end = x1 + ctx.xHeight * 0.05 + gaussian(key, 2) * ctx.xHeight * 0.1;
  const tilt = gaussian(key, 3) * 0.012 * (0.5 + a.letter);
  const bow = gaussian(key, 4) * ctx.xHeight * 0.06 * (0.5 + a.shape);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = start + (end - start) * t;
    const py =
      baselineAt(line, px) +
      offset +
      (px - start) * tilt +
      bow * Math.sin(Math.PI * t) +
      noise1(hash(key, 5), t * len * 0.05) * ctx.xHeight * 0.03 * (0.5 + a.shape);
    pts[i * 2] = px;
    pts[i * 2 + 1] = py;
  }
  const ink = inkFor(key, ctx, line.fatigue, false);
  return { kind: "line", points: pts, width: Math.max(0.9, ctx.xHeight * 0.075) + ctx.penWidth, ...ink };
}

/** A loose highlighter band behind [x0, x1] on a line. */
export function highlightBand(
  x0: number,
  x1: number,
  line: LineFrame,
  ctx: PlaceContext,
  key: number,
): Highlight {
  const xh = ctx.xHeight;
  const top: number[] = [];
  const bottom: number[] = [];
  const n = Math.max(2, Math.ceil((x1 - x0) / 10));
  const pad = xh * 0.25;
  for (let i = 0; i <= n; i++) {
    const px = x0 - pad + ((x1 - x0 + pad * 2) * i) / n;
    const base = baselineAt(line, px);
    top.push(px, base - xh * 1.25 + noise1(hash(key, 1), i * 0.4) * xh * 0.12);
    bottom.push(px, base + xh * 0.3 + noise1(hash(key, 2), i * 0.4) * xh * 0.12);
  }
  const poly: number[] = [...top];
  for (let i = bottom.length - 2; i >= 0; i -= 2) poly.push(bottom[i]!, bottom[i + 1]!);
  return { kind: "highlight", polygon: Float32Array.from(poly), color: ctx.highlightColor };
}
