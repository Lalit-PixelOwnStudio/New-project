/**
 * Visual QA: renders sample documents to PNG so changes to the engine can be
 * reviewed by eye. Output goes to packages/engine/qa-out/.
 *
 *   pnpm --filter @truehand/engine qa [style ...]
 */
import { createCanvas } from "@napi-rs/canvas";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createFontSource, layoutDocument, type DocumentSpec, type HandStyle, type PaperSpec, type PenSpec } from "../src/index";
import { renderPage, type Effect, type SurfaceFactory } from "../src/render/index";

const root = join(import.meta.dirname, "..", "..", "..");
const out = join(import.meta.dirname, "..", "qa-out");
mkdirSync(out, { recursive: true });

const create: SurfaceFactory = (w, h) => createCanvas(w, h) as unknown as ReturnType<SurfaceFactory>;

async function style(dir: string, file: string, opts: Partial<HandStyle> = {}): Promise<HandStyle> {
  const src = await createFontSource(dir, readFileSync(join(root, "assets/fonts", dir, file)));
  return { id: dir, sources: [src], connected: false, sizeAdjust: 1, slant: 0, weight: 1, tracking: 0, wordSpace: 1, baselineShift: 0, ...opts };
}

const college: PaperSpec = {
  size: "a4",
  ruling: "ruled",
  spacingMm: 7.1,
  paperColor: "#fbfaf6",
  lineColor: "#9fb7d9",
  marginLine: { xMm: 31, color: "#e0677a" },
  headRule: null,
  cornell: null,
  texture: "smooth",
  holes: "three",
  margins: { topMm: 32, bottomMm: 12, leftMm: 12, rightMm: 9 },
};

const text = `# Photosynthesis
Photosynthesis is the process by which green plants use __sunlight, water and carbon dioxide__ to make glucose. Oxygen is released as a by-product, which is why forests are often called the lungs of the planet.
It happens mainly in the ==chloroplasts== of leaf cells, where chlorophyll absorbs red and blue light and reflects green.

## Two stages
- Light-dependent reactions split water and store energy in ATP and NADPH.
- The Calvin cycle uses that energy to fix CO2 into sugar. It does ~~not~~ need light directly.

The overall equation is 6CO2 + 6H2O → C6H12O6 + 6O2. Without it, almost every food chain on Earth would collapse within weeks, so the next time you eat an apple, thank a leaf.`;

const pens: Record<string, PenSpec> = {
  ballpoint: { kind: "ballpoint", color: "#1d3a8f", width: 0.35 },
  gel: { kind: "gel", color: "#101318", width: 0.45 },
  pencil: { kind: "pencil", color: "#4a4a4f", width: 0.4 },
  fountain: { kind: "fountain", color: "#1b2a55", width: 0.3 },
};

function doc(paper: PaperSpec, pen: PenSpec, messiness: number): DocumentSpec {
  return {
    text,
    paper,
    pen,
    realism: { seed: 7, messiness, slant: 0, fatigue: 0.5 },
    layout: { size: 1, letterSpacing: 0, wordSpacing: 1, indentMm: 0, paragraphGap: 0, underlineHeadings: true },
    header: { right: "25 Sep 2026", pageNumbers: true },
  };
}

async function render(name: string, s: HandStyle, d: DocumentSpec, effect: Effect = "none", scale = 1.5) {
  const t0 = performance.now();
  const layout = layoutDocument(d, s);
  const t1 = performance.now();
  const surface = renderPage(layout.pages[0]!, { scale, paper: d.paper, pen: d.pen, effect, seed: 7, createSurface: create });
  const t2 = performance.now();
  const buf = (surface as unknown as { toBuffer(t: string): Buffer }).toBuffer("image/png");
  writeFileSync(join(out, `${name}.png`), buf);
  console.log(
    `${name.padEnd(28)} layout ${(t1 - t0).toFixed(0)}ms render ${(t2 - t1).toFixed(0)}ms pages=${layout.stats.pages} missing=${layout.stats.missing.map((c) => String.fromCodePoint(c)).join("")}`,
  );
}

const styles: Record<string, () => Promise<HandStyle>> = {
  caveat: () => style("caveat", "Caveat[wght].ttf", { sizeAdjust: 1.05 }),
  nothingyoucoulddo: () => style("nothingyoucoulddo", "NothingYouCouldDo.ttf", { sizeAdjust: 0.95 }),
  homemadeapple: () => style("homemadeapple", "HomemadeApple-Regular.ttf", { connected: true, sizeAdjust: 0.8, weight: 0.8 }),
  reeniebeanie: () => style("reeniebeanie", "ReenieBeanie.ttf", { sizeAdjust: 1.1 }),
};

const only = process.argv.slice(2);
for (const [name, make] of Object.entries(styles)) {
  if (only.length && !only.includes(name)) continue;
  const s = await make();
  await render(`${name}-ballpoint`, s, doc(college, pens.ballpoint!, 0.35));
}
if (!only.length) {
  const s = await styles.caveat!();
  await render("caveat-messy-gel", s, doc(college, pens.gel!, 0.9));
  await render(
    "caveat-pencil-grid",
    s,
    doc({ ...college, ruling: "grid", spacingMm: 5, lineColor: "#a9c4b8", marginLine: null, holes: "none" }, pens.pencil!, 0.4),
  );
  await render("caveat-scan", s, doc(college, pens.ballpoint!, 0.4), "scan");
  await render("caveat-photo", s, doc(college, pens.fountain!, 0.4), "photo");
}
