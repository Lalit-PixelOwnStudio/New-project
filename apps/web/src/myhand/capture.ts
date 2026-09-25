/**
 * Reads a photo or scan of the filled-in template and turns every cell into
 * glyph outlines. Pure functions over pixel arrays, so the same code runs in
 * the browser (on the visitor's own device; the photo is never uploaded) and
 * in tests.
 */
import type { CapturedHand } from "@truehand/engine";
import { CELLS, MARKERS, cellBox } from "./template";

export interface Gray {
  data: Uint8Array;
  width: number;
  height: number;
}
type Pt = [number, number];

export class CaptureError extends Error {}

/** Pixels per millimetre at which cells are read. */
const SAMPLE = 12;
/** Font units per em, and the x-height every hand is scaled to. */
const UPEM = 1000;
const X_HEIGHT = 500;
const SIDE_BEARING = 45;

/* --------------------------------- Pixels --------------------------------- */

export function toGray(rgba: ArrayLike<number>, width: number, height: number): Gray {
  const data = new Uint8Array(width * height);
  for (let i = 0, j = 0; i < data.length; i++, j += 4) data[i] = (rgba[j]! * 77 + rgba[j + 1]! * 150 + rgba[j + 2]! * 29) >> 8;
  return { data, width, height };
}

/** Box-averages an image down by an integer factor. */
export function shrink(g: Gray, factor: number): Gray {
  if (factor <= 1) return g;
  const width = Math.floor(g.width / factor);
  const height = Math.floor(g.height / factor);
  const data = new Uint8Array(width * height);
  const n = factor * factor;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let dy = 0; dy < factor; dy++) {
        const row = (y * factor + dy) * g.width + x * factor;
        for (let dx = 0; dx < factor; dx++) sum += g.data[row + dx]!;
      }
      data[y * width + x] = sum / n;
    }
  }
  return { data, width, height };
}

function percentile(values: ArrayLike<number>, p: number): number {
  const hist = new Uint32Array(256);
  for (let i = 0; i < values.length; i++) hist[values[i]!]!++;
  let target = values.length * p;
  for (let v = 0; v < 256; v++) {
    target -= hist[v]!;
    if (target <= 0) return v;
  }
  return 255;
}

function sample(g: Gray, x: number, y: number): number {
  const x0 = Math.max(0, Math.min(g.width - 2, Math.floor(x)));
  const y0 = Math.max(0, Math.min(g.height - 2, Math.floor(y)));
  const fx = Math.max(0, Math.min(1, x - x0));
  const fy = Math.max(0, Math.min(1, y - y0));
  const i = y0 * g.width + x0;
  const d = g.data;
  const top = d[i]! + (d[i + 1]! - d[i]!) * fx;
  const bottom = d[i + g.width]! + (d[i + g.width + 1]! - d[i + g.width]!) * fx;
  return top + (bottom - top) * fy;
}

/* ------------------------------ Components ------------------------------- */

interface Blob {
  area: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  cx: number;
  cy: number;
}

/** 8-connected components of the `on` pixels. `labels` receives component ids (1-based). */
function components(on: Uint8Array, w: number, h: number, labels?: Int32Array): Blob[] {
  const seen = labels ?? new Int32Array(w * h);
  const blobs: Blob[] = [];
  const stack: number[] = [];
  for (let start = 0; start < on.length; start++) {
    if (!on[start] || seen[start]) continue;
    const id = blobs.length + 1;
    const b: Blob = { area: 0, x0: w, y0: h, x1: 0, y1: 0, cx: 0, cy: 0 };
    seen[start] = id;
    stack.push(start);
    while (stack.length) {
      const i = stack.pop()!;
      const x = i % w;
      const y = (i - x) / w;
      b.area++;
      b.cx += x;
      b.cy += y;
      if (x < b.x0) b.x0 = x;
      if (x > b.x1) b.x1 = x;
      if (y < b.y0) b.y0 = y;
      if (y > b.y1) b.y1 = y;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const j = ny * w + nx;
          if (on[j] && !seen[j]) {
            seen[j] = id;
            stack.push(j);
          }
        }
      }
    }
    b.cx /= b.area;
    b.cy /= b.area;
    blobs.push(b);
  }
  return blobs;
}

/* -------------------------------- Markers --------------------------------- */

const MARKER_W = MARKERS[1]![0] - MARKERS[0]![0];
const MARKER_H = MARKERS[3]![1] - MARKERS[0]![1];

/**
 * Finds the four corner squares and returns their centres clockwise from the
 * top-left one (the one with a hole), whichever way up the photo was taken.
 */
