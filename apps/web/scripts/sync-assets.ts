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
  const engineStamp = await newestMtime(join(app, "..", "..", "packages", "engine", "src"));
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

async function newestMtime(dir: string): Promise<number> {
  const { readdir } = await import("node:fs/promises");
  let newest = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    newest = Math.max(newest, entry.isDirectory() ? await newestMtime(p) : (await stat(p)).mtimeMs);
  }
  return newest;
}

function hashOf(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** x-height of each hand as a fraction of its em, so on-screen text can be sized to match. */
async function writeMetrics() {
  const { createFontSource } = await import("@truehand/engine");
  const metrics: Record<string, number> = {};
  for (const s of STYLES) {
    const src = await createFontSource(s.id, await readFile(join(assets, s.font.dir, s.font.file)));
    const visual = src.xHeight * 0.7 + src.capHeight * 0.64 * 0.3;
    metrics[s.id] = Number((visual / src.upem).toFixed(4));
  }
  const out = join(app, "src", "lib", "hand-metrics.json");
  const next = JSON.stringify(metrics, null, 2) + "\n";
  if ((await readFile(out, "utf8").catch(() => "")) !== next) await writeFile(out, next);
}

await syncFonts();
await writeMetrics();
await renderSpecimens();
