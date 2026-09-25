import { styleById, DEFAULT_STYLE_ID, type StyleEntry } from "@truehand/catalog";
import type { DocumentSpec, LayoutStats } from "@truehand/engine";
import type { Effect } from "@/lib/settings";
import type { ExportOptions, StyleRef, WorkerRequest, WorkerResponse } from "./protocol";

export const styleRef = (entry: StyleEntry): StyleRef => ({
  id: entry.id,
  url: `/hands/${entry.id}.ttf`,
  connected: entry.connected,
  tune: entry.tune,
});

/** Mira covers Latin Extended and Cyrillic, so it fills gaps in narrower hands. */
export const fallbackRef = () => styleRef(styleById(DEFAULT_STYLE_ID)!);

type Pending = {
  resolve: (msg: WorkerResponse) => void;
  reject: (err: Error) => void;
  progress?: (done: number, total: number) => void;
};

/** Promise-based wrapper around the render worker. One per editor. */
export class RendererClient {
  private readonly worker: Worker;
  private nextId = 1;
  private readonly pending = new Map<number, Pending>();

  constructor() {
    this.worker = new Worker(new URL("./render.worker.ts", import.meta.url), { type: "module", name: "truehand-render" });
    this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      const p = this.pending.get(msg.id);
      if (!p) {
        if (msg.type === "page") msg.bitmap.close();
        return;
      }
      if (msg.type === "progress") {
        p.progress?.(msg.done, msg.total);
        return;
      }
      this.pending.delete(msg.id);
      if (msg.type === "error") p.reject(new Error(msg.message));
      else p.resolve(msg);
    };
    this.worker.onerror = (e) => {
      for (const p of this.pending.values()) p.reject(new Error(e.message || "Renderer crashed"));
      this.pending.clear();
    };
  }

  private send<T extends WorkerResponse>(build: (id: number) => WorkerRequest, progress?: Pending["progress"]): { id: number; promise: Promise<T> } {
    const id = this.nextId++;
    const promise = new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: resolve as Pending["resolve"], reject, progress });
    });
    this.worker.postMessage(build(id));
    return { id, promise };
  }

  layout(spec: DocumentSpec, style: StyleEntry) {
    return this.send<Extract<WorkerResponse, { type: "layout" }>>((id) => ({
      type: "layout",
      id,
      spec,
      style: styleRef(style),
      fallback: fallbackRef(),
    }));
  }

  page(layoutId: number, index: number, scale: number, effect: Effect) {
    return this.send<Extract<WorkerResponse, { type: "page" }>>((id) => ({ type: "page", id, layoutId, index, scale, effect })).promise;
  }

  export(spec: DocumentSpec, style: StyleEntry, options: ExportOptions, progress?: Pending["progress"]) {
    return this.send<Extract<WorkerResponse, { type: "export" }>>(
      (id) => ({ type: "export", id, spec, style: styleRef(style), fallback: fallbackRef(), options }),
      progress,
    ).promise;
  }

  /** Drops interest in a request; its result is discarded when it arrives. */
  forget(id: number) {
    this.pending.delete(id);
  }

  dispose() {
    this.worker.terminate();
    for (const p of this.pending.values()) p.reject(new Error("Renderer closed"));
    this.pending.clear();
  }
}

export type LayoutResult = { id: number; pages: number; stats: LayoutStats };
