import { gaussian, hash, hashString } from "../math/random";
import { parseDocument, type Block, type Mark, type Span } from "../text/markup";
import type { DocumentLayout, DocumentSpec, HandStyle, PageLayout } from "../types";
import { paperGeometry } from "./paper";
import { drawnLine, highlightBand, placeWord, type Amounts, type LineFrame, type PlaceContext, type PlacedSpan } from "./place";
import { shapeWord, splitWide, splitWords, type Word, type WordContext } from "./words";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** x-height as a fraction of the writing line height at size 1. */
const X_HEIGHT_RATIO = { ruled: 0.33, plain: 0.33, grid: 0.27, dot: 0.27 } as const;
const HEADING_SCALE = { 1: 1.3, 2: 1.14 } as const;
const HIGHLIGHT = "#ffd84a";

export function amountsFor(doc: DocumentSpec): Amounts {
  const r = doc.realism;
  if (r.off) return { size: 0, baseline: 0, slope: 0, spacing: 0, shape: 0, ink: 0, letter: 0 };
  // Even the neatest hand varies; messiness scales from "careful" to "rushed".
  const m = 0.3 + 1.25 * clamp(r.messiness, 0, 1);
  return {
    size: m * (r.size ?? 1),
    baseline: m * (r.baseline ?? 1),
    slope: m * (r.lineSlope ?? 1),
    spacing: m * (r.spacing ?? 1),
    shape: m * (r.shape ?? 1),
    ink: m * (r.ink ?? 1),
    letter: m,
  };
}

interface PageBuild extends PageLayout {
  used: boolean;
}

export function layoutDocument(doc: DocumentSpec, style: HandStyle): DocumentLayout {
  const geo = paperGeometry(doc.paper);
  const seed = doc.realism.seed >>> 0;
  const amounts = amountsFor(doc);
  const plain = doc.paper.ruling === "plain";
  const baseXh = geo.spacingPx * X_HEIGHT_RATIO[doc.paper.ruling] * doc.layout.size * style.sizeAdjust;
  const missing = new Set<number>();
  const slots = geo.baselines.length;

  const pages: PageBuild[] = [];
  let page!: PageBuild;
  let slot = 0;
  let words = 0;
  let glyphs = 0;

  const newPage = () => {
    page = { index: pages.length, geometry: geo, highlights: [], ink: [], used: false };
    pages.push(page);
    slot = 0;
  };
  newPage();

  const placeCtx = (xh: number): PlaceContext => ({
    xHeight: xh,
    amounts,
    connected: style.connected,
    slant: style.slant + doc.realism.slant,
    penWidth: doc.pen.width * style.weight,
    highlightColor: HIGHLIGHT,
  });

  const wordCtx = (xh: number): WordContext => ({
    style,
    xHeight: xh,
    seed,
    letterSpacing: doc.layout.letterSpacing,
    wordSpacing: doc.layout.wordSpacing,
    spacingJitter: amounts.spacing,
    sizeJitter: amounts.size,
    missing,
  });

  const frame = (startX: number, xh: number): LineFrame => {
    const key = hash(seed, page.index, slot, 7);
    const progress = slot / Math.max(1, slots);
    const fatigue = 1 + clamp(doc.realism.fatigue, 0, 1) * Math.min(0.9, 0.4 * progress + 0.12 * page.index);
    const free = plain ? 1.9 : 1;
    const pageTilt = plain ? gaussian(seed, page.index, 8) * 0.005 * amounts.slope : 0;
    const em = style.sources[0]!.upem * (xh / style.sources[0]!.xHeight);
    return {
      key,
      baseline: geo.baselines[slot]! - style.baselineShift * em - xh * 0.03 + gaussian(key, 2) * 0.03 * xh * amounts.baseline * free,
      slope: pageTilt + gaussian(key, 1) * 0.0032 * amounts.slope * fatigue * free,
      startX: startX + gaussian(key, 3) * 0.12 * xh * amounts.letter,
      wobble: 0.045 * xh * amounts.baseline * fatigue * (plain ? 1.5 : 1),
      wavelength: 6.5 * xh,
      fatigue,
    };
  };

  const ensureSlot = () => {
    if (slot >= slots) newPage();
  };

  /** Shapes a block's spans into words with edit-stable random keys. */
  const shapeBlock = (spans: Span[], ordinal: number, xh: number, extraMarks: Mark[] = []): Word[] => {
    const seen = new Map<string, number>();
    const ctx = wordCtx(xh);
    return splitWords(spans).map((w) => {
      const pieces = extraMarks.length ? w.pieces.map((p) => ({ ...p, marks: [...new Set([...p.marks, ...extraMarks])] })) : w.pieces;
      const trailing = extraMarks.length && w.spaces ? [...new Set([...w.trailingMarks, ...extraMarks])] : w.trailingMarks;
      const text = pieces.map((p) => p.text).join("");
      const n = seen.get(text) ?? 0;
      seen.set(text, n + 1);
      return shapeWord(pieces, w.spaces, trailing, hash(seed, ordinal, hashString(text), n), ctx);
    });
  };

  /** Inks the words of one line on the current page, plus their underlines and highlights. */
  const writeLine = (placed: { word: Word; x: number }[], line: LineFrame, xh: number) => {
    const ctx = placeCtx(xh);
    const spans: PlacedSpan[] = [];
    let open = new Map<Mark, PlacedSpan>();
    for (const { word, x } of placed) {
      const result = placeWord(word, x, line, ctx);
      page.ink.push(result.fill);
      page.used = true;
      words++;
      glyphs += word.glyphs.length;
      const next = new Map<Mark, PlacedSpan>();
      for (const s of result.spans) {
        const prev = open.get(s.mark);
        if (prev && s.x0 - prev.x1 < word.width + xh * 3) {
          prev.x1 = s.x1;
          next.set(s.mark, prev);
        } else {
          spans.push(s);
          next.set(s.mark, s);
        }
      }
      open = new Map([...next].filter(([mark]) => word.trailingMarks.includes(mark)));
    }
    spans.forEach((s, i) => {
      const key = hash(line.key, i, 90);
      if (s.mark === "underline") page.ink.push(drawnLine(s.x0, s.x1, xh * 0.24, line, ctx, key));
      else if (s.mark === "strike") page.ink.push(drawnLine(s.x0, s.x1, -xh * 0.45, line, ctx, key));
      else if (s.mark === "highlight") page.highlights.push(highlightBand(s.x0, s.x1, line, ctx, key));
    });
  };

  /**
   * Flows words onto consecutive lines, starting the first line at `firstX` and
   * the rest at `restX`. A list marker, if given, is written left of the first line.
   */
  const flow = (list: Word[], xh: number, firstX: number, restX: number, marker?: { word: Word; x: number }) => {
    let i = 0;
    let first = true;
    const tolerance = xh * 0.4;
    while (i < list.length || (first && marker)) {
      ensureSlot();
      const startX = first ? firstX : restX;
      const line = frame(startX, xh);
      const placed: { word: Word; x: number }[] = [];
      if (first && marker) placed.push({ word: marker.word, x: marker.x + (line.startX - startX) });
      let x = line.startX;
      while (i < list.length) {
        let w = list[i]!;
        const room = geo.textRight - x;
        if (!placed.length && w.width > room + tolerance) {
          list.splice(i, 1, ...splitWide(w, Math.max(xh * 2, room)));
          w = list[i]!;
        }
        if (placed.length && x + w.width > geo.textRight + tolerance) break;
        placed.push({ word: w, x });
        x += w.width + w.space;
        i++;
      }
      writeLine(placed, line, xh);
      slot++;
      first = false;
    }
  };

  const blocks: Block[] = parseDocument(doc.text);
  let ordinal = 0;
  let previous: Block["kind"] | null = null;
  const indent = doc.layout.indentMm * (96 / 25.4);

  for (const block of blocks) {
    switch (block.kind) {
      case "blank":
        if (slot > 0) slot++;
        break;
      case "break":
        if (page.used) newPage();
        break;
      case "heading": {
        const xh = baseXh * HEADING_SCALE[block.level];
        if (slot > 0 && previous !== "blank" && previous !== null) slot++;
        const marks: Mark[] = doc.layout.underlineHeadings && block.level === 1 ? ["underline"] : [];
        flow(shapeBlock(block.spans, ordinal++, xh, marks), xh, geo.textLeft, geo.textLeft);
        break;
      }
      case "paragraph": {
        const list = shapeBlock(block.spans, ordinal++, baseXh);
        flow(list, baseXh, geo.textLeft + indent, geo.textLeft);
        if (doc.layout.paragraphGap > 0 && slot > 0) slot += doc.layout.paragraphGap;
        break;
      }
      case "item": {
        const key = ordinal++;
        const depthX = geo.textLeft + block.depth * baseXh * 2.6;
        const [marker] = shapeBlock([{ text: block.marker, marks: [] }], key + 100_000, baseXh);
        const gap = Math.max(baseXh * 1.9, (marker?.width ?? 0) + baseXh * 0.9);
        const list = shapeBlock(block.spans, key, baseXh);
        flow(list, baseXh, depthX + gap, depthX + gap, marker ? { word: marker, x: depthX } : undefined);
        break;
      }
    }
    previous = block.kind;
  }

  // Drop an empty trailing page left behind by a final page break.
  if (pages.length > 1 && !pages[pages.length - 1]!.used) pages.pop();

  writeFurniture(pages, doc, geo, seed, placeCtx, wordCtx, baseXh);

  return {
    pages: pages.map(({ used: _used, ...p }) => p),
    stats: { pages: pages.length, words, glyphs, missing: [...missing] },
  };
}

