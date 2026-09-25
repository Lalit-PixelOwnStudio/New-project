"use client";
import type { CapturedHand } from "@truehand/engine";
import { Camera, Download, FileImage, PenLine, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Preview } from "@/editor/Preview";
import { usePreview } from "@/editor/usePreview";
import { rememberStyle } from "@/editor/useSettings";
import { DEFAULT_SETTINGS, type EditorSettings } from "@/lib/settings";
import { buildHand, CaptureError, captureTemplate, traceCells, type CellInk } from "./capture";
import { DrawPad } from "./DrawPad";
import { MINE_PREFIX, saveHand, uploadHand } from "./store";
import { CELLS } from "./template";
import { photoPixels, templatePdf } from "./templateFile";
import s from "./myhand.module.css";

type Phase =
  { name: "choose" } | { name: "reading" } | { name: "draw" } | { name: "review"; hand: CapturedHand; missing: string[] } | { name: "error"; message: string };

const ALL = [...new Set(CELLS)];
const PREVIEW_TEXT = `# My own handwriting
The quick brown fox jumps over the lazy dog. Notes, assignments and letters, written in my hand, with every letter a little different each time. 1 2 3 4 5 6 7 8 9 0`;

export function MyHandTool({ priceLabel }: { priceLabel: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ name: "choose" });
  const [name, setName] = useState("My handwriting");
  const [busyTemplate, setBusyTemplate] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const review = useRef<HTMLDivElement>(null);
  // Show the results from the top once they're ready.
  useEffect(() => {
    if (phase.name === "review") review.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [phase.name]);

  const downloadTemplate = async () => {
    setBusyTemplate(true);
    try {
      const blob = await templatePdf();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "truehand-handwriting-template.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    } finally {
      setBusyTemplate(false);
    }
  };

  const readPhoto = async (f: File) => {
    setPhase({ name: "reading" });
    // Let the "reading" state paint before the work starts.
    await new Promise((r) => setTimeout(r, 30));
    try {
      const px = await photoPixels(f);
      const { hand, missing } = captureTemplate(px.data, px.width, px.height);
      setPhase({ name: "review", hand, missing });
    } catch (e) {
      setPhase({ name: "error", message: e instanceof CaptureError ? e.message : "We couldn't read that image. Try a JPG or PNG photo of the whole page." });
    }
  };

  const fromDrawing = (cells: CellInk[]) => {
    const traced = traceCells(cells);
    if (traced.length < 10) {
      setPhase({ name: "error", message: "Draw at least ten characters to make a handwriting." });
      return;
    }
    const hand = buildHand(traced);
    const found = new Set(traced.map((c) => c.char));
    setPhase({ name: "review", hand, missing: ALL.filter((c) => !found.has(c)) });
  };

  const save = (hand: CapturedHand) => {
    const saved = { id: crypto.randomUUID().slice(0, 8), name: name.trim() || "My handwriting", createdAt: new Date().toISOString(), data: hand };
    saveHand(saved);
    void uploadHand(saved);
    rememberStyle(MINE_PREFIX + saved.id);
    router.push("/");
  };

  if (phase.name === "draw") return <DrawPad onDone={fromDrawing} onCancel={() => setPhase({ name: "choose" })} />;

  if (phase.name === "review") {
    return (
      <div className={s.review} ref={review}>
        <div className={s.reviewHead}>
          <h2>
            We read {ALL.length - phase.missing.length} of {ALL.length} characters
          </h2>
          {phase.missing.length > 0 && (
            <p>
              Not found: <span className={s.missing}>{phase.missing.join(" ")}</span>. Those are written in the default hand, or retake the photo to add them.
            </p>
          )}
        </div>
        <GlyphGrid hand={phase.hand} />
        <HandPreview hand={phase.hand} />
        <div className={s.saveRow}>
          <label className={s.nameField}>
            <span>Name it</span>
            <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
          </label>
          <Button type="button" size="l" onClick={() => save(phase.hand)}>
            Save and open in the editor
          </Button>
          <Button type="button" variant="secondary" size="l" onClick={() => setPhase({ name: "choose" })}>
            <RotateCcw aria-hidden="true" />
            Start again
          </Button>
        </div>
        <p className={s.priceNote}>
          Free to try: write anything with it in the editor. Downloading pages in your handwriting is {priceLabel} once, or included with any plan.
        </p>
      </div>
    );
  }

  return (
    <div className={s.paths}>
      <article className={s.path}>
        <span className={s.pathIcon}>
          <FileImage aria-hidden="true" />
        </span>
        <h2>Write on paper</h2>
        <ol className={s.steps}>
          <li>Print the one-page template.</li>
          <li>Write one character in each box with a dark pen.</li>
          <li>Take a photo of the whole page, with all four black squares in view.</li>
        </ol>
        <div className={s.pathActions}>
          <Button type="button" variant="secondary" onClick={downloadTemplate} disabled={busyTemplate}>
            <Download aria-hidden="true" />
            {busyTemplate ? "Preparing…" : "Download the template"}
          </Button>
          <Button type="button" onClick={() => file.current?.click()} disabled={phase.name === "reading"}>
            <Camera aria-hidden="true" />
            {phase.name === "reading" ? "Reading your page…" : "Upload or take the photo"}
          </Button>
          <input
            ref={file}
            type="file"
            accept="image/*"
            className="visually-hidden"
            aria-label="Photo of your filled-in template"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void readPhoto(f);
            }}
          />
        </div>
        {phase.name === "error" && (
          <p className={s.error} role="alert">
            {phase.message}
          </p>
        )}
        <p className={s.small}>Your photo is read on your device and never uploaded.</p>
      </article>
      <article className={s.path}>
        <span className={s.pathIcon}>
          <PenLine aria-hidden="true" />
        </span>
        <h2>No printer? Draw on screen</h2>
        <p>Write each letter with your finger, a stylus or the mouse, one at a time. Takes about five minutes.</p>
        <div className={s.pathActions}>
          <Button type="button" variant="secondary" onClick={() => setPhase({ name: "draw" })}>
            <PenLine aria-hidden="true" />
            Start drawing
          </Button>
        </div>
      </article>
    </div>
  );
}