export function findMarkers(g: Gray): [Pt, Pt, Pt, Pt] {
  const factor = Math.max(1, Math.ceil(Math.max(g.width, g.height) / 1000));
  const s = shrink(g, factor);
  const paper = percentile(s.data, 0.9);
  const threshold = Math.min(paper * 0.5, 120);
  const dark = new Uint8Array(s.data.length);
  for (let i = 0; i < dark.length; i++) dark[i] = s.data[i]! < threshold ? 1 : 0;

  const minSide = Math.max(8, Math.max(s.width, s.height) * 0.012);
  const candidates = components(dark, s.width, s.height)
    .map((b) => {
      const bw = b.x1 - b.x0 + 1;
      const bh = b.y1 - b.y0 + 1;
      const centre = Math.round(b.cy) * s.width + Math.round(b.cx);
      return { ...b, side: (bw + bh) / 2, square: Math.min(bw, bh) / Math.max(bw, bh), fill: b.area / (bw * bh), hollow: !dark[centre] };
    })
    .filter((b) => b.side >= minSide && b.square > 0.6 && b.fill > 0.5)
    .sort((a, b) => b.area - a.area)
    .slice(0, 12);

  // Try every set of four: one hollow and three solid, laid out like the template.
  let best: { score: number; pts: typeof candidates } | null = null;
  const n = candidates.length;
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
      for (let c = b + 1; c < n; c++)
        for (let d = c + 1; d < n; d++) {
          const four = [candidates[a]!, candidates[b]!, candidates[c]!, candidates[d]!];
          if (four.filter((m) => m.hollow).length !== 1) continue;
          // The markers are all the same size; a letter that happens to look square isn't.
          const sides = four.map((m) => m.side);
          if (Math.max(...sides) / Math.min(...sides) > 1.8) continue;
          const ordered = clockwise(
            four,
            four.findIndex((m) => m.hollow),
          );
          const score = layoutScore(ordered.map((m): Pt => [m.cx, m.cy]));
          if (score > 0 && (!best || score > best.score)) best = { score, pts: ordered };
        }
  if (!best) throw new CaptureError("We couldn't find the four black squares. Take the photo again with the whole page in view.");
  return best.pts.map((m): Pt => [(m.cx + 0.5) * factor, (m.cy + 0.5) * factor]) as [Pt, Pt, Pt, Pt];
}

/** Orders points clockwise on screen, starting at `first`. */
function clockwise<T extends { cx: number; cy: number }>(pts: T[], first: number): T[] {
  const mx = pts.reduce((s, p) => s + p.cx, 0) / pts.length;
  const my = pts.reduce((s, p) => s + p.cy, 0) / pts.length;
  const angle = (p: T) => Math.atan2(p.cy - my, p.cx - mx);
  const start = angle(pts[first]!);
  return [...pts].sort((p, q) => ((angle(p) - start + 4 * Math.PI) % (2 * Math.PI)) - ((angle(q) - start + 4 * Math.PI) % (2 * Math.PI)));
}

/** How much four points look like the template's marker rectangle; 0 if not at all. */
function layoutScore([tl, tr, br, bl]: Pt[]): number {
  const len = (p: Pt, q: Pt) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const top = len(tl!, tr!);
  const bottom = len(bl!, br!);
  const left = len(tl!, bl!);
  const right = len(tr!, br!);
  if (Math.min(top, bottom, left, right) < 20) return 0;
  const aspect = (left + right) / (top + bottom);
  const expected = MARKER_H / MARKER_W;
  const aspectError = Math.abs(Math.log(aspect / expected));
  const skew = Math.abs(Math.log(top / bottom)) + Math.abs(Math.log(left / right));
  if (aspectError > 0.35 || skew > 0.8) return 0;
  return (top + bottom) * (left + right) * (1 - aspectError) * (1 - skew / 2);
}

/* ------------------------------- Homography -------------------------------- */

/** The projective map taking each `from` point to its `to` point. */
export function homography(from: readonly Pt[], to: readonly Pt[]): number[] {
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i]!;
    const [u, v] = to[i]!;
    A.push([x, y, 1, 0, 0, 0, -x * u, -y * u, u]);
    A.push([0, 0, 0, x, y, 1, -x * v, -y * v, v]);
  }
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let r = col + 1; r < 8; r++) if (Math.abs(A[r]![col]!) > Math.abs(A[pivot]![col]!)) pivot = r;
    [A[col], A[pivot]] = [A[pivot]!, A[col]!];
    const p = A[col]![col]!;
    if (Math.abs(p) < 1e-12) throw new CaptureError("The page is too distorted to read.");
    for (let k = col; k < 9; k++) A[col]![k]! /= p;
    for (let r = 0; r < 8; r++) {
      if (r === col) continue;
      const f = A[r]![col]!;
      if (f) for (let k = col; k < 9; k++) A[r]![k]! -= f * A[col]![k]!;
    }
  }
  return [...A.map((row) => row[8]!), 1];
}

