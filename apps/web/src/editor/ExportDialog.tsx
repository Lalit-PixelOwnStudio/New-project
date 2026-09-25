"use client";
import { DEFAULT_PAPER_ID, DEFAULT_PEN_ID, DEFAULT_STYLE_ID, paperById, penById } from "@truehand/catalog";
import { CheckCircle2, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AdSlot } from "@/components/AdSlot";
import { BuyButton } from "@/components/BuyButton";
import { FeedbackForm, feedbackDue } from "@/components/FeedbackForm";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProTag } from "@/components/ui/ProTag";
import { Segmented } from "@/components/ui/Segmented";
import { canUseStyle, useEntitlements } from "@/lib/entitlements-client";
import { RESOLUTIONS, resolutionName, type Dpi } from "@/lib/resolution";
import { isMine, resolveStyle } from "@/myhand/store";
import { proFeaturesUsed, toDocumentSpec, type EditorSettings } from "@/lib/settings";
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
  const style = resolveStyle(settings.styleId);
  if (!canUseStyle(e, style.id, style.tier))
    out.push({
      key: "style",
      label: isMine(style.id) ? `Your handwriting (${style.name})` : `${style.name} handwriting`,
      reset: { styleId: DEFAULT_STYLE_ID },
    });
  const paper = paperById(settings.paperId);
  if (paper?.tier === "pro" && !e.limits.proPapers) out.push({ key: "paper", label: `${paper.name} paper`, reset: { paperId: DEFAULT_PAPER_ID } });
  const pen = penById(settings.penId);
  if (pen?.tier === "pro" && !e.limits.proPens) out.push({ key: "pen", label: pen.name, reset: { penId: DEFAULT_PEN_ID } });
  if (settings.inkColor && !e.limits.customInk) out.push({ key: "ink", label: "Custom ink colour", reset: { inkColor: null } });
  if (settings.effect !== "none" && !e.limits.effects)
    out.push({ key: "effect", label: settings.effect === "scan" ? "Scan finish" : "Photo finish", reset: { effect: "none" } });
  if (settings.fatigue > 0.4 + 1e-9 && !e.limits.fatigue) out.push({ key: "fatigue", label: "Stronger fatigue", reset: { fatigue: 0.4 } });
  return out;
}

