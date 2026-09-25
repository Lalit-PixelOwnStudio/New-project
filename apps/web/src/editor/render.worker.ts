/// <reference lib="webworker" />
/**
 * Runs the handwriting engine off the main thread. Layout is computed once per
 * document change; pages are rasterised on request so only visible pages cost
 * anything, and exports render at print resolution without blocking the UI.
 */
import { createCapturedSource, createFontSource, layoutDocument, type DocumentLayout, type GlyphSource, type HandStyle } from "@truehand/engine";
import { buildPdf, buildZip, type PageImage } from "@truehand/engine/export";
import { renderPage, renderInk, type SurfaceFactory } from "@truehand/engine/render";
import type { StyleRef, WorkerRequest, WorkerResponse } from "./protocol";

declare const self: DedicatedWorkerGlobalScope;

const create: SurfaceFactory = (w, h) => new OffscreenCanvas(Math.max(1, w), Math.max(1, h));
const fonts = new Map<string, Promise<GlyphSource>>();
/** Hands captured from people's own writing, sent by the page before it uses them. */
const captured = new Map<string, GlyphSource>();
let current: { id: number; layout: DocumentLayout; spec: WorkerRequest & { type: "layout" } } | null = null;

function font(ref: StyleRef): Promise<GlyphSource> {
  if (ref.captured) {
    const source = captured.get(ref.id);
    return source ? Promise.resolve(source) : Promise.reject(new Error("Your handwriting isn't loaded yet. Pick it again from the Hand menu."));
  }
  let p = fonts.get(ref.url);
  if (!p) {
    p = fetch(ref.url)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load handwriting ${ref.id} (${r.status})`);
        return r.arrayBuffer();
      })
      .then((data) => createFontSource(ref.id, data));
    p.catch(() => fonts.delete(ref.url));
    fonts.set(ref.url, p);
  }
  return p;
}

async function handStyle(style: StyleRef, fallback: StyleRef): Promise<HandStyle> {
  const primary = await font(style);
  const sources = style.id === fallback.id ? [primary] : [primary, await font(fallback)];
  return { id: style.id, sources, connected: style.connected, ...style.tune };
}

const post = (msg: WorkerResponse, transfer: Transferable[] = []) => self.postMessage(msg, transfer);

async function toBytes(surface: OffscreenCanvas, type: string, quality?: number) {
  const blob = await surface.convertToBlob({ type, quality });
  return new Uint8Array(await blob.arrayBuffer());
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  try {
    if (msg.type === "hand") {
      captured.set(msg.handId, createCapturedSource(msg.handId, msg.data));
      return;
    }

    if (msg.type === "layout") {
      const style = await handStyle(msg.style, msg.fallback);
      const layout = layoutDocument(msg.spec, style);
      // Font loading is async, so an older request can finish after a newer one.
      if (!current || msg.id > current.id) current = { id: msg.id, layout, spec: msg };
      post({ type: "layout", id: msg.id, pages: layout.pages.length, stats: layout.stats });
      return;
    }

    if (msg.type === "page") {
      if (!current || current.id !== msg.layoutId) return; // superseded
      const page = current.layout.pages[msg.index];
      if (!page) return;
      const surface = renderPage(page, {
        scale: msg.scale,
        paper: current.spec.spec.paper,
        pen: current.spec.spec.pen,
        effect: msg.effect,
        seed: current.spec.spec.realism.seed,
        createSurface: create,
      }) as OffscreenCanvas;
      const bitmap = surface.transferToImageBitmap();
      post({ type: "page", id: msg.id, layoutId: msg.layoutId, index: msg.index, bitmap, width: bitmap.width, height: bitmap.height }, [bitmap]);
      return;
    }

    if (msg.type === "export") {
      const { options, spec } = msg;
      const style = await handStyle(msg.style, msg.fallback);
      const layout = layoutDocument(spec, style);
      const pages = layout.pages.slice(0, options.maxPages);
      const scale = options.dpi / 96;
      const images: PageImage[] = [];
      for (const [i, page] of pages.entries()) {
        post({ type: "progress", id: msg.id, done: i, total: pages.length });
        if (options.transparent && options.format !== "pdf") {
          const ink = renderInk(page, { scale, pen: spec.pen, createSurface: create }) as OffscreenCanvas;
          images.push({ bytes: await toBytes(ink, "image/png"), format: "png" });
          continue;
        }
        const surface = renderPage(page, {
          scale,
          paper: spec.paper,
          pen: spec.pen,
          effect: options.effect,
          seed: spec.realism.seed,
          createSurface: create,
        }) as OffscreenCanvas;
        images.push(
          options.format === "pdf"
            ? { bytes: await toBytes(surface, "image/jpeg", 0.9), format: "jpeg" }
            : { bytes: await toBytes(surface, "image/png"), format: "png" },
        );
      }
      post({ type: "progress", id: msg.id, done: pages.length, total: pages.length });
      let bytes: Uint8Array;
      let mime: string;
      if (options.format === "pdf") {
        bytes = await buildPdf(images, { title: options.title, size: spec.paper.size });
        mime = "application/pdf";
      } else if (options.format === "zip" || images.length > 1) {
        bytes = buildZip(images, slug(options.title));
        mime = "application/zip";
      } else {
        bytes = images[0]!.bytes;
        mime = "image/png";
      }
      post({ type: "export", id: msg.id, bytes, mime, pages: images.length }, [bytes.buffer]);
    }
  } catch (err) {
    post({ type: "error", id: msg.id, message: err instanceof Error ? err.message : String(err) });
  }
};

function slug(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "page"
  );
}
