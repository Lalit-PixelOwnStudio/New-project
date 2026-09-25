/** Builds the app icon: a handwritten "T" (written by the engine) on the brand blue. */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { wordmarkSvg } from "./wordmark";

const svg = await wordmarkSvg("grace", 4, "T", "#ffffff");
const vb = /viewBox="([^"]+)"/.exec(svg)![1]!.split(" ").map(Number) as [number, number, number, number];
const [x, y, w, h] = vb;
const size = Math.max(w, h) * 1.5;
const cx = x + w / 2;
const cy = y + h / 2;
const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cx - size / 2} ${cy - size / 2} ${size} ${size}"><rect x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}" rx="${size * 0.22}" fill="#1e58f0"/>${inner}</svg>`;
await writeFile(join(import.meta.dirname, "..", "src", "app", "icon.svg"), icon);
console.log("icon written");