export function project(H: number[], x: number, y: number): Pt {
  const w = H[6]! * x + H[7]! * y + H[8]!;
  return [(H[0]! * x + H[1]! * y + H[2]!) / w, (H[3]! * x + H[4]! * y + H[5]!) / w];
}

/* ---------------------------------- Cells ---------------------------------- */

export interface CellInk {
  char: string;
  width: number;
  height: number;
  /** 1 where there is ink. */
  bits: Uint8Array;
  /** Baseline, in rows from the top. */
  baseline: number;
  ink: number;
}

/** Reads every cell's writing box from the photo, straightened, as ink/no-ink bits. */
export function readCells(g: Gray, markers: readonly Pt[]): CellInk[] {
  const H = homography(MARKERS, markers);
  return CELLS.map((char, index) => {
    const c = cellBox(index);
    const width = Math.round((c.read.x1 - c.read.x0) * SAMPLE);
    const height = Math.round((c.read.y1 - c.read.y0) * SAMPLE);
    const values = new Uint8Array(width * height);
    for (let v = 0; v < height; v++) {
      for (let u = 0; u < width; u++) {
        const [px, py] = project(H, c.read.x0 + (u + 0.5) / SAMPLE, c.read.y0 + (v + 0.5) / SAMPLE);
        values[v * width + u] = sample(g, px, py);
      }
    }
    // Ink is anything well below this cell's own paper brightness, so shadows
    // and the faint printed guide drop out.
    const paper = percentile(values, 0.9);
    const threshold = paper * 0.62;
    const bits = new Uint8Array(values.length);
    for (let i = 0; i < bits.length; i++) bits[i] = values[i]! < threshold ? 1 : 0;
    const ink = despeckle(bits, width, height, 18);
    return { char, width, height, bits, baseline: (c.baseline - c.read.y0) * SAMPLE, ink };
  });
}

/** Clears components smaller than `min` pixels; returns the ink left. */
function despeckle(bits: Uint8Array, w: number, h: number, min: number): number {
  const labels = new Int32Array(w * h);
  const blobs = components(bits, w, h, labels);
  let ink = 0;
  for (let i = 0; i < bits.length; i++) {
    const id = labels[i]!;
    if (!id) continue;
    if (blobs[id - 1]!.area < min) bits[i] = 0;
    else ink++;
  }
  return ink;
}

/* --------------------------------- Tracing --------------------------------- */

/**
 * Outlines of the ink as closed polygons, in pixel units. Every boundary edge
 * keeps the ink on the same side, so holes wind the other way round from the
 * shapes around them, which is what non-zero filling needs.
 */
export function trace(bits: Uint8Array, w: number, h: number): Pt[][] {
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && bits[y * w + x] === 1;
  const W = w + 1;
  const edges = new Map<number, number[]>();
  const add = (x0: number, y0: number, x1: number, y1: number) => {
    const k = y0 * W + x0;
    const list = edges.get(k);
    if (list) list.push(y1 * W + x1);
    else edges.set(k, [y1 * W + x1]);
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!on(x, y)) continue;
      if (!on(x, y - 1)) add(x + 1, y, x, y);
      if (!on(x - 1, y)) add(x, y, x, y + 1);
      if (!on(x, y + 1)) add(x, y + 1, x + 1, y + 1);
      if (!on(x + 1, y)) add(x + 1, y + 1, x + 1, y);
    }
  }
  const loops: Pt[][] = [];
  for (const [start, outs] of edges) {
    while (outs.length) {
      const loop: Pt[] = [];
      let at = start;
      let next = outs.pop()!;
      loop.push([at % W, Math.floor(at / W)]);
      while (next !== start) {
        at = next;
        loop.push([at % W, Math.floor(at / W)]);
        const onward = edges.get(at);
        if (!onward?.length) break;
        next = onward.pop()!;
      }
      if (loop.length >= 4) loops.push(smooth(loop));
    }
  }
  return loops;
}

/** Turns a staircase pixel outline into a smooth, compact polygon. */
function smooth(loop: Pt[]): Pt[] {
  let pts = simplify(corners(loop), 0.6);
  for (let i = 0; i < 2; i++) pts = chaikin(pts);
  return simplify(pts, 0.25);
}

function corners(loop: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < loop.length; i++) {
    const a = loop[(i - 1 + loop.length) % loop.length]!;
    const b = loop[i]!;
    const c = loop[(i + 1) % loop.length]!;
    if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) !== 0) out.push(b);
  }
  return out.length >= 3 ? out : loop;
}

function chaikin(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]!;
    const b = pts[(i + 1) % pts.length]!;
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  return out;
}

