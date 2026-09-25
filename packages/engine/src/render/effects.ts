import { gaussian, hash, rand } from "../math/random";
import { asImage, context, type Ctx2D, type Surface, type SurfaceFactory } from "./surface";

export type Effect = "none" | "scan" | "photo";

type Point = { x: number; y: number };

/** Draws the source triangle s0-s1-s2 of `img` into the destination triangle d0-d1-d2. */
function drawTriangle(ctx: Ctx2D, img: CanvasImageSource, s: Point[], d: Point[]) {
  const [s0, s1, s2] = s as [Point, Point, Point];
  const [d0, d1, d2] = d as [Point, Point, Point];
  const ux = s1.x - s0.x;
  const uy = s1.y - s0.y;
  const vx = s2.x - s0.x;
  const vy = s2.y - s0.y;
  const det = ux * vy - vx * uy;
  if (Math.abs(det) < 1e-9) return;
  const px = d1.x - d0.x;
  const py = d1.y - d0.y;
  const qx = d2.x - d0.x;
  const qy = d2.y - d0.y;
  const a = (px * vy - qx * uy) / det;
  const c = (-px * vx + qx * ux) / det;
  const b = (py * vy - qy * uy) / det;
  const dd = (-py * vx + qy * ux) / det;
  const e = d0.x - (a * s0.x + c * s0.y);
  const f = d0.y - (b * s0.x + dd * s0.y);

  // Grow the clip a little around the centroid so neighbouring triangles overlap
  // and no hairline seams show.
  const cx = (d0.x + d1.x + d2.x) / 3;
  const cy = (d0.y + d1.y + d2.y) / 3;
  const grow = (p: Point) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / len) * 0.8, y: p.y + (dy / len) * 0.8 };
  };
  const g0 = grow(d0);
  const g1 = grow(d1);
  const g2 = grow(d2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(g0.x, g0.y);
  ctx.lineTo(g1.x, g1.y);
  ctx.lineTo(g2.x, g2.y);
  ctx.closePath();
  ctx.clip();
  ctx.setTransform(a, b, c, dd, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

/** Maps the whole source image onto an arbitrary quad with a triangle mesh. */
function drawQuad(ctx: Ctx2D, src: Surface, quad: [Point, Point, Point, Point], cols = 10, rows = 14) {
  const [tl, tr, br, bl] = quad;
  const at = (u: number, v: number): Point => ({
    x: (1 - v) * ((1 - u) * tl.x + u * tr.x) + v * ((1 - u) * bl.x + u * br.x),
    y: (1 - v) * ((1 - u) * tl.y + u * tr.y) + v * ((1 - u) * bl.y + u * br.y),
  });
  const img = asImage(src);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const u0 = i / cols;
      const u1 = (i + 1) / cols;
      const v0 = j / rows;
      const v1 = (j + 1) / rows;
      const s00 = { x: u0 * src.width, y: v0 * src.height };
      const s10 = { x: u1 * src.width, y: v0 * src.height };
      const s01 = { x: u0 * src.width, y: v1 * src.height };
      const s11 = { x: u1 * src.width, y: v1 * src.height };
      const d00 = at(u0, v0);
      const d10 = at(u1, v0);
      const d01 = at(u0, v1);
      const d11 = at(u1, v1);
      drawTriangle(ctx, img, [s00, s10, s11], [d00, d10, d11]);
      drawTriangle(ctx, img, [s00, s11, s01], [d00, d11, d01]);
    }
  }
}

/** Per-pixel tone curve and sensor/scanner noise in one pass. */
function grade(ctx: Ctx2D, w: number, h: number, seed: number, opts: { contrast: number; lift: number; noise: number; warm: number; desaturate: number }) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const { contrast, lift, noise, warm, desaturate } = opts;
  let s = hash(seed, 77);
  for (let i = 0; i < d.length; i += 4) {
    // xorshift is plenty for grain and far cheaper than hashing every pixel.
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    const n = ((s >>> 0) / 4294967296 - 0.5) * noise;
    let r = d[i]!;
    let g = d[i + 1]!;
    let b = d[i + 2]!;
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    r = r + (l - r) * desaturate;
    g = g + (l - g) * desaturate;
    b = b + (l - b) * desaturate;
    d[i] = (r - 128) * contrast + 128 + lift + n + warm;
    d[i + 1] = (g - 128) * contrast + 128 + lift + n + warm * 0.35;
    d[i + 2] = (b - 128) * contrast + 128 + lift + n - warm * 0.6;
  }
  ctx.putImageData(img, 0, 0);
}

