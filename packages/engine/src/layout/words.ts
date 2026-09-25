import { gaussian } from "../math/random";
import type { Mark, Span } from "../text/markup";
import type { GlyphSource, HandStyle } from "../types";

/** A shaped glyph positioned inside its word, in CSS px with y pointing down. */
export interface PlacedGlyph {
  source: GlyphSource;
  glyph: number;
  /** CSS px per font unit for this glyph's source. */
  unit: number;
  /** Pen position relative to the word origin. */
  x: number;
  /** Shaping offsets, CSS px (dy positive = up). */
  dx: number;
  dy: number;
  advance: number;
  marks: Mark[];
  /** Index within the word, used as a random key. */
  index: number;
}

export interface Word {
  text: string;
  key: number;
  glyphs: PlacedGlyph[];
  /** Advance width in CSS px, before word-level transforms. */
  width: number;
  /** Width of the gap that follows the word. */
  space: number;
  /** Marks that should continue across the following space (underline, strike). */
  trailingMarks: Mark[];
}

export interface WordContext {
  style: HandStyle;
  /** Target x-height in CSS px for this block. */
  xHeight: number;
  seed: number;
  letterSpacing: number;
  wordSpacing: number;
  /** Spacing irregularity amount (already scaled by messiness). */
  spacingJitter: number;
  sizeJitter: number;
  missing: Set<number>;
}

interface Piece {
  text: string;
  marks: Mark[];
}

const COMBINING = /\p{M}/u;
const SPACE = /\s/u;

/** Splits spans into words; each word is a list of pieces with uniform marks. */
export function splitWords(spans: Span[]): { pieces: Piece[]; spaces: number; trailingMarks: Mark[] }[] {
  const words: { pieces: Piece[]; spaces: number; trailingMarks: Mark[] }[] = [];
  let current: Piece[] = [];
  const push = (spaces: number, marks: Mark[]) => {
    if (current.length) words.push({ pieces: current, spaces, trailingMarks: marks });
    current = [];
  };
  for (const span of spans) {
    let buf = "";
    for (const ch of span.text) {
      if (SPACE.test(ch)) {
        if (buf) current.push({ text: buf, marks: span.marks });
        buf = "";
        if (current.length) push(1, span.marks);
        else if (words.length) words[words.length - 1]!.spaces++;
      } else {
        buf += ch;
      }
    }
    if (buf) current.push({ text: buf, marks: span.marks });
  }
  push(0, []);
  return words;
}

/** Chooses the first source that can draw a code point. */
function pickSource(sources: GlyphSource[], cp: number): GlyphSource | undefined {
  for (const s of sources) if (s.covers(cp)) return s;
  return undefined;
}

/**
 * How people write characters a hand-lettered font rarely includes. Used only
 * when no glyph source covers the original character.
 */
const SUBSTITUTES: Record<string, string> = {
  "→": "->",
  "←": "<-",
  "⇒": "=>",
  "⇐": "<=",
  "↔": "<->",
  "≤": "<=",
  "≥": ">=",
  "≠": "=/=",
  "≈": "~",
  "×": "x",
  "÷": "/",
  "−": "-",
  "–": "-",
  "—": "-",
  "…": "...",
  "“": '"',
  "”": '"',
  "„": '"',
  "‘": "'",
  "’": "'",
  "‚": ",",
  "•": "-",
  "·": ".",
  "\u00a0": " ",
};

function substitute(text: string, sources: GlyphSource[]): string {
  let out = "";
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    const sub = SUBSTITUTES[ch];
    out += sub !== undefined && !pickSource(sources, cp) ? sub : ch;
  }
  return out;
}

/** Splits a piece into runs that a single glyph source can draw. */
function runs(input: string, sources: GlyphSource[], missing: Set<number>) {
  const text = substitute(input, sources);
  const out: { source: GlyphSource; text: string; offset: number }[] = [];
  let offset = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    const last = out[out.length - 1];
    if (last && COMBINING.test(ch) && last.offset + last.text.length === offset) {
      last.text += ch;
    } else {
      const source = pickSource(sources, cp);
      if (!source) missing.add(cp);
      else if (last && last.source === source && last.offset + last.text.length === offset) last.text += ch;
      else out.push({ source, text: ch, offset });
    }
    offset += ch.length;
  }
  return out;
}