/** Ramer–Douglas–Peucker on a closed polygon. */
function simplify(pts: Pt[], epsilon: number): Pt[] {
  if (pts.length < 8) return pts;
  let far = 0;
  let best = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = (pts[i]![0] - pts[0]![0]) ** 2 + (pts[i]![1] - pts[0]![1]) ** 2;
    if (d > best) {
      best = d;
      far = i;
    }
  }
  const half = (from: number, to: number) => rdp(pts.slice(from, to + 1), epsilon);
  const a = half(0, far);
  const b = rdp([...pts.slice(far), pts[0]!], epsilon);
  const out = [...a.slice(0, -1), ...b.slice(0, -1)];
  return out.length >= 3 ? out : pts;
}

function rdp(pts: Pt[], epsilon: number): Pt[] {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0]!;
  const [bx, by] = pts[pts.length - 1]!;
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let index = 0;
  let max = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((bx - ax) * (ay - pts[i]![1]) - (ax - pts[i]![0]) * (by - ay)) / len;
    if (d > max) {
      max = d;
      index = i;
    }
  }
  if (max <= epsilon) return [pts[0]!, pts[pts.length - 1]!];
  const left = rdp(pts.slice(0, index + 1), epsilon);
  return [...left.slice(0, -1), ...rdp(pts.slice(index), epsilon)];
}

/* ------------------------------- The hand --------------------------------- */

export interface CapturedCell {
  char: string;
  outlines: Pt[][];
  /** Ink extent in pixels, and the baseline row. */
  box: { x0: number; y0: number; x1: number; y1: number };
  baseline: number;
}

/** Traces every cell that has writing in it. */
export function traceCells(cells: CellInk[]): CapturedCell[] {
  const out: CapturedCell[] = [];
  for (const c of cells) {
    if (c.ink < 30) continue;
    let x0 = c.width;
    let y0 = c.height;
    let x1 = 0;
    let y1 = 0;
    for (let y = 0; y < c.height; y++)
      for (let x = 0; x < c.width; x++)
        if (c.bits[y * c.width + x]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
    out.push({ char: c.char, outlines: trace(c.bits, c.width, c.height), box: { x0, y0, x1: x1 + 1, y1: y1 + 1 }, baseline: c.baseline });
  }
  return out;
}

const median = (xs: number[]) => {
  if (!xs.length) return undefined;
  const s = [...xs].sort((a, b) => a - b);
  return s[s.length >> 1];
};

/**
 * Scales every glyph so the hand's x-height (the median height of its flat-topped
 * lowercase letters) is 500 units, sits each on its cell's baseline, and gives
 * it an advance from its ink width.
 */
export function buildHand(cells: CapturedCell[]): CapturedHand {
  const tops = (chars: string) => cells.filter((c) => chars.includes(c.char)).map((c) => c.baseline - c.box.y0);
  const xh = median(tops("acemnorsuvwxz")) ?? (median(tops("ABCDEFHIKLMNTUVWXYZ")) ?? 40) * 0.62;
  const scale = X_HEIGHT / Math.max(4, xh);
  const cap = median(tops("EFHILTZ"));

  let ascender = 0;
  let descender = 0;
  const glyphs = cells.map((c) => {
    const drawing = c.outlines.map((loop) => {
      const flat: number[] = [];
      for (const [x, y] of loop) {
        const X = Math.round((x - c.box.x0) * scale + SIDE_BEARING);
        const Y = Math.round((c.baseline - y) * scale);
        flat.push(X, Y);
        if (Y > ascender) ascender = Y;
        if (Y < descender) descender = Y;
      }
      return flat;
    });
    // Narrow letters like "l" and "i" keep their natural width; only dots get a floor.
    const advance = Math.max(Math.round((c.box.x1 - c.box.x0) * scale + SIDE_BEARING * 2), ".,'".includes(c.char) ? 150 : 170);
    return { char: c.char, advance, variants: [drawing] };
  });

  return {
    version: 1,
    upem: UPEM,
    xHeight: X_HEIGHT,
    capHeight: cap ? Math.round(cap * scale) : 700,
    ascender: Math.max(ascender, 750),
    descender: Math.min(descender, -250),
    space: 320,
    glyphs,
  };
}

export interface CaptureResult {
  hand: CapturedHand;
  /** Characters with writing found, and the ones left empty. */
  found: string[];
  missing: string[];
}

/** The whole pipeline: photo pixels in, a captured hand out. */
export function captureTemplate(rgba: ArrayLike<number>, width: number, height: number): CaptureResult {
  let g = toGray(rgba, width, height);
  const long = Math.max(width, height);
  if (long > 2800) g = shrink(g, Math.ceil(long / 2400));
  const markers = findMarkers(g);
  const cells = traceCells(readCells(g, markers));
  if (cells.length < 20) throw new CaptureError("We found the page but hardly any writing. Use a dark pen and fill in the boxes, then try again.");
  const hand = buildHand(cells);
  const found = [...new Set(cells.map((c) => c.char))];
  const missing = [...new Set(CELLS)].filter((ch) => !found.includes(ch));
  return { hand, found, missing };
}