/** Header text and page numbers, written a little smaller than body text. */
function writeFurniture(
  pages: PageBuild[],
  doc: DocumentSpec,
  geo: ReturnType<typeof paperGeometry>,
  seed: number,
  placeCtx: (xh: number) => PlaceContext,
  wordCtx: (xh: number) => WordContext,
  baseXh: number,
) {
  const header = doc.header;
  if (!header) return;
  const xh = baseXh * 0.86;
  const ctx = placeCtx(xh);
  const write = (page: PageBuild, text: string, y: number, align: "left" | "right", key: number) => {
    const spans: Span[] = [{ text, marks: [] }];
    const list = splitWords(spans).map((w, i) => shapeWord(w.pieces, w.spaces, [], hash(seed, key, i, page.index), wordCtx(xh)));
    const width = list.reduce((s, w, i) => s + w.width + (i < list.length - 1 ? w.space : 0), 0);
    let x = align === "left" ? geo.textLeft : geo.textRight - width;
    const line: LineFrame = {
      key: hash(seed, page.index, key),
      baseline: y,
      slope: gaussian(seed, page.index, key, 1) * 0.004,
      startX: x,
      wobble: xh * 0.04,
      wavelength: xh * 6,
      fatigue: 1,
    };
    for (const w of list) {
      page.ink.push(placeWord(w, x, line, ctx).fill);
      x += w.width + w.space;
    }
  };
  for (const page of pages) {
    if (header.left) write(page, header.left, geo.headerBaseline, "left", 501);
    if (header.right) write(page, header.right, geo.headerBaseline, "right", 502);
    if (header.pageNumbers) write(page, String(page.index + 1), geo.footerBaseline, "right", 503);
  }
}
