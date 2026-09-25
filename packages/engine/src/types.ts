import type { Outline } from "./path/outline";

/* ------------------------------------------------------------------------ */
/* Glyph sources                                                            */
/* ------------------------------------------------------------------------ */

/** One glyph produced by shaping a run of text, in font units. */
export interface ShapedGlyph {
  glyph: number;
  /** Index of the first UTF-16 code unit of the cluster this glyph belongs to. */
  cluster: number;
  advance: number;
  dx: number;
  dy: number;
}

/**
 * Anything that can turn text into glyph outlines: an OpenType font shaped by
 * HarfBuzz, or a glyph set captured from someone's real handwriting.
 */
export interface GlyphSource {
  readonly id: string;
  readonly upem: number;
  /** Measured from the outline of "x", not trusted from OS/2. */
  readonly xHeight: number;
  /** Measured from the outline of "H". */
  readonly capHeight: number;
  readonly ascender: number;
  readonly descender: number;
  covers(codePoint: number): boolean;
  shape(text: string): ShapedGlyph[];
  /** Number of drawn variants for a glyph (1 for fonts, 2+ for captured hands). */
  variants(glyph: number): number;
  /** Outline in font units, y pointing up. */
  outline(glyph: number, variant: number): Outline;
}

/** A handwriting style: glyph sources plus how the hand behaves. */
export interface HandStyle {
  id: string;
  /** Primary source first; later sources fill in characters the primary lacks. */
  sources: GlyphSource[];
  /** Joined script. Per-glyph jitter is disabled so joins stay connected. */
  connected: boolean;
  /** Multiplier applied after x-height normalisation. */
  sizeAdjust: number;
  /** Natural slant of the hand in degrees; positive leans right. */
  slant: number;
  /** Multiplier for the pen's extra stroke width. */
  weight: number;
  /** Extra letter spacing in em. */
  tracking: number;
  /** Multiplier for the width of a space. */
  wordSpace: number;
  /** Vertical offset of the baseline in em (positive moves text up). */
  baselineShift: number;
}

/* ------------------------------------------------------------------------ */
/* Document input                                                           */
/* ------------------------------------------------------------------------ */

export type PaperSize = "a4" | "letter" | "a5" | "legal";
export type Ruling = "ruled" | "grid" | "dot" | "plain";
export type PaperTexture = "smooth" | "recycled" | "aged";

export interface PaperSpec {
  size: PaperSize;
  ruling: Ruling;
  /** Distance between ruled lines, or grid cell size. */
  spacingMm: number;
  /** For grid and dot paper: write on every n-th row. */
  linesEvery?: number;
  paperColor: string;
  lineColor: string;
  /** Vertical margin rule; writing starts just to its right. */
  marginLine?: { xMm: number; color: string; double?: boolean } | null;
  /** Heavier rule marking the top of the writing area. */
  headRule?: { color: string } | null;
  /** Cornell layout: cue column on the left, summary box at the bottom. */
  cornell?: { cueMm: number; summaryMm: number; color: string } | null;
  texture: PaperTexture;
  holes: "none" | "two" | "three";
  margins: { topMm: number; bottomMm: number; leftMm: number; rightMm: number };
}

export type PenKind = "ballpoint" | "gel" | "fountain" | "pencil" | "marker";

export interface PenSpec {
  kind: PenKind;
  color: string;
  /** Extra stroke width in CSS px (96 dpi). 0 keeps the style's natural weight. */
  width: number;
}

export interface RealismSpec {
  seed: number;
  /** Master control, 0 (tidy) to 1 (rushed). */
  messiness: number;
  /** Degrees added to the style's natural slant. */
  slant: number;
  /** 0 to 1: handwriting gets looser down the page and across pages. */
  fatigue: number;
  /** Optional fine controls, 0 to 2, multiplying what messiness implies. */
  size?: number;
  baseline?: number;
  lineSlope?: number;
  spacing?: number;
  shape?: number;
  ink?: number;
}

export interface LayoutSpec {
  /** Text size relative to the default for the paper's line spacing. */
  size: number;
  /** Extra letter spacing in em. */
  letterSpacing: number;
  /** Multiplier for word gaps. */
  wordSpacing: number;
  /** First-line indent for paragraphs, in mm. */
  indentMm: number;
  /** Empty ruled lines left between paragraphs. */
  paragraphGap: number;
  underlineHeadings: boolean;
}

export interface HeaderSpec {
  left?: string;
  right?: string;
  pageNumbers?: boolean;
}

export interface DocumentSpec {
  text: string;
  paper: PaperSpec;
  pen: PenSpec;
  realism: RealismSpec;
  layout: LayoutSpec;
  header?: HeaderSpec;
}

/* ------------------------------------------------------------------------ */
/* Layout output (display list)                                             */
/* ------------------------------------------------------------------------ */

export interface InkStyle {
  /** Opacity of the ink, 0 to 1. */
  alpha: number;
  /** Lightness shift, roughly -1 (darker) to 1 (lighter). */
  tone: number;
  /** Stroke width added around filled outlines, in CSS px. */
  weight: number;
}

/** Filled glyph outlines of one word, in page CSS px. */
export interface InkFill extends InkStyle {
  kind: "fill";
  contours: Float32Array[];
}

/** A hand-drawn line (underline, strike-through, bullet dash), in page CSS px. */
export interface InkLine extends InkStyle {
  kind: "line";
  points: Float32Array;
  width: number;
}

/** Highlighter band drawn under the ink. */
export interface Highlight {
  kind: "highlight";
  polygon: Float32Array;
  color: string;
}

export type InkItem = InkFill | InkLine;

export interface PaperGeometry {
  widthPx: number;
  heightPx: number;
  spacingPx: number;
  /** y of every printed horizontal rule (ruled paper) or grid row. */
  rules: number[];
  /** y of every line handwriting may sit on. */
  baselines: number[];
  textLeft: number;
  textRight: number;
  marginX: number | null;
  headerBaseline: number;
  footerBaseline: number;
  cornell: { cueX: number; summaryY: number } | null;
}

export interface PageLayout {
  index: number;
  geometry: PaperGeometry;
  highlights: Highlight[];
  ink: InkItem[];
}

export interface LayoutStats {
  pages: number;
  words: number;
  glyphs: number;
  /** Code points no glyph source could draw. */
  missing: number[];
}

export interface DocumentLayout {
  pages: PageLayout[];
  stats: LayoutStats;
}
