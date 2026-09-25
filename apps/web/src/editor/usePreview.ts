"use client";
import type { CapturedHand, LayoutStats } from "@truehand/engine";
import { useEffect, useMemo, useRef, useState } from "react";
import { toDocumentSpec, type EditorSettings } from "@/lib/settings";
import { resolveStyle, useHands } from "@/myhand/store";
import { RendererClient } from "./client";

export interface PreviewState {
  client: RendererClient | null;
  layoutId: number;
  pages: number;
  stats: LayoutStats | null;
  busy: boolean;
  error: string | null;
}

/**
 * Keeps a layout of the current settings in the worker, re-laid out as they
 * change. `draft` is a custom hand that isn't saved yet (the capture page).
 */
export function usePreview(settings: EditorSettings, draft?: { styleId: string; data: CapturedHand }): PreviewState {
  const [client, setClient] = useState<RendererClient | null>(null);
  const [state, setState] = useState<Omit<PreviewState, "client">>({ layoutId: 0, pages: 1, stats: null, busy: true, error: null });
  const latest = useRef(0);

  useEffect(() => {
    const c = new RendererClient();
    setClient(c);
    return () => c.dispose();
  }, []);

  const spec = useMemo(() => toDocumentSpec(settings), [settings]);
  // Re-resolved when saved hands change, so a hand loaded after the editor still shows.
  const hands = useHands();
  const style = useMemo(() => resolveStyle(settings.styleId), [settings.styleId, hands]);

  useEffect(() => {
    if (!client) return;
    if (draft) client.registerHand(draft.styleId, draft.data);
    setState((s) => (s.busy ? s : { ...s, busy: true }));
    const timer = setTimeout(() => {
      const { id, promise } = client.layout(spec, style);
      if (latest.current) client.forget(latest.current);
      latest.current = id;
      promise.then(
        (r) => {
          if (latest.current === id) setState({ layoutId: id, pages: r.pages, stats: r.stats, busy: false, error: null });
        },
        (e: Error) => {
          if (latest.current === id) setState((s) => ({ ...s, busy: false, error: e.message }));
        },
      );
    }, 70);
    return () => clearTimeout(timer);
  }, [client, spec, style, draft]);

  return { client, ...state };
}
