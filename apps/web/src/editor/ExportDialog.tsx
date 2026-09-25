"use client";
import { DEFAULT_PAPER_ID, DEFAULT_PEN_ID, DEFAULT_STYLE_ID, STYLES, paperById, penById, styleById } from "@truehand/catalog";
import { useEffect, useRef, useState } from "react";
import { AdSlot } from "@/components/AdSlot";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProTag } from "@/components/ui/ProTag";
import { Segmented } from "@/components/ui/Segmented";
import { canUseStyle, useEntitlements } from "@/lib/entitlements-client";
import { toDocumentSpec, type EditorSettings } from "@/lib/settings";
import type { RendererClient } from "./client";
import s from "./ExportDialog.module.css";

type Format = "pdf" | "png" | "zip";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: EditorSettings;
  patch: (p: Partial<EditorSettings>) => void;
  client: RendererClient | null;
  pages: number;
}

/** Pro choices in these settings that this user is not entitled to. */
function lockedChoices(settings: EditorSettings, e: ReturnType<typeof useEntitlements>["entitlements"]) {
  const out: { key: string; label: string; reset: Partial<EditorSettings> }[] = [];
  const style = styleById(settings.styleId);
  if (style && !canUseStyle(e, style.id, style.tier)) out.push({ key: "style", label: `${style.name} handwriting`, reset: { styleId: DEFAULT_STYLE_ID } });
  const paper = paperById(settings.paperId);
  if (paper?.tier === "pro" && !e.limits.proPapers) out.push({ key: "paper", label: `${paper.name} paper`, reset: { paperId: DEFAULT_PAPER_ID } });
  const pen = penById(settings.penId);
  if (pen?.tier === "pro" && !e.limits.proPens) out.push({ key: "pen", label: pen.name, reset: { penId: DEFAULT_PEN_ID } });
  if (settings.inkColor && !e.limits.customInk) out.push({ key: "ink", label: "Custom ink colour", reset: { inkColor: null } });
  if (settings.effect !== "none" && !e.limits.effects) out.push({ key: "effect", label: settings.effect === "scan" ? "Scan finish" : "Photo finish", reset: { effect: "none" } });
  if (settings.fatigue > 0.4 + 1e-9 && !e.limits.fatigue) out.push({ key: "fatigue", label: "Stronger fatigue", reset: { fatigue: 0.4 } });
  return out;
}

function fileTitle(text: string) {
  const first = text.split("\n").find((l) => l.trim()) ?? "handwriting";
  return first.replace(/^#+\s*|[*_~=]/g, "").trim().slice(0, 60) || "handwriting";
}

export function ExportDialog({ open, onClose, settings, patch, client, pages }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { entitlements } = useEntitlements();
  const limits = entitlements.limits;
  const [format, setFormat] = useState<Format>("pdf");
  const [dpi, setDpi] = useState<150 | 300>(150);
  const [transparent, setTransparent] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const locked = lockedChoices(settings, entitlements);
  const allowed = Math.min(pages, limits.pagesPerExport + entitlements.credits);
  const truncated = allowed < pages;
  const hdLocked = dpi === 300 && limits.maxDpi < 300;
  const transparentLocked = transparent && !limits.transparent;
  const blocked = locked.length > 0 || hdLocked || transparentLocked;
  const busy = progress !== null;

  const run = async () => {
    if (!client || blocked) return;
    setError(null);
    setProgress({ done: 0, total: allowed });
    try {
      const style = styleById(settings.styleId) ?? STYLES[0]!;
      const title = fileTitle(settings.text);
      const result = await client.export(
        toDocumentSpec(settings),
        style,
        { format, dpi, maxPages: allowed, effect: settings.effect, transparent: transparent && format !== "pdf", title },
        (done, total) => setProgress({ done, total }),
      );
      const ext = result.mime === "application/pdf" ? "pdf" : result.mime === "application/zip" ? "zip" : "png";
      const url = URL.createObjectURL(new Blob([result.bytes as BlobPart], { type: result.mime }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^\w\- ]+/g, "").trim() || "handwriting"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setProgress(null);
    }
  };

  return (
    <dialog ref={ref} className={s.dialog} onClose={onClose} onCancel={(e) => busy && e.preventDefault()} aria-labelledby="export-title">
      <form method="dialog" className={s.body} onSubmit={(e) => e.preventDefault()}>
        <header className={s.head}>
          <h2 id="export-title">Download</h2>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close" disabled={busy}>
            ×
          </button>
        </header>

        <div className={s.row}>
          <span className={s.label}>Format</span>
          <Segmented
            label="Format"
            value={format}
            onChange={setFormat}
            options={[
              { value: "pdf", label: "PDF" },
              { value: "png", label: pages > 1 ? "PNG pages" : "PNG" },
              { value: "zip", label: "ZIP" },
            ]}
          />
        </div>

        <div className={s.row}>
          <span className={s.label}>Quality</span>
          <Segmented
            label="Quality"
            value={String(dpi) as "150" | "300"}
            onChange={(v) => setDpi(Number(v) as 150 | 300)}
            options={[
              { value: "150", label: "Screen · 150 dpi" },
              { value: "300", label: <>Print · 300 dpi {limits.maxDpi < 300 && <ProTag />}</> },
            ]}
          />
        </div>

        {format !== "pdf" && (
          <label className={s.check}>
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
            Ink only, transparent background {!limits.transparent && <ProTag />}
          </label>
        )}

        <p className={s.summary}>
          <strong>{allowed}</strong> of {pages} {pages === 1 ? "page" : "pages"}
          {truncated && <> · Free downloads include the first {limits.pagesPerExport} pages</>}
        </p>

        {(locked.length > 0 || hdLocked || transparentLocked) && (
          <div className={s.notice} role="status">
            <p>This page uses Pro choices:</p>
            <ul>
              {locked.map((l) => (
                <li key={l.key}>{l.label}</li>
              ))}
              {hdLocked && <li>Print quality, 300 dpi</li>}
              {transparentLocked && <li>Transparent background</li>}
            </ul>
            <div className={s.noticeActions}>
              <ButtonLink href="/pricing" size="s">
                See Pro and passes
              </ButtonLink>
              <Button
                type="button"
                size="s"
                variant="secondary"
                onClick={() => {
                  patch(Object.assign({}, ...locked.map((l) => l.reset)));
                  setDpi(150);
                  setTransparent(false);
                }}
              >
                Use free options
              </Button>
            </div>
          </div>
        )}

        {truncated && !blocked && (
          <p className={s.upsell}>
            Need all {pages} pages? <a href="/pricing">Pro, a week pass or a page pack</a> covers it.
          </p>
        )}

        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}

        <div className={s.actions}>
          {busy ? (
            <div className={s.progress} role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
              <div style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} />
              <span>
                Writing page {Math.min(progress.done + 1, progress.total)} of {progress.total}
              </span>
            </div>
          ) : (
            <Button type="button" size="l" wide disabled={blocked || !client} onClick={run}>
              Download {allowed} {allowed === 1 ? "page" : "pages"} as {format.toUpperCase()}
            </Button>
          )}
        </div>

        <AdSlot placement="export" />
      </form>
    </dialog>
  );
}
