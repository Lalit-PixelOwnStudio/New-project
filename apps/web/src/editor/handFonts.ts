"use client";
import { useEffect, useState } from "react";
import { DEFAULT_STYLE_ID } from "@truehand/catalog";
import metrics from "@/lib/hand-metrics.json";

const loaded = new Map<string, Promise<void>>();

/** CSS font-family name for a handwriting style, loaded on demand. */
export const handFamily = (id: string) => `hand-${id}`;

export function loadHandFont(id: string): Promise<void> {
  let p = loaded.get(id);
  if (!p) {
    const face = new FontFace(handFamily(id), `url(/hands/${id}.ttf)`, { display: "swap" });
    p = face.load().then((f) => {
      document.fonts.add(f);
    });
    p.catch(() => loaded.delete(id));
    loaded.set(id, p);
  }
  return p;
}

/**
 * Loads the style's font for on-screen text. `ratio` is the hand's x-height
 * as a fraction of its font size, for sizing every hand to the same visual size.
 */
export function useHandFont(styleId: string) {
  // Custom hands have no font file; the editor shows the default hand while the preview shows yours.
  const id = styleId.startsWith("mine:") ? DEFAULT_STYLE_ID : styleId;
  const [ready, setReady] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    loadHandFont(id).then(
      () => alive && setReady(id),
      () => {},
    );
    return () => {
      alive = false;
    };
  }, [id]);
  const ratio = (metrics as Record<string, number>)[id] ?? 0.42;
  return { family: ready === id ? handFamily(id) : null, ratio };
}
