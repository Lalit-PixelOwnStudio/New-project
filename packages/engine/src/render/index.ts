import type { PageLayout, PaperSpec, PenSpec } from "../types";
import { applyEffect, type Effect } from "./effects";
import { drawHighlights, drawInkLayer, penBleed } from "./ink";
import { drawPaper } from "./paper";
import { asImage, context, type Surface, type SurfaceFactory } from "./surface";

export type { Effect } from "./effects";
export type { Ctx2D, Surface, SurfaceFactory } from "./surface";

export interface RenderOptions {
  /** Device pixels per CSS px: 1 is 96 dpi, 1.5625 is 150 dpi, 3.125 is 300 dpi. */
  scale: number;
  paper: PaperSpec;
  pen: PenSpec;
  effect: Effect;
  seed: number;
  createSurface: SurfaceFactory;
}

export const dpiToScale = (dpi: number) => dpi / 96;

/** Renders one laid-out page to a new surface. */
export function renderPage(page: PageLayout, opts: RenderOptions): Surface {
  const { scale, createSurface: create } = opts;
  const w = Math.round(page.geometry.widthPx * scale);
  const h = Math.round(page.geometry.heightPx * scale);
  const seed = (opts.seed ^ Math.imul(page.index + 1, 0x9e3779b1)) >>> 0;

  const sheet = create(w, h);
  const ctx = context(sheet);
  drawPaper(ctx, opts.paper, page.geometry, scale, seed, create);
  drawHighlights(ctx, page.highlights, scale);

  const ink = create(w, h);
  drawInkLayer(context(ink), page.ink, opts.pen, scale, create);

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  const bleed = penBleed(opts.pen);
  if (bleed > 0 && "filter" in ctx) {
    ctx.globalAlpha = 0.55;
    ctx.filter = `blur(${(bleed * scale).toFixed(2)}px)`;
    ctx.drawImage(asImage(ink), 0, 0);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
  }
  ctx.drawImage(asImage(ink), 0, 0);
  ctx.restore();

  return applyEffect(sheet, opts.effect, seed, create);
}
