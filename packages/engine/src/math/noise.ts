import { hash } from "./random";

/**
 * Seeded 2D gradient (Perlin-style) noise. Gradients come from the integer hash,
 * so there is no permutation table to allocate per seed. Output is roughly in
 * [-1, 1] and is continuous, which is what keeps warped cursive joins connected.
 */

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function grad(seed: number, ix: number, iy: number, dx: number, dy: number): number {
  const a = (hash(seed, ix, iy) / 4294967296) * Math.PI * 2;
  return Math.cos(a) * dx + Math.sin(a) * dy;
}

export function noise2(seed: number, x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const u = fade(fx);
  const v = fade(fy);
  const n00 = grad(seed, x0, y0, fx, fy);
  const n10 = grad(seed, x0 + 1, y0, fx - 1, fy);
  const n01 = grad(seed, x0, y0 + 1, fx, fy - 1);
  const n11 = grad(seed, x0 + 1, y0 + 1, fx - 1, fy - 1);
  const nx0 = n00 + u * (n10 - n00);
  const nx1 = n01 + u * (n11 - n01);
  // Perlin gradient noise peaks near ±0.7; rescale to use the full range.
  return (nx0 + v * (nx1 - nx0)) * 1.41;
}

/**
 * Noise whose lattice repeats every `period` cells in both axes, so tiles built
 * from it repeat without seams.
 */
export function tileNoise2(seed: number, x: number, y: number, periodX: number, periodY = periodX): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const u = fade(fx);
  const v = fade(fy);
  const px = Math.max(1, Math.round(periodX));
  const py = Math.max(1, Math.round(periodY));
  const wx = (i: number) => ((i % px) + px) % px;
  const wy = (i: number) => ((i % py) + py) % py;
  const n00 = grad(seed, wx(x0), wy(y0), fx, fy);
  const n10 = grad(seed, wx(x0 + 1), wy(y0), fx - 1, fy);
  const n01 = grad(seed, wx(x0), wy(y0 + 1), fx, fy - 1);
  const n11 = grad(seed, wx(x0 + 1), wy(y0 + 1), fx - 1, fy - 1);
  const nx0 = n00 + u * (n10 - n00);
  const nx1 = n01 + u * (n11 - n01);
  return (nx0 + v * (nx1 - nx0)) * 1.41;
}

export function noise1(seed: number, x: number): number {
  return noise2(seed, x, 0.5);
}

/** Fractal sum of octaves; still roughly in [-1, 1]. */
export function fbm2(seed: number, x: number, y: number, octaves = 3): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let f = 1;
  for (let o = 0; o < octaves; o++) {
    sum += noise2(seed + o * 7919, x * f, y * f) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}
