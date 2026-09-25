"use client";
import { ArrowLeft, Eraser, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CellInk } from "./capture";
import { cellBox } from "./template";
import s from "./myhand.module.css";

/**
 * What people draw on screen, small letters first: most writing is lowercase, so
 * the first 26 already put most of a page in the person's hand.
 */
export const DRAW_CHARS = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?'-:()"];

/** The pad has the same shape and baseline as a template cell, read at 12 px/mm. */
const SAMPLE = 12;
const BOX = cellBox(0);
const MM_W = BOX.read.x1 - BOX.read.x0;
const MM_H = BOX.read.y1 - BOX.read.y0;
const BASELINE = (BOX.baseline - BOX.read.y0) / MM_H;
/** Pen width as a share of the pad's width (about 0.6 mm on paper). */
const PEN = 0.042;
/** The fewest characters that make a usable hand. */
export const MIN_DRAWN = 10;

type Stroke = [number, number][];
/** Every character's strokes, in DRAW_CHARS order. */
export type Drawings = Stroke[][];

/**
 * Draw each character with a finger, stylus or mouse, one at a time. Strokes are
 * kept in pad coordinates (0–1) so they redraw at any size, then rasterised to
 * the same bits the photo reader produces.
 */
export function DrawPad({
  initial,
  onDone,
  onCancel,
}: {
  /** Drawings to carry on from, when coming back to add more. */
  initial?: Drawings;
  onDone: (cells: CellInk[], drawings: Drawings) => void;
  onCancel: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  // Bring the pad fully into view, clear of the sticky header. The braces matter:
  // newer browsers return a promise from scrollIntoView, and React would try to
  // call it as the effect's cleanup when the pad closes.
  useEffect(() => {
    root.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, []);
  const [drawings, setDrawings] = useState<Drawings>(() => initial ?? DRAW_CHARS.map(() => []));
  // Carry on from the first character not drawn yet.
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      drawings.findIndex((d) => !d.length),
    ),
  );
  const [notice, setNotice] = useState("");
  const active = useRef<Stroke | null>(null);
  const char = DRAW_CHARS[index]!;
  const strokes = drawings[index]!;
  const done = drawings.filter((d) => d.length).length;

  const paint = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#9db7f5";
    ctx.lineWidth = Math.max(1, w / 300);
    ctx.setLineDash([w / 60, w / 60]);
    ctx.beginPath();
    ctx.moveTo(0, h * BASELINE);
    ctx.lineTo(w, h * BASELINE);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "#16204d";
    ctx.lineWidth = PEN * w;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const st of [...strokes, ...(active.current ? [active.current] : [])]) {
      ctx.beginPath();
      st.forEach(([x, y], i) => (i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)));
      if (st.length === 1) ctx.lineTo(st[0]![0] * w + 0.1, st[0]![1] * h);
      ctx.stroke();
    }
  }, [strokes]);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const r = c.getBoundingClientRect();
      c.width = Math.round(r.width * devicePixelRatio);
      c.height = Math.round(r.height * devicePixelRatio);
      paint();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => ro.disconnect();
  }, [paint]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };

  const setStrokes = (next: Stroke[]) => setDrawings((d) => d.map((x, i) => (i === index ? next : x)));

  const finish = () => {
    // Stay on the pad, with every drawing kept, until there's enough to make a hand.
    if (done < MIN_DRAWN) {
      const first = drawings.findIndex((d) => !d.length);
      setNotice(`Draw at least ${MIN_DRAWN} characters to make your handwriting. You've drawn ${done} so far.`);
      if (first >= 0) setIndex(first);
      return;
    }
    const cells: CellInk[] = [];
    drawings.forEach((d, i) => {
      if (d.length) cells.push(rasterise(DRAW_CHARS[i]!, d));
    });
    onDone(cells, drawings);
  };

  const next = () => (index < DRAW_CHARS.length - 1 ? setIndex(index + 1) : finish());

  return (
    <div className={s.pad} ref={root}>
      <div className={s.padHead}>
        <p>
          Write <strong className={s.padChar}>{char}</strong> on the dotted line
        </p>
        <span className={s.padCount}>
          {index + 1} / {DRAW_CHARS.length}
        </span>
      </div>
      <canvas
        ref={canvas}
        className={s.padCanvas}
        style={{ aspectRatio: `${MM_W} / ${MM_H}` }}
        aria-label={`Drawing area for ${char}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          active.current = [point(e)];
          paint();
        }}
        onPointerMove={(e) => {
          if (!active.current) return;
          active.current.push(point(e));
          paint();
        }}
        onPointerUp={() => {
          if (active.current) setStrokes([...strokes, active.current]);
          active.current = null;
          setNotice("");
        }}
        onPointerCancel={() => {
          active.current = null;
          paint();
        }}
      />
      <div className={s.padActions}>
        <Button type="button" variant="secondary" size="s" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button type="button" variant="secondary" size="s" onClick={() => setStrokes([])} disabled={!strokes.length}>
          <Eraser aria-hidden="true" />
          Clear
        </Button>
        <Button type="button" variant="secondary" size="s" onClick={next}>
          <SkipForward aria-hidden="true" />
          Skip
        </Button>
        <Button type="button" size="s" onClick={next} disabled={!strokes.length}>
          {index < DRAW_CHARS.length - 1 ? "Next" : "Finish"}
        </Button>
      </div>
      {notice && (
        <p className={s.padNotice} role="status">
          {notice}
        </p>
      )}
      <div className={s.padFoot}>
        <span>{done} drawn. Anything you skip is written in the default hand.</span>
        <span className={s.padLinks}>
          <button type="button" className={s.linkButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={s.linkButton} onClick={finish}>
            Finish now
          </button>
        </span>
      </div>
    </div>
  );
}

/** Draws strokes into the same ink/no-ink grid the photo reader makes for a cell. */
function rasterise(char: string, strokes: Stroke[]): CellInk {
  const width = Math.round(MM_W * SAMPLE);
  const height = Math.round(MM_H * SAMPLE);
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = PEN * width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const st of strokes) {
    ctx.beginPath();
    st.forEach(([x, y], i) => (i ? ctx.lineTo(x * width, y * height) : ctx.moveTo(x * width, y * height)));
    if (st.length === 1) ctx.lineTo(st[0]![0] * width + 0.1, st[0]![1] * height);
    ctx.stroke();
  }
  const alpha = ctx.getImageData(0, 0, width, height).data;
  const bits = new Uint8Array(width * height);
  let ink = 0;
  for (let i = 0; i < bits.length; i++) {
    if (alpha[i * 4 + 3]! > 110) {
      bits[i] = 1;
      ink++;
    }
  }
  return { char, width, height, bits, baseline: BASELINE * height, ink };
}
