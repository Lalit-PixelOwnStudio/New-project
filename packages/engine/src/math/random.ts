/**
 * Deterministic, order-independent randomness.
 *
 * Every random decision in the engine is a pure function of `(seed, ...keys)`.
 * Keys are small integers (indices, hashed strings). Because nothing depends on
 * how many random numbers were drawn before, editing one paragraph never
 * reshuffles the handwriting of another.
 */

function mix(h: number, k: number): number {
  k = Math.imul(k, 0xcc9e2d51);
  k = (k << 15) | (k >>> 17);
  k = Math.imul(k, 0x1b873593);
  h ^= k;
  h = (h << 13) | (h >>> 19);
  return (Math.imul(h, 5) + 0xe6546b64) | 0;
}

function finalize(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** 32-bit hash of a list of integers. */
export function hash(...keys: number[]): number {
  let h = 0x9747b28c;
  for (const k of keys) h = mix(h, k | 0);
  return finalize(h ^ keys.length);
}

/** 32-bit FNV-1a hash of a string, suitable as a key for {@link hash}. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Uniform number in [0, 1). */
export function rand(...keys: number[]): number {
  return hash(...keys) / 4294967296;
}

/** Uniform number in [-1, 1). */
export function signed(...keys: number[]): number {
  return rand(...keys) * 2 - 1;
}

/**
 * Approximately normal number with mean 0 and standard deviation 1, clamped to
 * ±3σ so that a single outlier can never throw a glyph off the page.
 */
export function gaussian(...keys: number[]): number {
  const u = Math.max(rand(...keys, 0x51ed), 1e-9);
  const v = rand(...keys, 0x2f7a);
  const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(-3, Math.min(3, n));
}

/** Small sequential generator for places where a stream is more convenient. */
export class Stream {
  private i = 0;
  private readonly keys: number[];
  constructor(...keys: number[]) {
    this.keys = keys;
  }
  next(): number {
    return rand(...this.keys, this.i++);
  }
  signed(): number {
    return this.next() * 2 - 1;
  }
  gaussian(): number {
    return gaussian(...this.keys, this.i++);
  }
}