/** Every character that was read, drawn from the captured outlines. */
function GlyphGrid({ hand }: { hand: CapturedHand }) {
  const seen = new Set<string>();
  const glyphs = hand.glyphs.filter((g) => !seen.has(g.char) && seen.add(g.char));
  const top = hand.ascender;
  const height = hand.ascender - hand.descender;
  return (
    <ul className={s.glyphs} aria-label="Characters read from your writing">
      {glyphs.map((g) => (
        <li key={g.char} title={g.char}>
          <svg viewBox={`0 ${-top} ${g.advance} ${height}`} role="img" aria-label={g.char}>
            <path fillRule="nonzero" d={g.variants[0]!.map((c) => `M${c.map((v, i) => (i % 2 ? -v : v)).join(" ")}Z`).join("")} />
          </svg>
        </li>
      ))}
    </ul>
  );
}

const DRAFT = `${MINE_PREFIX}draft`;

/** A page written in the new hand by the real engine, before it's saved. */
function HandPreview({ hand }: { hand: CapturedHand }) {
  const settings = useMemo<EditorSettings>(() => ({ ...DEFAULT_SETTINGS, text: PREVIEW_TEXT, styleId: DRAFT, holes: "none" }), []);
  const draft = useMemo(() => ({ styleId: DRAFT, data: hand }), [hand]);
  const preview = usePreview(settings, draft);
  return (
    <div className={s.previewBox}>
      <Preview
        client={preview.client}
        layoutId={preview.layoutId}
        pages={1}
        size={settings.size}
        effect="none"
        busy={preview.busy}
        label="Your handwriting on a page"
      />
    </div>
  );
}
