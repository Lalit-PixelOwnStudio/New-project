import { describe, expect, it } from "vitest";
import { gaussian, hash, hashString, rand } from "../src/math/random";
import { noise2, tileNoise2 } from "../src/math/noise";

describe("random", () => {
  it("is deterministic and key-sensitive", () => {
    expect(hash(1, 2, 3)).toBe(hash(1, 2, 3));
    expect(hash(1, 2, 3)).not.toBe(hash(1, 3, 2));
    expect(hashString("word")).toBe(hashString("word"));
  });

  it("produces uniform-ish values in range", () => {
    let sum = 0;
    for (let i = 0; i < 20000; i++) {
      const r = rand(9, i);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
      sum += r;
    }
    expect(sum / 20000).toBeCloseTo(0.5, 1);
  });

  it("clamps gaussian outliers", () => {
    for (let i = 0; i < 5000; i++) expect(Math.abs(gaussian(3, i))).toBeLessThanOrEqual(3);
  });
});

describe("noise", () => {
  it("is continuous", () => {
    const a = noise2(1, 3.2, 4.7);
    const b = noise2(1, 3.2001, 4.7);
    expect(Math.abs(a - b)).toBeLessThan(0.01);
  });

  it("tiles seamlessly", () => {
    for (const [x, y] of [[0.3, 0.9], [5.5, 2.25], [9.1, 7.7]] as const) {
      expect(tileNoise2(4, x, y, 16)).toBeCloseTo(tileNoise2(4, x + 16, y + 32, 16), 6);
    }
  });
});
