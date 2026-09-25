"use client";
import { PENS, penById, styleById } from "@truehand/catalog";
import { ChevronDown, ChevronUp, Download, Maximize2, Minimize2, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { EditorSettings } from "@/lib/settings";
import s from "./Editor.module.css";
import { ExportDialog } from "./ExportDialog";
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

export function Editor({ initial, placeholder }: Props) {
  const { settings, update, patch } = useSettings(initial);
  const preview = usePreview(settings);
  const [exporting, setExporting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const font = useHandFont(settings.styleId);
  const pen = penById(settings.penId) ?? PENS[0]!;
  const style = styleById(settings.styleId);
  const words = preview.stats?.words ?? 0;

  return (
    <div className={s.workspace}>
      <div className={s.left}>
        <RichText
          value={settings.text}
          onChange={(v) => update("text", v)}
          family={font.family}
          ratio={font.ratio}
          ink={settings.inkColor ?? pen.spec.color}
          pickers={<QuickPickers settings={settings} update={update} />}
          footer={
            <div className={s.status}>
              <span>
                {words.toLocaleString("en")} {words === 1 ? "word" : "words"} · {preview.pages} {preview.pages === 1 ? "page" : "pages"}
              </span>
              <span className={s.private}>Your text stays on this device</span>
            </div>
          }
        />
        {settingsOpen && (
          <div className={s.sheet}>
            <SettingsPanel settings={settings} update={update} onClose={() => setSettingsOpen(false)} />
          </div>
        )}
      </div>

      <section className={s.right} aria-label="Preview">
        <header className={s.previewHead}>
          <p>
            <strong>Live preview.</strong>{" "}
            {preview.error ? (
              <span className={s.error}>Couldn&rsquo;t render: {preview.error}</span>
            ) : (
              <span className={s.meta} data-busy={preview.busy || undefined}>
                {preview.busy ? "Writing…" : `${style?.name ?? ""} · ${preview.pages} ${preview.pages === 1 ? "page" : "pages"}. Updates as you type.`}
              </span>
            )}
          </p>
          <button type="button" className={s.zoom} onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? "Fit page to width" : "Zoom in"} title={zoom ? "Fit" : "Zoom in"}>
            {zoom ? <Minimize2 /> : <Maximize2 />}
          </button>
        </header>
        {preview.stats && preview.stats.missing.length > 0 && (
          <p className={s.missing}>
            Not in this handwriting, skipped: {preview.stats.missing.slice(0, 8).map((c) => String.fromCodePoint(c)).join(" ")}
          </p>
        )}
        <div className={s.stage} data-zoom={zoom || undefined}>
          <Preview
            client={preview.client}
            layoutId={preview.layoutId}
            pages={preview.pages}
            size={settings.size}
            effect={settings.effect}
            busy={preview.busy}
            placeholder={placeholder}
            label={`Handwritten preview, ${preview.pages} pages`}
          />
        </div>
      </section>

      <div className={s.bar}>
        <Button variant="secondary" size="l" className={s.settingsBtn} onClick={() => setSettingsOpen((o) => !o)} aria-expanded={settingsOpen}>
          <SlidersHorizontal aria-hidden="true" />
          Settings
          {settingsOpen ? <ChevronDown aria-hidden="true" /> : <ChevronUp aria-hidden="true" />}
        </Button>
        <Button size="l" wide onClick={() => setExporting(true)} disabled={!preview.client}>
          <Download aria-hidden="true" />
          Download {preview.pages === 1 ? "page" : `${preview.pages} pages`}
          <span className={s.formats}>PDF · PNG · ZIP</span>
        </Button>
      </div>

      <ExportDialog open={exporting} onClose={() => setExporting(false)} settings={settings} patch={patch} client={preview.client} pages={preview.pages} />
    </div>
  );
}
