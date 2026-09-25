import { describe, expect, it } from "vitest";
import { flatten, outlineBounds, parseSvgPath } from "../src/path/outline";

describe("flatten", () => {
  it("flattens curves within tolerance", () => {
    // A quarter circle approximated by a cubic; every flattened point stays near radius 100.
    const k = 0.5523 * 100;
    const out = flatten(parseSvgPath(`M100 0 C100 ${k} ${k} 100 0 100 L0 0 Z`), 0.25);
    expect(out).toHaveLength(1);
    const pts = out[0]!;
    for (let i = 2; i < pts.length - 2; i += 2) {
      const r = Math.hypot(pts[i]!, pts[i + 1]!);
      if (r > 1) expect(Math.abs(r - 100)).toBeLessThan(0.5);
    }
    expect(outlineBounds(out)).toMatchObject({ minX: 0, minY: 0 });
  });
});
