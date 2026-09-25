import { noise2, tileNoise2 } from "../math/noise";
import { hash } from "../math/random";
import type { PaperTexture, PenKind } from "../types";
import { context, type Surface, type SurfaceFactory } from "./surface";

/**
 * Procedural textures. Tiles are generated once per (kind, scale) and repeated
 * as canvas patterns; features are sized in CSS px so a 300 dpi export has the
 * same physical grain as the on-screen preview, just sharper.
 */

/** Tile edge in CSS px. Every noise period below divides it exactly. */
const TILE_CSS = 128;
const cache = new Map<string, Surface>();

function memo(key: string, make: () => Surface): Surface {
  let s = cache.get(key);
  if (!s) {
    s = make();
    cache.set(key, s);
    if (cache.size > 48) cache.delete(cache.keys().next().value as string);
  }
  return s;
}

function tile(create: SurfaceFactory, scale: number, fill: (x: number, y: number, size: number) => [number, number]) {
  const size = Math.max(32, Math.round(TILE_CSS * scale));
  const s = create(size, size);
  const ctx = context(s);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [v, a] = fill((x * TILE_CSS) / size, (y * TILE_CSS) / size, size);
      const i = (y * size + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = a;
    }
  }
  ctx.putImageData(img, 0, 0);
  return s;
}

/** Paper tooth: fine grain plus faint fibres, as a multiply layer (white = no change). */
export function paperTile(create: SurfaceFactory, scale: number, texture: PaperTexture): Surface {
  return memo(`paper:${texture}:${scale}`, () => {
    const grainAmt = texture === "smooth" ? 10 : texture === "recycled" ? 20 : 15;
    const fiberAmt = texture === "smooth" ? 8 : texture === "recycled" ? 22 : 14;
    const P = TILE_CSS;
    return tile(create, scale, (x, y) => {
      const grain = tileNoise2(11, x / 0.8, y / 0.8, P / 0.8);
      const fiber = tileNoise2(12, x / 8, y / 1.28, P / 8, P / 1.28);
      const fiber2 = tileNoise2(13, x / 1.28, y / 8, P / 1.28, P / 8);
      let v = 255 - Math.max(0, grain) * grainAmt - Math.max(0, fiber - 0.35) * fiberAmt * 1.6 - Math.max(0, fiber2 - 0.45) * fiberAmt;
      if (texture === "recycled" && hash(14, Math.floor(x * 1.5), Math.floor(y * 1.5)) % 1400 === 0) v -= 90;
      return [Math.max(0, Math.min(255, v)), 255];
    });
  });
}

/**
 * Where the pen fails to deposit ink. Used with `destination-out` on the ink
 * layer: alpha 255 removes ink completely, 0 leaves it.
 */
export function inkTile(create: SurfaceFactory, scale: number, pen: PenKind): Surface {
  return memo(`ink:${pen}:${scale}`, () => {
    const P = TILE_CSS;
    return tile(create, scale, (x, y) => {
      const fine = tileNoise2(21, x / 0.5, y / 0.5, P / 0.5);
      const streak = tileNoise2(22, x / 2, y / 0.64, P / 2, P / 0.64);
      let a = 0;
      switch (pen) {
        case "ballpoint":
          // Tiny skips and a faint grain where the ball rolls unevenly.
          a = Math.max(0, fine - 0.35) * 170 + Math.max(0, streak - 0.55) * 120;
          break;
        case "gel":
          a = Math.max(0, fine - 0.7) * 60;
          break;
        case "fountain":
          a = Math.max(0, streak - 0.2) * 55;
          break;
        case "pencil": {
          const tooth = tileNoise2(23, x / 0.8, y / 2.56, P / 0.8, P / 2.56);
          a = 70 + Math.max(0, fine) * 150 + Math.max(0, tooth) * 90;
          break;
        }
        case "marker":
          a = Math.max(0, streak - 0.6) * 40;
          break;
      }
      return [0, Math.max(0, Math.min(255, a))];
    });
  });
}

/** Large, soft variations in paper tone, drawn stretched over the page. */
export function toneMap(create: SurfaceFactory, seed: number, aged: boolean): Surface {
  return memo(`tone:${seed}:${aged}`, () => {
    const w = 42;
    const h = 60;
    const s = create(w, h);
    const ctx = context(s);
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n = noise2(seed, x / 9, y / 9) * 0.6 + noise2(seed + 1, x / 3, y / 3) * 0.4;
        // Aged paper darkens toward its edges.
        const ex = Math.min(x, w - 1 - x) / w;
        const ey = Math.min(y, h - 1 - y) / h;
        const edge = aged ? Math.max(0, 0.12 - Math.min(ex, ey)) * 260 : 0;
        const v = 255 - Math.max(0, n) * (aged ? 22 : 9) - edge;
        const i = (y * w + x) * 4;
        d[i] = v;
        d[i + 1] = v - (aged ? edge * 0.15 : 0);
        d[i + 2] = v - (aged ? edge * 0.5 + 6 : 0);
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return s;
  });
}
