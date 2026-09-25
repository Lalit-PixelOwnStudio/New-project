import type { Highlight, InkItem, PenKind, PenSpec } from "../types";
import { css, parseColor, shade } from "./color";
import type { Ctx2D, SurfaceFactory } from "./surface";
import { asImage } from "./surface";
import { inkTile } from "./textures";

interface PenBehaviour {
  /** Multiplies each item's alpha. */
  opacity: number;
  /** Extra stroke width in CSS px on top of the style's weight. */
  body: number;
  /** Feathering blur in CSS px when the ink is laid on paper (0 = none). */
  bleed: number;
}

const PENS: Record<PenKind, PenBehaviour> = {
  ballpoint: { opacity: 0.93, body: 0.1, bleed: 0 },
  gel: { opacity: 0.98, body: 0.35, bleed: 0.12 },
  fountain: { opacity: 0.88, body: 0.25, bleed: 0.3 },
  pencil: { opacity: 0.72, body: 0.05, bleed: 0 },
  marker: { opacity: 0.96, body: 1.1, bleed: 0.35 },
};

function pathOf(ctx: Ctx2D, contours: Float32Array[]) {
  ctx.beginPath();
  for (const c of contours) {
    ctx.moveTo(c[0]!, c[1]!);
    for (let i = 2; i < c.length; i += 2) ctx.lineTo(c[i]!, c[i + 1]!);
    ctx.closePath();
  }
}

/** Draws highlighter bands straight onto the paper, under the ink. */
export function drawHighlights(ctx: Ctx2D, items: Highlight[], scale: number) {
  if (!items.length) return;
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.globalCompositeOperation = "multiply";
  for (const h of items) {
    ctx.fillStyle = css(parseColor(h.color), 0.62);
    ctx.beginPath();
    const p = h.polygon;
    ctx.moveTo(p[0]!, p[1]!);
    for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i]!, p[i + 1]!);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** Renders ink items onto a transparent layer, then erodes it with the pen's texture. */
export function drawInkLayer(ctx: Ctx2D, items: InkItem[], pen: PenSpec, scale: number, create: SurfaceFactory) {
  const behaviour = PENS[pen.kind];
  const base = parseColor(pen.color);
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (const item of items) {
    const color = css(shade(base, item.tone));
    ctx.globalAlpha = Math.min(1, item.alpha * behaviour.opacity);
    if (item.kind === "fill") {
      pathOf(ctx, item.contours);
      ctx.fillStyle = color;
      ctx.fill("nonzero");
      const w = item.weight + behaviour.body;
      if (w > 0.02) {
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = item.width + behaviour.body * 0.5;
      ctx.beginPath();
      const p = item.points;
      ctx.moveTo(p[0]!, p[1]!);
      for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i]!, p[i + 1]!);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const texture = ctx.createPattern(asImage(inkTile(create, scale, pen.kind)), "repeat");
  if (texture) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = texture;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  ctx.restore();
}

export function penBleed(pen: PenSpec): number {
  return PENS[pen.kind].bleed;
}
