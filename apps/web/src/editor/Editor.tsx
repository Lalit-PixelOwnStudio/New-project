"use client";
import { styleById } from "@truehand/catalog";
import { useState, type ReactNode } from "react";
import { AdSlot } from "@/components/AdSlot";
import { Button } from "@/components/ui/Button";
import type { EditorSettings } from "@/lib/settings";
import { Controls } from "./Controls";
import s from "./Editor.module.css";
import { ExportDialog } from "./ExportDialog";
import { Preview } from "./Preview";
import { TextPanel } from "./TextPanel";
import { usePreview } from "./usePreview";
import { useSettings } from "./useSettings";

interface Props {
  /** Headline block shown above the text box (the page's H1 lives here). */
  intro: ReactNode;
  /** Settings a landing page wants to start from (a style, a paper…). */
  initial?: Partial<EditorSettings>;
  /** Pre-rendered first page, shown instantly while the engine loads. */
  placeholder?: string;
}

export function Editor({ intro, initial, placeholder }: Props) {
  const { settings, update, patch } = useSettings(initial);
  const preview = usePreview(settings);
  const [exporting, setExporting] = useState(false);
  const style = styleById(settings.styleId);

  return (
    <div className={s.editor}>
      <section className={s.write} aria-label="Text">
        <div className={s.intro}>{intro}</div>
        <TextPanel value={settings.text} onChange={(v) => update("text", v)} words={preview.stats?.words ?? 0} pages={preview.pages} />
      </section>

      <section className={s.stage} aria-label="Preview">
        <div className={s.stageBar}>
          <span className={s.status} data-busy={preview.busy || undefined}>
            {preview.error ? `Couldn't render: ${preview.error}` : preview.busy ? "Writing…" : `${style?.name ?? ""} · ${preview.pages} ${preview.pages === 1 ? "page" : "pages"}`}
          </span>
          {preview.stats && preview.stats.missing.length > 0 && (
            <span className={s.missing} title="These characters aren't in this handwriting and were skipped.">
              Skipped: {preview.stats.missing.slice(0, 6).map((c) => String.fromCodePoint(c)).join(" ")}
            </span>
          )}
        </div>
        <div className={s.stageScroll}>
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

      <aside className={s.side} aria-label="Handwriting settings">
        <div className={s.sideScroll}>
          <Controls settings={settings} update={update} />
          <AdSlot placement="editor" className={s.ad} />
        </div>
        <div className={s.exportBar}>
          <Button size="l" wide onClick={() => setExporting(true)} disabled={!preview.client}>
            Download
            <span className={s.formats}>PDF · PNG · ZIP</span>
          </Button>
        </div>
      </aside>

      <ExportDialog open={exporting} onClose={() => setExporting(false)} settings={settings} patch={patch} client={preview.client} pages={preview.pages} />
    </div>
  );
}
