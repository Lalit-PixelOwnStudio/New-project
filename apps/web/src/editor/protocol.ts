import type { DocumentSpec, LayoutStats } from "@truehand/engine";
import type { StyleEntry } from "@truehand/catalog";
import type { Effect } from "@/lib/settings";

/** What the worker needs to know about a style to load and tune it. */
export interface StyleRef {
  id: string;
  url: string;
  connected: boolean;
  tune: StyleEntry["tune"];
}

export interface ExportOptions {
  format: "pdf" | "png" | "zip";
  dpi: number;
  /** Only the first n pages are exported (free limit). */
  maxPages: number;
  effect: Effect;
  /** Ink only on a transparent background (PNG/ZIP). */
  transparent: boolean;
  title: string;
}

export type WorkerRequest =
  | { type: "layout"; id: number; spec: DocumentSpec; style: StyleRef; fallback: StyleRef }
  | { type: "page"; id: number; layoutId: number; index: number; scale: number; effect: Effect }
  | { type: "export"; id: number; spec: DocumentSpec; style: StyleRef; fallback: StyleRef; options: ExportOptions };

export type WorkerResponse =
  | { type: "layout"; id: number; pages: number; stats: LayoutStats }
  | { type: "page"; id: number; layoutId: number; index: number; bitmap: ImageBitmap; width: number; height: number }
  | { type: "progress"; id: number; done: number; total: number }
  | { type: "export"; id: number; bytes: Uint8Array; mime: string; pages: number }
  | { type: "error"; id: number; message: string };
