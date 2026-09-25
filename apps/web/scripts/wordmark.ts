/**
 * Writes the Truehand wordmark with the engine itself and saves it as SVG:
 * the logo is real output of the product, not a drawing of it.
 *
 *   tsx scripts/wordmark.ts [styleId] [seed]
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { STYLES } from "@truehand/catalog";
import { createFontSource, layoutDocument, type InkItem } from "@truehand/engine";

const app = join(import.meta.dirname, "..");
const assets = join(app, "..", "..", "assets", "fonts");

export async function wordmarkSvg(styleId: string, seed: number, text = "Truehand", color = "#0f1115", underline = false) {
  const entry = STYLES.find((s) => s.id === styleId)!;
  const src = await createFontSource(entry.id, await readFile(join(assets, entry.font.dir, entry.font.file)));
  const layout = layoutDocument(
    {
      text: underline ? `__${text}__` : text,
      paper: {
        size: "a4",
        ruling: "plain",
        spacingMm: 20,
        paperColor: "#fff",
        lineColor: "#fff",
        marginLine: null,
        texture: "smooth",
        holes: "none",
        margins: { topMm: 30, bottomMm: 10, leftMm: 10, rightMm: 10 },
      },
      pen: { kind: "gel", color, width: 0.5 },
      realism: { seed, messiness: 0.15, slant: 0, fatigue: 0 },
      layout: { size: 1, letterSpacing: 0, wordSpacing: 1, indentMm: 0, paragraphGap: 0, underlineHeadings: false },
    },
    { id: entry.id, sources: [src], connected: entry.connected, ...entry.tune },
  );
  const items = layout.pages[0]!.ink as InkItem[];
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const grow = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };
  const paths: string[] = [];
  for (const item of items) {
    if (item.kind === "fill") {
      let d = "";
      for (const c of item.contours) {
        d += `M${c[0]!.toFixed(2)} ${c[1]!.toFixed(2)}`;
        for (let i = 2; i < c.length; i += 2) {
          d += `L${c[i]!.toFixed(2)} ${c[i + 1]!.toFixed(2)}`;
          grow(c[i]!, c[i + 1]!);
        }
        d += "Z";
      }
      paths.push(`<path d="${d}" fill="${color}" stroke="${color}" stroke-width="${(item.weight + 0.35).toFixed(2)}" stroke-linejoin="round"/>`);
    } else {
      const p = item.points;
      let d = `M${p[0]!.toFixed(2)} ${p[1]!.toFixed(2)}`;
      for (let i = 2; i < p.length; i += 2) {
        d += `L${p[i]!.toFixed(2)} ${p[i + 1]!.toFixed(2)}`;
        grow(p[i]!, p[i + 1]!);
      }
      paths.push(
        `<path d="${d}" fill="none" stroke="${color}" stroke-width="${(item.width * 1.1).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`,
      );
    }
  }
  const pad = 3;
  const vb = `${(minX - pad).toFixed(1)} ${(minY - pad).toFixed(1)} ${(maxX - minX + pad * 2).toFixed(1)} ${(maxY - minY + pad * 2).toFixed(1)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${text}">${paths.join("")}</svg>`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [style = "celeste", seed = "3"] = process.argv.slice(2);
  await mkdir(join(app, "public", "brand"), { recursive: true });
  const svg = await wordmarkSvg(style, Number(seed));
  await writeFile(join(app, "public", "brand", `wordmark-${style}-${seed}.svg`), svg);
  console.log("written", style, seed, svg.length);
}
