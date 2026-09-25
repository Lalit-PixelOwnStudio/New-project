// Crops a region of a QA render for close inspection: tsx scripts/crop.ts in.png x y w h [zoom]
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
const [file, x, y, w, h, zoom = "1"] = process.argv.slice(2);
const img = await loadImage(file!);
const z = Number(zoom);
const c = createCanvas(Number(w) * z, Number(h) * z);
const ctx = c.getContext("2d");
ctx.drawImage(img, Number(x), Number(y), Number(w), Number(h), 0, 0, Number(w) * z, Number(h) * z);
writeFileSync(file!.replace(/\.png$/, `-crop.png`), c.toBuffer("image/png"));
