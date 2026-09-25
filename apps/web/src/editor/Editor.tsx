"use client";
import { DEFAULT_STYLE_ID, PENS, penById } from "@truehand/catalog";
import { Download, Maximize2, Minimize2, PenLine, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { EditorSettings } from "@/lib/settings";
import s from "./Editor.module.css";
import { ExportDialog } from "./ExportDialog";
import { getHand, isMine, MINE_PREFIX, resolveStyle } from "@/myhand/store";
import { useHandFont } from "./handFonts";
import { QuickPickers } from "./Pickers";
import { Preview } from "./Preview";
import { RichText } from "./RichText";
import { SettingsPanel } from "./SettingsPanel";
import { usePreview } from "./usePreview";
import { useSettings } from "./useSettings";

interface Props {
  /** Settings a landing page wants to start from (a style, a paper, sample text…). */
  initial?: Partial<EditorSettings>;
  /** Pre-rendered first page, shown instantly while the engine loads. */
  placeholder?: string;
}

type Tab = "text" | "style";

export function Editor({ initial, placeholder }: Props) {
  const { settings, update, patch } = useSettings(initial);
  const preview = usePreview(settings);
  const [exporting, setExporting] = useState(false);
  const [tab, setTab] = useState<Tab>("text");
  const [zoom, setZoom] = useState(false);
  const font = useHandFont(settings.styleId);
  const pen = penById(settings.penId) ?? PENS[0]!;
  const style = resolveStyle(settings.styleId);
  const words = preview.stats?.words ?? 0;

  // A handwriting of your own that was deleted (or made in another browser) falls back to the default.
  useEffect(() => {
    if (isMine(settings.styleId) && !getHand(settings.styleId) && settings.styleId !== `${MINE_PREFIX}draft`) update("styleId", DEFAULT_STYLE_ID);
  }, [settings.styleId, update]);
  const pagesLabel = `${preview.pages} ${preview.pages === 1 ? "page" : "pages"}`;
  const download = (
    <Button onClick={() => setExporting(true)} disabled={!preview.client}>
      <Download aria-hidden="true" />
      Download
    </Button>
  );

  return (
    <div className={s.workspace}>
      <div className={s.left}>
        <div className={s.tabs} role="tablist" aria-label="Editor">
          <button type="button" role="tab" id="tab-text" aria-controls="panel-text" aria-selected={tab === "text"} onClick={() => setTab("text")}>
            <PenLine aria-hidden="true" />
            Text
          </button>
          <button type="button" role="tab" id="tab-style" aria-controls="panel-style" aria-selected={tab === "style"} onClick={() => setTab("style")}>
            <SlidersHorizontal aria-hidden="true" />
            Style &amp; page
          </button>
          <span className={s.count}>
            {words.toLocaleString("en")} {words === 1 ? "word" : "words"} · {pagesLabel}
          </span>
        </div>
        <div className={s.panel} id="panel-text" role="tabpanel" aria-labelledby="tab-text" hidden={tab !== "text"}>
          <RichText
            value={settings.text}
            onChange={(v) => update("text", v)}
            family={font.family}
            ratio={font.ratio}
            ink={settings.inkColor ?? pen.spec.color}
            pickers={<QuickPickers settings={settings} update={update} />}
            footer={<p className={s.private}>Written in your browser. Your text is never uploaded.</p>}
          />
        </div>
        <div className={s.panel} id="panel-style" role="tabpanel" aria-labelledby="tab-style" hidden={tab !== "style"}>
          <SettingsPanel settings={settings} update={update} />
        </div>
      </div>

      <section className={s.right} aria-label="Preview">
        <header className={s.previewHead}>
          <div className={s.previewTitle}>
            <strong>Preview</strong>
            {preview.error ? (
              <span className={s.error}>Couldn&rsquo;t render: {preview.error}</span>
            ) : (
              <span className={s.meta} data-busy={preview.busy || undefined}>
                {preview.busy ? "writing…" : `${style?.name ?? ""} · ${pagesLabel}`}
              </span>
            )}
          </div>
          <div className={s.previewActions}>
            <button
              type="button"
              className={s.zoom}
              onClick={() => setZoom((z) => !z)}
              aria-pressed={zoom}
              aria-label={zoom ? "Fit page to width" : "Zoom in"}
              title={zoom ? "Fit" : "Zoom in"}
            >
              {zoom ? <Minimize2 /> : <Maximize2 />}
            </button>
            <span className={s.desktopOnly}>{download}</span>
          </div>
        </header>
        {preview.stats && preview.stats.missing.length > 0 && (
          <p className={s.missing}>
            Not in this handwriting, skipped:{" "}
            {preview.stats.missing
              .slice(0, 8)
              .map((c) => String.fromCodePoint(c))
              .join(" ")}
          </p>
        )}
        <div className={s.stage} data-zoom={zoom || undefined} tabIndex={0} role="region" aria-label="Handwritten preview">
          <Preview
            client={preview.client}
            layoutId={preview.layoutId}
            pages={preview.pages}
            size={settings.size}
            effect={settings.effect}
            busy={preview.busy}
            placeholder={placeholder}
            label={`Handwritten preview, ${pagesLabel}`}
          />
        </div>
      </section>

      <div className={s.mobileBar}>
        <Button size="l" wide onClick={() => setExporting(true)} disabled={!preview.client}>
          <Download aria-hidden="true" />
          Download {pagesLabel}
        </Button>
      </div>

      <ExportDialog open={exporting} onClose={() => setExporting(false)} settings={settings} patch={patch} client={preview.client} pages={preview.pages} />
    </div>
  );
}