function fileTitle(text: string) {
  const first = text.split("\n").find((l) => l.trim()) ?? "handwriting";
  return (
    first
      .replace(/^#+\s*|[*_~=]/g, "")
      .trim()
      .slice(0, 60) || "handwriting"
  );
}

export function ExportDialog({ open, onClose, settings, patch, client, pages }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { entitlements, refresh } = useEntitlements();
  const limits = entitlements.limits;
  const [format, setFormat] = useState<Format>("pdf");
  const [dpi, setDpi] = useState<Dpi>(150);
  const [transparent, setTransparent] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"options" | "working" | "ready">("options");
  const [file, setFile] = useState<{ url: string; name: string; pages: number } | null>(null);
  const [askFeedback, setAskFeedback] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setPhase("options");
      setError(null);
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  // Release the previous file when a new one replaces it or the dialog goes away.
  useEffect(
    () => () => {
      if (file) URL.revokeObjectURL(file.url);
    },
    [file],
  );

  const locked = lockedChoices(settings, entitlements);
  const allowed = Math.min(pages, limits.pagesPerExport + entitlements.credits);
  const truncated = allowed < pages;
  const qualityLocked = dpi > limits.maxDpi;
  const transparentLocked = transparent && !limits.transparent;
  const blocked = locked.length > 0 || qualityLocked || transparentLocked;
  const busy = phase === "working";

  /** Asks the server how many pages this export may include (daily limits, credits). */
  const reserve = async (): Promise<number | null> => {
    try {
      const res = await fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: allowed, dpi, pro: [...proFeaturesUsed(settings), ...(transparent ? ["transparent"] : [])] }),
      });
      if (res.ok) return ((await res.json()) as { allowed: number }).allowed;
      // Only a real "no" (limits, Pro) stops the download; a server hiccup doesn't.
      if (res.status >= 500) return allowed;
      const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      setError(
        body.error === "daily_limit"
          ? `You've used today's ${limits.pagesPerDay} free pages. They come back within 24 hours, or a plan adds more right away.`
          : (body.message ?? "This download isn't available on your plan."),
      );
      return null;
    } catch {
      // Offline or the API is down: don't block the download over it.
      return allowed;
    }
  };

  const save = (f: { url: string; name: string }) => {
    const a = document.createElement("a");
    a.href = f.url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const run = async () => {
    if (!client || blocked) return;
    setError(null);
    const granted = await reserve();
    if (!granted) return;
    setPhase("working");
    setProgress({ done: 0, total: granted });
    // Free downloads keep the progress view (and its ad) up for a moment even
    // when rendering is instant; Pro skips straight to the file.
    const minimum = limits.ads ? new Promise((r) => setTimeout(r, 3000)) : Promise.resolve();
    try {
      const style = resolveStyle(settings.styleId);
      const title = fileTitle(settings.text);
      const [result] = await Promise.all([
        client.export(
          toDocumentSpec(settings),
          style,
          { format, dpi, maxPages: granted, effect: settings.effect, transparent: transparent && format !== "pdf", title },
          (done, total) => setProgress({ done, total }),
        ),
        minimum,
      ]);
      const ext = result.mime === "application/pdf" ? "pdf" : result.mime === "application/zip" ? "zip" : "png";
      const next = {
        url: URL.createObjectURL(new Blob([result.bytes as BlobPart], { type: result.mime })),
        name: `${title.replace(/[^\w\- ]+/g, "").trim() || "handwriting"}.${ext}`,
        pages: result.pages,
      };
      setFile(next);
      save(next);
      void refresh();
      // Free downloads always land on the ready view (it carries an ad); Pro
      // only does when it's time to ask how the pages came out.
      const ask = feedbackDue();
      setAskFeedback(ask);
      if (limits.ads || ask) setPhase("ready");
      else onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
      setPhase("options");
    } finally {
      setProgress(null);
    }
  };

  return (
    <dialog ref={ref} className={s.dialog} onClose={onClose} onCancel={(e) => busy && e.preventDefault()} aria-labelledby="export-title">
      <div className={s.body}>
        <header className={s.head}>
          <h2 id="export-title">{phase === "working" ? "Writing your pages…" : phase === "ready" ? "Your download is ready" : "Download"}</h2>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close" disabled={busy}>
            ×
          </button>
        </header>

        {phase === "working" && (
          <div className={s.working}>
            <div className={s.progress} role="progressbar" aria-valuemin={0} aria-valuemax={progress?.total ?? 1} aria-valuenow={progress?.done ?? 0}>
              <div style={{ width: `${((progress?.done ?? 0) / Math.max(1, progress?.total ?? 1)) * 100}%` }} />
              <span>{progress ? `Page ${Math.min(progress.done + 1, progress.total)} of ${progress.total}` : "Starting…"}</span>
            </div>
            <p className={s.hintText}>Every page is written at full size in your browser. Long documents take a few seconds.</p>
          </div>
        )}

        {phase === "ready" && file && (
          <div className={s.ready}>
            <p>
              <CheckCircle2 aria-hidden="true" />
              {file.pages} {file.pages === 1 ? "page" : "pages"} saved as <strong>{file.name}</strong>
            </p>
            <div className={s.readyActions}>
              <Button type="button" variant="secondary" onClick={() => save(file)}>
                <Download aria-hidden="true" />
                Download again
              </Button>
              <Button type="button" onClick={onClose}>
                Done
              </Button>
            </div>
            {askFeedback && (
              <FeedbackForm
                context={{
                  source: "download",
                  style: settings.styleId,
                  paper: settings.paperId,
                  pen: settings.penId,
                  pages: file.pages,
                  format,
                  dpi,
                  effect: settings.effect,
                }}
                onSkip={() => setAskFeedback(false)}
              />
            )}
            {limits.ads && (
              <p className={s.hintText}>
                <a href="/pricing">A plan</a> skips this step, removes ads and unlocks every hand.
              </p>
            )}
          </div>
        )}

        {phase === "options" && (
          <>
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
                value={String(dpi)}
                onChange={(v) => setDpi(Number(v) as Dpi)}
                options={RESOLUTIONS.map((r) => ({
                  value: String(r.dpi),
                  // 2K comes with any plan; 4K with Month or Year.
                  label: (
                    <>
                      {r.name} {r.dpi > limits.maxDpi && <ProTag label={r.dpi > 200 ? "Month" : "Pro"} />}
                    </>
                  ),
                }))}
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
              {truncated &&
                (limits.ads ? (
                  <> · The free plan includes {limits.pagesPerDay} pages a day</>
                ) : (
                  <> · Up to {limits.pagesPerExport + entitlements.credits} pages in one download</>
                ))}
            </p>

            {(locked.length > 0 || qualityLocked || transparentLocked) && (
              <div className={s.notice} role="status">
                <p>{limits.ads ? "This page uses Pro choices:" : "These need the Month or Year plan:"}</p>
                <ul>
                  {locked.map((l) => (
                    <li key={l.key}>{l.label}</li>
                  ))}
                  {qualityLocked && <li>{resolutionName(dpi)} quality</li>}
                  {transparentLocked && <li>Transparent background</li>}
                </ul>
                <div className={s.noticeActions}>
                  {locked.some((l) => l.key === "style") && isMine(settings.styleId) ? (
                    <BuyButton product="my_hand" size="s">
                      Unlock your handwriting
                    </BuyButton>
                  ) : (
                    <ButtonLink href="/pricing" size="s">
                      See plans
                    </ButtonLink>
                  )}
                  <Button
                    type="button"
                    size="s"
                    variant="secondary"
                    onClick={() => {
                      patch(Object.assign({}, ...locked.map((l) => l.reset)));
                      setDpi(Math.min(dpi, limits.maxDpi) as Dpi);
                      setTransparent(false);
                    }}
                  >
                    {limits.ads ? "Use free options" : "Use what my plan includes"}
                  </Button>
                </div>
              </div>
            )}

            {truncated && !blocked && (
              <p className={s.upsell}>
                Need all {pages} pages? <a href="/pricing">A plan or a page pack</a> covers it.
              </p>
            )}

            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}

            <div className={s.actions}>
              <Button type="button" size="l" wide disabled={blocked || !client} onClick={run}>
                <Download aria-hidden="true" />
                Download {allowed} {allowed === 1 ? "page" : "pages"} as {format.toUpperCase()}
              </Button>
            </div>
          </>
        )}

        {phase !== "options" && <AdSlot placement="export" />}
      </div>
    </dialog>
  );
}
