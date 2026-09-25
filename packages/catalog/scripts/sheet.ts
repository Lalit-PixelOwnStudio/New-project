/**
 * Contact sheets of every handwriting style on the same page, used to calibrate
 * each style's size and weight. Output: packages/catalog/sheets/.
 */
import { createCanvas } from "@napi-rs/canvas";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createFontSource, layoutDocument, type HandStyle } from "@truehand/engine";
import { renderPage, type SurfaceFactory } from "@truehand/engine/render";
import { PAPERS, PENS, STYLES } from "../src/index";

const root = join(import.meta.dirname, "..", "..", "..");
const out = join(import.meta.dirname, "..", "sheets");
mkdirSync(out, { recursive: true });
const create: SurfaceFactory = (w, h) => createCanvas(w, h) as unknown as ReturnType<SurfaceFactory>;

const paper = { ...PAPERS[0]!.spec, size: "a4" as const, holes: "none" as const };
const pen = PENS[0]!.spec;
const scale = 1.3;
const cropY = 88 * scale;
const cropH = 150 * scale;
const cropW = 560 * scale;
const perSheet = 8;
const only = process.argv.slice(2);
const list = STYLES.filter((s) => !only.length || only.includes(s.id));

for (let sheet = 0; sheet * perSheet < list.length; sheet++) {
  const chunk = list.slice(sheet * perSheet, (sheet + 1) * perSheet);
  const canvas = createCanvas(Math.round(cropW), Math.round(cropH * chunk.length));
  const ctx = canvas.getContext("2d");
  for (const [i, entry] of chunk.entries()) {
    const src = await createFontSource(entry.id, readFileSync(join(root, "assets/fonts", entry.font.dir, entry.font.file)));
    const style: HandStyle = { id: entry.id, sources: [src], connected: entry.connected, ...entry.tune };
    const layout = layoutDocument(
      {
        text: `${entry.name} — The quick brown fox jumps over the lazy dog. Photosynthesis turns light into chemical energy, 1234567890.\nSphinx of black quartz, judge my vow. Hey Kid? (It's 42%!)`,
        paper,
        pen,
        realism: { seed: 3, messiness: 0.35, slant: 0, fatigue: 0 },
        layout: { size: 1, letterSpacing: 0, wordSpacing: 1, indentMm: 0, paragraphGap: 0, underlineHeadings: false },
      },
      style,
    );
    const page = renderPage(layout.pages[0]!, { scale, paper, pen, effect: "none", seed: 3, createSurface: create });
    ctx.drawImage(page as never, 60 * scale, cropY, cropW, cropH, 0, i * cropH, cropW, cropH);
    ctx.fillStyle = "#c00";
    ctx.font = "13px sans-serif";
    ctx.fillText(`${entry.id} xh=${src.xHeight} cap=${src.capHeight} upem=${src.upem} ${entry.tier}`, 6, i * cropH + 14);
  }
  writeFileSync(join(out, `sheet-${sheet}.png`), canvas.toBuffer("image/png"));
}
console.log("done");
