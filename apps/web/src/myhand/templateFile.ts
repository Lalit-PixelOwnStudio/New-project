"use client";
import { buildPdf } from "@truehand/engine/export";
import { drawTemplate, PAGE, type Ctx2D } from "./template";

/** Pixels per millimetre for the printable template (about 200 dpi). */
const PX = 8;

/** The template as a one-page A4 PDF, drawn in the browser. */
export async function templatePdf(): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE.width * PX;
  canvas.height = PAGE.height * PX;
  const ctx = canvas.getContext("2d")!;
  drawTemplate(ctx as unknown as Ctx2D, PX, "Helvetica, Arial, sans-serif");
  const png = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't draw the template"))), "image/png"),
  );
  const pdf = await buildPdf([{ bytes: new Uint8Array(await png.arrayBuffer()), format: "png" }], { title: "Truehand handwriting template", size: "a4" });
  return new Blob([pdf as BlobPart], { type: "application/pdf" });
}

/** Loads a photo into RGBA pixels, scaled so its long side is at most `max`. */
export async function photoPixels(file: Blob, max = 2400): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * k);
  const height = Math.round(bitmap.height * k);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return { data: ctx.getImageData(0, 0, width, height).data, width, height };
}
