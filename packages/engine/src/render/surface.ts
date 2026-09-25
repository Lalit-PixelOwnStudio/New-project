/**
 * The renderer draws through the standard Canvas 2D API so the same code runs
 * on an OffscreenCanvas in a Web Worker, an HTMLCanvasElement, or a Node canvas
 * (for tests, OG images and the API).
 */
export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface Surface {
  width: number;
  height: number;
  getContext(type: "2d"): Ctx2D | null;
}

export type SurfaceFactory = (width: number, height: number) => Surface;

export function context(surface: Surface): Ctx2D {
  const ctx = surface.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  return ctx;
}

/** Canvas image sources differ by environment; every Surface can be drawn. */
export type Drawable = CanvasImageSource;
export const asImage = (s: Surface) => s as unknown as Drawable;
