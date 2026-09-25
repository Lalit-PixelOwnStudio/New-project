import { createCanvas } from "@napi-rs/canvas";
import { unzipSync } from "fflate";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { buildPdf, buildZip } from "../src/export/index";

const png = () => new Uint8Array(createCanvas(20, 28).toBuffer("image/png"));

describe("export", () => {
  it("builds a PDF with one A4 page per image", async () => {
    const bytes = await buildPdf([{ bytes: png(), format: "png" }, { bytes: png(), format: "png" }], { title: "Notes", size: "a4" });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(2);
    const { width, height } = doc.getPage(0).getSize();
    expect(width).toBeCloseTo(595.28, 1);
    expect(height).toBeCloseTo(841.89, 1);
    expect(doc.getTitle()).toBe("Notes");
  });

  it("zips pages with padded names", () => {
    const zip = buildZip([{ bytes: png(), format: "png" }, { bytes: png(), format: "png" }]);
    expect(Object.keys(unzipSync(zip))).toEqual(["page-01.png", "page-02.png"]);
  });
});
