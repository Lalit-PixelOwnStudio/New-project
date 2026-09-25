import { PX_PER_MM } from "../layout/paper";
import { hash } from "../math/random";
import type { PaperGeometry, PaperSpec } from "../types";
import { css, parseColor, shade } from "./color";
import { asImage, type Ctx2D, type SurfaceFactory } from "./surface";
import { paperTile, toneMap } from "./textures";

/** Printed rule thickness in CSS px (about 0.14 mm). */
const RULE = 0.52;

export function drawPaper(ctx: Ctx2D, spec: PaperSpec, geo: PaperGeometry, scale: number, seed: number, create: SurfaceFactory) {
  const W = geo.widthPx;
  const H = geo.heightPx;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = spec.paperColor;
  ctx.fillRect(0, 0, Math.ceil(W * scale), Math.ceil(H * scale));

  ctx.globalCompositeOperation = "multiply";
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(asImage(toneMap(create, hash(seed, 3), spec.texture === "aged")), 0, 0, W * scale, H * scale);
  const tooth = ctx.createPattern(asImage(paperTile(create, scale, spec.texture)), "repeat");
  if (tooth) {
    ctx.fillStyle = tooth;
    ctx.fillRect(0, 0, W * scale, H * scale);
  }

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const line = parseColor(spec.lineColor);
  ctx.lineCap = "butt";

  if (spec.ruling === "ruled") {
    ctx.strokeStyle = css(line, 0.9);
    ctx.lineWidth = RULE;
    ctx.beginPath();
    for (const y of geo.rules) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
    if (spec.headRule && geo.rules.length) {
      const y = geo.rules[0]! - geo.spacingPx;
      ctx.strokeStyle = css(parseColor(spec.headRule.color), 0.9);
      ctx.lineWidth = RULE * 1.6;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.moveTo(0, y - 1.6);
      ctx.lineTo(W, y - 1.6);
      ctx.stroke();
    }
  } else if (spec.ruling === "grid" || spec.ruling === "dot") {
    const cell = spec.spacingMm * PX_PER_MM;
    const offsetX = (((W % cell) + cell) / 2) % cell;
    const offsetY = geo.rules[0] ?? 0;
    if (spec.ruling === "grid") {
      ctx.strokeStyle = css(line, 0.55);
      ctx.lineWidth = RULE * 0.85;
      ctx.beginPath();
      for (let x = offsetX; x <= W; x += cell) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (const y of geo.rules) {
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();
    } else {
      ctx.fillStyle = css(line, 0.8);
      ctx.beginPath();
      for (let y = offsetY; y <= H; y += cell) {
        for (let x = offsetX; x <= W; x += cell) {
          ctx.moveTo(x + 0.55, y);
          ctx.arc(x, y, 0.55, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }
  }

  if (spec.marginLine && geo.marginX !== null) {
    ctx.strokeStyle = css(parseColor(spec.marginLine.color), 0.85);
    ctx.lineWidth = RULE * 1.25;
    ctx.beginPath();
    ctx.moveTo(geo.marginX, 0);
    ctx.lineTo(geo.marginX, H);
    if (spec.marginLine.double) {
      ctx.moveTo(geo.marginX - 1.2 * PX_PER_MM, 0);
      ctx.lineTo(geo.marginX - 1.2 * PX_PER_MM, H);
    }
    ctx.stroke();
  }

  if (spec.cornell && geo.cornell) {
    ctx.strokeStyle = css(parseColor(spec.cornell.color), 0.85);
    ctx.lineWidth = RULE * 1.4;
    ctx.beginPath();
    const top = (geo.rules[0] ?? geo.baselines[0] ?? 0) - geo.spacingPx;
    ctx.moveTo(geo.cornell.cueX, Math.max(0, top));
    ctx.lineTo(geo.cornell.cueX, geo.cornell.summaryY);
    ctx.moveTo(0, geo.cornell.summaryY);
    ctx.lineTo(W, geo.cornell.summaryY);
    ctx.stroke();
  }

  if (spec.holes !== "none") drawHoles(ctx, spec, W, H);
  ctx.restore();
}

/** Punched holes show the page underneath, with a soft shadow on one side. */
function drawHoles(ctx: Ctx2D, spec: PaperSpec, _W: number, H: number) {
  const r = 3 * PX_PER_MM;
  const x = 10 * PX_PER_MM;
  const gap = (spec.holes === "three" ? 108 : 80) * PX_PER_MM;
  const ys = spec.holes === "three" ? [H / 2 - gap, H / 2, H / 2 + gap] : [H / 2 - gap / 2, H / 2 + gap / 2];
  const under = shade(parseColor(spec.paperColor), -0.25);
  for (const y of ys) {
    const g = ctx.createRadialGradient(x + r * 0.35, y + r * 0.3, r * 0.2, x, y, r);
    g.addColorStop(0, css(under));
    g.addColorStop(0.75, css(shade(under, -0.4)));
    g.addColorStop(1, css(shade(under, -1.4)));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}