/**
 * CSS px per font unit that makes `source` look as big as an x-height of
 * `xHeight`. Perceived size depends on capitals too, so tall-capped hands are
 * scaled down a little and flat ones up.
 */
export function unitFor(source: GlyphSource, xHeight: number): number {
  const visual = source.xHeight * 0.7 + source.capHeight * 0.64 * 0.3;
  return xHeight / visual;
}

export function shapeWord(pieces: Piece[], spaces: number, trailingMarks: Mark[], key: number, ctx: WordContext): Word {
  const { style } = ctx;
  const glyphs: PlacedGlyph[] = [];
  let pen = 0;
  let text = "";
  const primary = style.sources[0]!;
  const em = primary.upem * unitFor(primary, ctx.xHeight);
  const tracking = (style.tracking + ctx.letterSpacing) * em;
  const jitter = style.connected ? 0 : ctx.spacingJitter;

  for (const piece of pieces) {
    text += piece.text;
    for (const run of runs(piece.text, style.sources, ctx.missing)) {
      const unit = unitFor(run.source, ctx.xHeight);
      for (const g of run.source.shape(run.text)) {
        const index = glyphs.length;
        const advance = g.advance * unit;
        glyphs.push({
          source: run.source,
          glyph: g.glyph,
          unit,
          x: pen,
          dx: g.dx * unit,
          dy: g.dy * unit,
          advance,
          marks: piece.marks,
          index,
        });
        // Zero-advance glyphs are marks attached to their base; never space them out.
        // Jitter may tighten a pair but never lets letters collide.
        if (advance > 0) pen += Math.max(advance * 0.82, advance + tracking + gaussian(key, index, 11) * 0.028 * em * jitter);
      }
    }
  }

  // Word-level size variation also scales the word's footprint.
  const size = 1 + gaussian(key, 1) * 0.028 * ctx.sizeJitter;
  if (size !== 1) {
    for (const g of glyphs) {
      g.x *= size;
      g.dx *= size;
      g.dy *= size;
      g.advance *= size;
      g.unit *= size;
    }
    pen *= size;
  }

  const spaceUnit = unitFor(primary, ctx.xHeight);
  const spaceGlyph = primary.shape(" ")[0];
  const spaceAdvance = (spaceGlyph?.advance ?? primary.upem * 0.28) * spaceUnit;
  const space = spaces > 0 ? spaces * spaceAdvance * style.wordSpace * ctx.wordSpacing * Math.max(0.55, 1 + gaussian(key, 2) * 0.16 * ctx.spacingJitter) : 0;

  return { text, key, glyphs, width: Math.max(0, pen - tracking), space, trailingMarks };
}

/**
 * Breaks a word that is wider than a whole line into pieces that fit. Breaks
 * only between glyphs with advance so marks stay with their base.
 */
export function splitWide(word: Word, maxWidth: number): Word[] {
  const parts: Word[] = [];
  let start = 0;
  while (start < word.glyphs.length) {
    const x0 = word.glyphs[start]!.x;
    let end = start + 1;
    while (end < word.glyphs.length) {
      const g = word.glyphs[end]!;
      if (g.advance > 0 && g.x + g.advance - x0 > maxWidth) break;
      end++;
    }
    const slice = word.glyphs.slice(start, end).map((g) => ({ ...g, x: g.x - x0 }));
    const last = slice[slice.length - 1]!;
    const isLast = end >= word.glyphs.length;
    parts.push({
      text: word.text,
      key: word.key + parts.length,
      glyphs: slice,
      width: last.x + last.advance,
      space: isLast ? word.space : 0,
      trailingMarks: isLast ? word.trailingMarks : [],
    });
    start = end;
  }
  return parts;
}
