/**
 * Copies handwriting fonts from assets/fonts to public/hands/<style id>.ttf and
 * renders a specimen image per style and paper into public/specimens/.
 *
 * Every font is openly licensed and published elsewhere, so Pro fonts are not
 * hidden: Pro is enforced when exporting, and anyone can preview any style.
 *
 * Runs before `next dev` and `next build`. Skips work that is already done.
 */
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PAPERS, PENS, STYLES } from "@truehand/catalog";

const app = join(import.meta.dirname, "..");
const assets = join(app, "..", "..", "assets", "fonts");

async function newer(src: string, dest: string) {
  try {
    const [a, b] = await Promise.all([stat(src), stat(dest)]);
    return a.mtimeMs > b.mtimeMs;
  } catch {
    return true;
  }
}

async function syncFonts() {
  await mkdir(join(app, "public", "hands"), { recursive: true });
  let copied = 0;
  for (const s of STYLES) {
    const src = join(assets, s.font.dir, s.font.file);
    const dest = join(app, "public", "hands", `${s.id}.ttf`);
    if (await newer(src, dest)) {
      await copyFile(src, dest);
      copied++;
    }
  }
  console.log(`hands: ${copied} copied, ${STYLES.length - copied} up to date`);
}

async function renderSpecimens() {
  // Rendering needs the native canvas; skip gracefully where it is unavailable.
  let canvas: typeof import("@napi-rs/canvas");
  try {
    canvas = await import("@napi-rs/canvas");
  } catch {
    console.warn("specimens: @napi-rs/canvas unavailable, skipped");
    return;
  }
  const { createFontSource, layoutDocument } = await import("@truehand/engine");
  const { renderPage, renderInk } = await import("@truehand/engine/render");
  const { specimenJobs } = await import("../src/lib/specimens");
  const out = join(app, "public", "specimens");
  await mkdir(out, { recursive: true });
  const create = (w: number, h: number) => canvas.createCanvas(w, h) as never;

  const version = JSON.stringify({ STYLES, PAPERS, PENS, jobs: specimenJobs().map((j) => j.name) });
  const stamp = join(out, ".stamp");
  const previous = await readFile(stamp, "utf8").catch(() => "");
  const engineStamp = (await stat(join(app, "..", "..", "packages", "engine", "src"))).mtimeMs;
  if (previous === `${engineStamp}:${version.length}:${hashOf(version)}`) {
    console.log("specimens: up to date");
    return;
  }

  const sources = new Map<string, Awaited<ReturnType<typeof createFontSource>>>();
  let n = 0;
  for (const job of specimenJobs()) {
    const entry = STYLES.find((s) => s.id === job.style)!;
    let src = sources.get(entry.id);
    if (!src) {
      src = await createFontSource(entry.id, await readFile(join(assets, entry.font.dir, entry.font.file)));
      sources.set(entry.id, src);
    }
    const layout = layoutDocument(job.doc, { id: entry.id, sources: [src], connected: entry.connected, ...entry.tune });
    const page = (
      job.inkOnly
        ? renderInk(layout.pages[0]!, { scale: job.scale, pen: job.doc.pen, createSurface: create })
        : renderPage(layout.pages[0]!, {
            scale: job.scale,
            paper: job.doc.paper,
            pen: job.doc.pen,
            effect: job.effect ?? "none",
            seed: job.doc.realism.seed,
            createSurface: create,
          })
    ) as unknown as InstanceType<typeof canvas.Canvas>;
    const [x, y, w, h] = job.crop.map((v) => Math.round(v * job.scale)) as [number, number, number, number];
    const cropped = canvas.createCanvas(w, h);
    cropped.getContext("2d").drawImage(page, x, y, w, h, 0, 0, w, h);
    await writeFile(join(out, `${job.name}.webp`), await cropped.encode("webp", 82));
    n++;
  }
  await writeFile(stamp, `${engineStamp}:${version.length}:${hashOf(version)}`);
  console.log(`specimens: ${n} rendered`);
}

function hashOf(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

await syncFonts();
await renderSpecimens();