/** Flatbed scan: slightly skewed page, crisp contrast, a shadow along the spine edge. */
export function scanEffect(src: Surface, seed: number, create: SurfaceFactory): Surface {
  const w = src.width;
  const h = src.height;
  const out = create(w, h);
  const ctx = context(out);
  ctx.fillStyle = "#f3f3f1";
  ctx.fillRect(0, 0, w, h);
  const angle = gaussian(seed, 1) * 0.0045;
  ctx.save();
  ctx.translate(w / 2 + gaussian(seed, 2) * w * 0.002, h / 2 + gaussian(seed, 3) * h * 0.002);
  ctx.rotate(angle);
  ctx.drawImage(asImage(src), -w / 2, -h / 2);
  ctx.restore();

  const edge = ctx.createLinearGradient(0, 0, w * 0.06, 0);
  edge.addColorStop(0, "rgba(40,40,40,0.28)");
  edge.addColorStop(1, "rgba(40,40,40,0)");
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, w * 0.06, h);
  ctx.globalCompositeOperation = "source-over";

  grade(ctx, w, h, seed, { contrast: 1.07, lift: 4, noise: 7, warm: 0, desaturate: 0.12 });
  return out;
}

/**
 * Phone photo of the page on a desk: perspective, uneven light from one side,
 * a soft shadow, warm white balance and sensor noise.
 */
export function photoEffect(src: Surface, seed: number, create: SurfaceFactory): Surface {
  const w = src.width;
  const h = src.height;
  const out = create(w, h);
  const ctx = context(out);

  // Desk.
  const desk = ctx.createLinearGradient(0, 0, w, h);
  desk.addColorStop(0, "#5d544b");
  desk.addColorStop(1, "#3e3833");
  ctx.fillStyle = desk;
  ctx.fillRect(0, 0, w, h);

  const j = (k: number, amt: number) => gaussian(seed, k) * amt;
  const quad: [Point, Point, Point, Point] = [
    { x: w * (0.045 + j(1, 0.008)), y: h * (0.03 + j(2, 0.006)) },
    { x: w * (0.955 + j(3, 0.008)), y: h * (0.042 + j(4, 0.006)) },
    { x: w * (0.975 + j(5, 0.008)), y: h * (0.972 + j(6, 0.005)) },
    { x: w * (0.025 + j(7, 0.008)), y: h * (0.962 + j(8, 0.005)) },
  ];

  // Soft shadow under the sheet.
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.filter = `blur(${Math.round(w * 0.012)}px)`;
  ctx.beginPath();
  ctx.moveTo(quad[0].x + w * 0.01, quad[0].y + h * 0.012);
  ctx.lineTo(quad[1].x + w * 0.012, quad[1].y + h * 0.012);
  ctx.lineTo(quad[2].x + w * 0.014, quad[2].y + h * 0.014);
  ctx.lineTo(quad[3].x + w * 0.01, quad[3].y + h * 0.014);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawQuad(ctx, src, quad);

  // Light falls in from one corner and fades across the page.
  const lx = rand(seed, 9) > 0.5 ? w * 0.15 : w * 0.85;
  const light = ctx.createRadialGradient(lx, h * 0.1, w * 0.05, lx, h * 0.3, w * 1.25);
  light.addColorStop(0, "rgba(255,255,255,0)");
  light.addColorStop(1, "rgba(60,50,40,0.30)");
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);

  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  grade(ctx, w, h, seed, { contrast: 0.96, lift: -2, noise: 9, warm: 7, desaturate: 0 });
  return out;
}

export function applyEffect(src: Surface, effect: Effect, seed: number, create: SurfaceFactory): Surface {
  if (effect === "scan") return scanEffect(src, seed, create);
  if (effect === "photo") return photoEffect(src, seed, create);
  return src;
}
