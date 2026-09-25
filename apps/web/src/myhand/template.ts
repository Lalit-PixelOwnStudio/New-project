/**
 * The one-page template people fill in by hand, in millimetres on A4. The same
 * layout draws the template and reads the photo of it back (capture.ts).
 *
 * Four black squares mark the corners; the top-left one has a hole, so a photo
 * taken sideways or upside down still reads correctly. Each cell has a small
 * label on top and a writing box with the baseline marked at both sides.
 */
export const PAGE = { width: 210, height: 297 } as const;

const MARKER_SIZE = 9;
const MARKER_INSET = 12;
/** Hole in the top-left marker, as a fraction of its side. */
export const MARKER_HOLE = 0.5;

/** Marker centres, clockwise from top left. */
export const MARKERS: readonly [number, number][] = [
  [MARKER_INSET + MARKER_SIZE / 2, MARKER_INSET + MARKER_SIZE / 2],
  [PAGE.width - MARKER_INSET - MARKER_SIZE / 2, MARKER_INSET + MARKER_SIZE / 2],
  [PAGE.width - MARKER_INSET - MARKER_SIZE / 2, PAGE.height - MARKER_INSET - MARKER_SIZE / 2],
  [MARKER_INSET + MARKER_SIZE / 2, PAGE.height - MARKER_INSET - MARKER_SIZE / 2],
];

export const GRID = { left: 12, top: 38, cols: 10, rows: 11, cellW: 18.6, cellH: 21.2 } as const;
const LABEL_H = 3.6;
/** Baseline height within the writing box, from its top. */
const BASELINE = 0.66;
/** How far inside the writing box the ink is read, to stay clear of the printed lines. */
const INSET = 1.6;

const UPPER = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const LOWER = [..."abcdefghijklmnopqrstuvwxyz"];
const DIGITS = [..."0123456789"];
const MARKS = [...("." + ",!?'\"-:;()&@/+=#%*$₹~")];

/**
 * What goes in each cell, in reading order. Lowercase letters appear twice so
 * the hand has two versions of the letters people write most.
 */
export const CELLS: readonly string[] = [...UPPER, ...LOWER, ...LOWER, ...DIGITS, ...MARKS];

if (CELLS.length > GRID.cols * GRID.rows) throw new Error("Template has more characters than cells");

export interface CellBox {
  index: number;
  char: string;
  /** Cell outline. */
  x: number;
  y: number;
  /** Writing box. */
  boxTop: number;
  baseline: number;
  /** Area read back from the photo. */
  read: { x0: number; y0: number; x1: number; y1: number };
}

export function cellBox(index: number): CellBox {
  const col = index % GRID.cols;
  const row = Math.floor(index / GRID.cols);
  const x = GRID.left + col * GRID.cellW;
  const y = GRID.top + row * GRID.cellH;
  const boxTop = y + LABEL_H;
  const boxH = GRID.cellH - LABEL_H;
  return {
    index,
    char: CELLS[index] ?? "",
    x,
    y,
    boxTop,
    baseline: boxTop + boxH * BASELINE,
    read: { x0: x + INSET, y0: boxTop + INSET * 0.6, x1: x + GRID.cellW - INSET, y1: y + GRID.cellH - INSET },
  };
}

/** Any Canvas 2D context: the browser's, OffscreenCanvas's or @napi-rs/canvas's. */
export interface Ctx2D {
  fillStyle: unknown;
  strokeStyle: unknown;
  lineWidth: number;
  font: string;
  textBaseline: string;
  textAlign: string;
  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  stroke(): void;
  fillText(text: string, x: number, y: number): void;
  setLineDash(segments: number[]): void;
  save(): void;
  restore(): void;
  scale(x: number, y: number): void;
}

/** Draws the template at `pxPerMm` pixels per millimetre. */
export function drawTemplate(ctx: Ctx2D, pxPerMm: number, font = "sans-serif") {
  ctx.save();
  ctx.scale(pxPerMm, pxPerMm);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PAGE.width, PAGE.height);

  // Corner markers; the top-left one has a hole.
  ctx.fillStyle = "#000000";
  MARKERS.forEach(([cx, cy], i) => {
    ctx.fillRect(cx - MARKER_SIZE / 2, cy - MARKER_SIZE / 2, MARKER_SIZE, MARKER_SIZE);
    if (i === 0) {
      const hole = MARKER_SIZE * MARKER_HOLE;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(cx - hole / 2, cy - hole / 2, hole, hole);
      ctx.fillStyle = "#000000";
    }
  });

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#111111";
  ctx.font = `bold 5.2px ${font}`;
  ctx.fillText("Your handwriting · truehand", 25, 19.5);
  ctx.fillStyle = "#555555";
  ctx.font = `3.1px ${font}`;
  ctx.fillText("Write one character in each box with a dark pen, sitting on the small marks at the sides.", 25, 27);
  ctx.fillText("Then take a straight, well-lit photo of the whole page, with all four black squares in view.", 25, 31.5);

  for (let i = 0; i < CELLS.length; i++) {
    const c = cellBox(i);
    // Cell and label strip.
    ctx.strokeStyle = "#b9bec7";
    ctx.lineWidth = 0.18;
    ctx.setLineDash([]);
    ctx.strokeRect(c.x, c.y, GRID.cellW, GRID.cellH);
    ctx.beginPath();
    ctx.moveTo(c.x, c.boxTop);
    ctx.lineTo(c.x + GRID.cellW, c.boxTop);
    ctx.stroke();
    ctx.fillStyle = "#8a909c";
    ctx.font = `2.6px ${font}`;
    ctx.fillText(c.char, c.x + 0.9, c.y + LABEL_H - 0.9);
    // Baseline: marks at both sides, and a faint dotted guide that the photo reader ignores.
    ctx.strokeStyle = "#5b6270";
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(c.x, c.baseline);
    ctx.lineTo(c.x + 1.1, c.baseline);
    ctx.moveTo(c.x + GRID.cellW - 1.1, c.baseline);
    ctx.lineTo(c.x + GRID.cellW, c.baseline);
    ctx.stroke();
    ctx.strokeStyle = "#d3e2ff";
    ctx.lineWidth = 0.2;
    ctx.setLineDash([0.6, 0.9]);
    ctx.beginPath();
    ctx.moveTo(c.x + 1.6, c.baseline);
    ctx.lineTo(c.x + GRID.cellW - 1.6, c.baseline);
    ctx.stroke();
  }
  ctx.restore();
}
