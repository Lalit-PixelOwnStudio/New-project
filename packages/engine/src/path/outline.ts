/**
 * Glyph outlines as flattened polygons.
 *
 * Outlines are flattened once, in font units, and cached per glyph. Every
 * instance on the page then goes through an affine transform plus a smooth
 * displacement field; working with points instead of Bézier control points
 * keeps that warp exact and cheap.
 */

/** Closed polygon as packed x,y pairs. */
export type Contour = Float32Array;
export type Outline = Contour[];

export interface PathCommand {
  type: string;
  values: number[];
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Flattens path commands into closed polygons.
 * `tolerance` is the maximum distance between the curve and its chords.
 */
export function flatten(commands: PathCommand[], tolerance: number): Outline {
  const contours: Outline = [];
  let pts: number[] = [];
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;

  const close = () => {
    if (pts.length >= 6) contours.push(Float32Array.from(pts));
    pts = [];
  };

  for (const cmd of commands) {
    const v = cmd.values;
    switch (cmd.type) {
      case "M":
        close();
        cx = sx = v[0]!;
        cy = sy = v[1]!;
        pts.push(cx, cy);
        break;
      case "L":
        cx = v[0]!;
        cy = v[1]!;
        pts.push(cx, cy);
        break;
      case "Q": {
        const [x1, y1, x2, y2] = v as [number, number, number, number];
        const ddx = cx - 2 * x1 + x2;
        const ddy = cy - 2 * y1 + y2;
        const n = Math.max(1, Math.min(64, Math.ceil(Math.sqrt(Math.hypot(ddx, ddy) / (4 * tolerance)))));
        for (let i = 1; i <= n; i++) {
          const t = i / n;
          const mt = 1 - t;
          pts.push(mt * mt * cx + 2 * mt * t * x1 + t * t * x2, mt * mt * cy + 2 * mt * t * y1 + t * t * y2);
        }
        cx = x2;
        cy = y2;
        break;
      }
      case "C": {
        const [x1, y1, x2, y2, x3, y3] = v as [number, number, number, number, number, number];
        const m = Math.max(Math.hypot(cx - 2 * x1 + x2, cy - 2 * y1 + y2), Math.hypot(x1 - 2 * x2 + x3, y1 - 2 * y2 + y3));
        const n = Math.max(1, Math.min(96, Math.ceil(Math.sqrt((3 * m) / (4 * tolerance)))));
        for (let i = 1; i <= n; i++) {
          const t = i / n;
          const mt = 1 - t;
          const a = mt * mt * mt;
          const b = 3 * mt * mt * t;
          const c = 3 * mt * t * t;
          const d = t * t * t;
          pts.push(a * cx + b * x1 + c * x2 + d * x3, a * cy + b * y1 + c * y2 + d * y3);
        }
        cx = x3;
        cy = y3;
        break;
      }
      case "Z":
        cx = sx;
        cy = sy;
        close();
        break;
      default:
        break;
    }
  }
  close();
  return contours;
}

export function outlineBounds(outline: Outline): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const c of outline) {
    for (let i = 0; i < c.length; i += 2) {
      const x = c[i]!;
      const y = c[i + 1]!;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY };
}

/** Parses an SVG path `d` string (absolute M/L/Q/C/Z only, as HarfBuzz emits). */
export function parseSvgPath(d: string): PathCommand[] {
  const out: PathCommand[] = [];
  const re = /([MLQCZ])([^MLQCZ]*)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d))) {
    const values = m[2]!
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    out.push({ type: m[1]!.toUpperCase(), values });
  }
  return out;
}
