export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function parseColor(hex: string): RGB {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = Number.parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function mix(a: RGB, b: RGB, t: number): RGB {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
}

export const WHITE: RGB = { r: 255, g: 255, b: 255 };
export const BLACK: RGB = { r: 0, g: 0, b: 0 };

/** Shifts lightness: positive tone lightens toward white, negative darkens. */
export function shade(c: RGB, tone: number): RGB {
  return tone >= 0 ? mix(c, WHITE, Math.min(0.5, tone * 0.22)) : mix(c, BLACK, Math.min(0.5, -tone * 0.18));
}

export function css(c: RGB, alpha = 1): string {
  const r = Math.round(c.r);
  const g = Math.round(c.g);
  const b = Math.round(c.b);
  return alpha >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}
