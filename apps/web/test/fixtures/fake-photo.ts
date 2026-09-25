import { join } from "node:path";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { homography, project } from "@/myhand/capture";
import { CELLS, PAGE, cellBox, drawTemplate, type Ctx2D } from "@/myhand/template";

const PX = 8; // template pixels per mm
export const PHOTO = { width: 2000, height: 2800 };

let registered = false;

/**
 * A filled-in template written in the Caveat font, "photographed" at an angle
 * in perspective, under uneven light, with sensor noise. Optionally upside down.
 */
export function fakeTemplatePhoto(rotate180 = false): Uint8ClampedArray {
  if (!registered) {
    GlobalFonts.registerFromPath(join(import.meta.dirname, "../../../../assets/fonts/caveat/Caveat[wght].ttf"), "Caveat");
    registered = true;
  }
  const page = createCanvas(PAGE.width * PX, PAGE.height * PX);
  const ctx = page.getContext("2d");
  drawTemplate(ctx as unknown as Ctx2D, PX);
  ctx.fillStyle = "#1d2b7a";
  ctx.font = `${7 * PX}px Caveat`;
  ctx.textBaseline = "alphabetic";
  CELLS.forEach((char, i) => {
    const c = cellBox(i);
    ctx.save();
    ctx.translate((c.x + 4) * PX, c.baseline * PX);
    ctx.rotate(((i % 5) - 2) * 0.02);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });
  const src = ctx.getImageData(0, 0, page.width, page.height).data;

  // Where the page's corners land in the photo: tilted and in perspective.
  const quad: [number, number][] = [
    [190, 240],
    [1820, 150],
    [1900, 2660],
    [110, 2560],
  ];
  const corners: [number, number][] = [
    [0, 0],
    [page.width, 0],
    [page.width, page.height],
    [0, page.height],
  ];
  const back = homography(quad, corners);
  const out = new Uint8ClampedArray(PHOTO.width * PHOTO.height * 4);
  let seed = 7;
  const noise = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff - 0.5) * 14;
  for (let y = 0; y < PHOTO.height; y++) {
    for (let x = 0; x < PHOTO.width; x++) {
      const [u, v] = project(back, x + 0.5, y + 0.5);
      const light = 0.78 + 0.22 * (x / PHOTO.width) * (1 - y / PHOTO.height / 2);
      const o = (y * PHOTO.width + x) * 4;
      if (u >= 0 && v >= 0 && u < page.width && v < page.height) {
        const i = (Math.floor(v) * page.width + Math.floor(u)) * 4;
        for (let k = 0; k < 3; k++) out[o + k] = src[i + k]! * light + noise();
      } else {
        for (let k = 0; k < 3; k++) out[o + k] = 90 + noise();
      }
      out[o + 3] = 255;
    }
  }
  if (rotate180) {
    const flipped = new Uint8ClampedArray(out.length);
    const n = PHOTO.width * PHOTO.height;
    for (let i = 0; i < n; i++) flipped.set(out.subarray(i * 4, i * 4 + 4), (n - 1 - i) * 4);
    return flipped;
  }
  return out;
}
