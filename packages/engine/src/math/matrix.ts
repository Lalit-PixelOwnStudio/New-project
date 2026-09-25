/** 2D affine matrix in canvas order: x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Matrix = [a: number, b: number, c: number, d: number, e: number, f: number];

export const identity = (): Matrix => [1, 0, 0, 1, 0, 0];

/** Returns `m · n` (apply `n` first, then `m`). */
export function multiply(m: Matrix, n: Matrix): Matrix {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

export const translate = (x: number, y: number): Matrix => [1, 0, 0, 1, x, y];
export const scale = (sx: number, sy = sx): Matrix => [sx, 0, 0, sy, 0, 0];
export function rotate(rad: number): Matrix {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [c, s, -s, c, 0, 0];
}
/** Horizontal shear; positive angles lean glyph tops to the right (y grows downward). */
export const skewX = (rad: number): Matrix => [1, 0, -Math.tan(rad), 1, 0, 0];

/** Composes transforms left-to-right in the order they are applied to a point. */
export function compose(...ms: Matrix[]): Matrix {
  let out = identity();
  for (const m of ms) out = multiply(m, out);
  return out;
}
