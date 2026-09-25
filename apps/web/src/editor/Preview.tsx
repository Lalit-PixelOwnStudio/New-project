"use client";
import type { PaperSize } from "@truehand/engine";
import { PAPER_SIZES_MM, PX_PER_MM } from "@truehand/engine/paper";
import { useEffect, useRef, useState } from "react";
import type { Effect } from "@/lib/settings";
import type { RendererClient } from "./client";
import s from "./Preview.module.css";

interface Props {
  client: RendererClient | null;
  layoutId: number;
  pages: number;
  size: PaperSize;
  effect: Effect;
  busy: boolean;
  /** Pre-rendered first page shown until the worker has drawn it. */
  placeholder?: string;
  label: string;
}

export function Preview({ client, layoutId, pages, size, effect, busy, placeholder, label }: Props) {
  const [wMm, hMm] = PAPER_SIZES_MM[size];
  return (
    <div className={s.preview} aria-busy={busy} aria-label={label} role="region">
      {Array.from({ length: Math.max(1, pages) }, (_, i) => (
        <PageView
          key={i}
          client={client}
          layoutId={layoutId}
          index={i}
          widthPx={wMm * PX_PER_MM}
          aspect={`${wMm} / ${hMm}`}
          effect={effect}
          placeholder={i === 0 ? placeholder : undefined}
          total={pages}
        />
      ))}
    </div>
  );
}

function PageView({
  client,
  layoutId,
  index,
  widthPx,
  aspect,
  effect,
  placeholder,
  total,
}: {
  client: RendererClient | null;
  layoutId: number;
  index: number;
  widthPx: number;
  aspect: string;
  effect: Effect;
  placeholder?: string;
  total: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(index === 0);
  const [width, setWidth] = useState(0);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { rootMargin: "600px 0px" });
    let t: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(([e]) => {
      clearTimeout(t);
      const w = Math.round(e?.contentRect.width ?? 0);
      t = setTimeout(() => setWidth(w), 120);
    });
    io.observe(el);
    ro.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!visible || !client || !layoutId || !width) return;
    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = Math.min(2.6, Math.max(0.5, (width * dpr) / widthPx));
    client.page(layoutId, index, scale, effect).then(
      (r) => {
        const el = canvas.current;
        if (cancelled || !el) {
          r.bitmap.close();
          return;
        }
        el.width = r.width;
        el.height = r.height;
        el.getContext("bitmaprenderer")?.transferFromImageBitmap(r.bitmap);
        setDrawn(true);
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [visible, client, layoutId, index, effect, width, widthPx]);

  return (
    <div className={s.sheet} ref={wrap} style={{ aspectRatio: aspect }} data-effect={effect}>
      {placeholder && !drawn && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={s.placeholder} src={placeholder} alt="" fetchPriority="high" />
      )}
      <canvas ref={canvas} className={s.canvas} data-drawn={drawn || undefined} aria-hidden="true" />
      {total > 1 && <span className={s.number}>{String(index + 1).padStart(2, "0")}</span>}
    </div>
  );
}
