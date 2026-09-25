import { PDFDocument } from "pdf-lib";
import { zipSync } from "fflate";
import { PAPER_SIZES_MM } from "../layout/paper";
import type { PaperSize } from "../types";

const PT_PER_MM = 72 / 25.4;

export interface PageImage {
  bytes: Uint8Array;
  format: "jpeg" | "png";
}

export interface PdfMeta {
  title: string;
  /** Page size in the PDF; images are stretched to fill it. */
  size: PaperSize;
}

/**
 * Builds a PDF with one full-bleed image per page. Pages are raster so the
 * paper texture and ink grain print exactly as previewed.
 */
export async function buildPdf(pages: PageImage[], meta: PdfMeta): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(meta.title);
  pdf.setCreator("Truehand");
  pdf.setProducer("Truehand");
  const [wMm, hMm] = PAPER_SIZES_MM[meta.size];
  const w = wMm * PT_PER_MM;
  const h = hMm * PT_PER_MM;
  for (const page of pages) {
    const image = page.format === "jpeg" ? await pdf.embedJpg(page.bytes) : await pdf.embedPng(page.bytes);
    pdf.addPage([w, h]).drawImage(image, { x: 0, y: 0, width: w, height: h });
  }
  return pdf.save({ useObjectStreams: true });
}

/** Zips page images as page-01.png, page-02.png, … */
export function buildZip(pages: PageImage[], baseName = "page"): Uint8Array {
  const files: Record<string, Uint8Array> = {};
  const digits = String(pages.length).length < 2 ? 2 : String(pages.length).length;
  pages.forEach((p, i) => {
    files[`${baseName}-${String(i + 1).padStart(digits, "0")}.${p.format === "jpeg" ? "jpg" : "png"}`] = p.bytes;
  });
  // Images are already compressed; storing them avoids burning CPU for nothing.
  return zipSync(files, { level: 0 });
}
