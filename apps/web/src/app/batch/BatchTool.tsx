"use client";
import { PENS, STYLES, penById, styleById } from "@truehand/catalog";
import type { PaperSize } from "@truehand/engine";
import { zipSync } from "fflate";
import { PDFDocument } from "pdf-lib";
import { Download, FileSpreadsheet, PenLine, SlidersHorizontal, Upload } from "lucide-react";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { AdSlot } from "@/components/AdSlot";
import { Button } from "@/components/ui/Button";
import { ProTag } from "@/components/ui/ProTag";
import { Segmented } from "@/components/ui/Segmented";
import { useHandFont } from "@/editor/handFonts";
import { QuickPickers } from "@/editor/Pickers";
import { Preview } from "@/editor/Preview";
import { RichText } from "@/editor/RichText";
import { SettingsPanel } from "@/editor/SettingsPanel";
import { usePreview } from "@/editor/usePreview";
import { useSettings } from "@/editor/useSettings";
import { parseCsv, type Table } from "@/lib/csv";
import { useEntitlements } from "@/lib/entitlements-client";
import { proFeaturesUsed, toDocumentSpec, type EditorSettings } from "@/lib/settings";
import { fillTemplate, rowFileName, templateFields } from "@/lib/template";
import e from "@/editor/Editor.module.css";
import s from "./batch.module.css";

const SAMPLE_CSV = `first_name,last_name,company,city
Maya,Rao,Northwind Traders,Pune
Sam,Okafor,Blue Harbor,Lagos
Lucía,Fernández,Acme Studio,Madrid
Tom,Becker,Lindenhof GmbH,Hamburg`;

const SAMPLE_TEMPLATE = `Dear {{first_name}},
Thank you for choosing us this year. It was a pleasure working with the team at {{company}}, and I hope the new office in {{city}} is treating you well.
If there is anything we can do, just reply to this note.
Warm wishes,
Priya`;

const FORMATS: { id: string; label: string; size: PaperSize; paperId?: string }[] = [
  { id: "a4", label: "A4 letter", size: "a4" },
  { id: "letter", label: "US Letter", size: "letter" },
  { id: "a6", label: "A6 card", size: "a6", paperId: "card" },
  { id: "card-5x7", label: "5×7 card", size: "card-5x7", paperId: "card" },
  { id: "postcard-4x6", label: "4×6 postcard", size: "postcard-4x6", paperId: "card" },
  { id: "envelope-dl", label: "DL envelope", size: "envelope-dl", paperId: "envelope" },
  { id: "envelope-10", label: "#10 envelope", size: "envelope-10", paperId: "envelope" },
];

type Output = "zip-pdf" | "combined-pdf" | "zip-png";
type Tab = "data" | "template" | "style";
const FREE_ROWS = 3;

export function BatchTool() {
  const { entitlements, refresh } = useEntitlements();
  const { settings, update, patch } = useSettings({ text: SAMPLE_TEMPLATE, paperId: "plain", styleId: "mira", fontSize: 1.1 }, "truehand:batch:v1");
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const [tab, setTab] = useState<Tab>("data");
  const [rowIndex, setRowIndex] = useState(0);
  const [output, setOutput] = useState<Output>("zip-pdf");
  const [nameColumn, setNameColumn] = useState<string | null>("first_name");
  const [transparent, setTransparent] = useState(false);
  const [job, setJob] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const cancelled = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const table: Table = useMemo(() => parseCsv(csv), [csv]);
  const row = table.rows[Math.min(rowIndex, Math.max(0, table.rows.length - 1))] ?? {};
  const filled = useMemo(() => fillTemplate(settings.text, row), [settings.text, row]);
  const fields = useMemo(() => templateFields(settings.text), [settings.text]);
  const previewSettings: EditorSettings = useMemo(() => ({ ...settings, text: filled.text }), [settings, filled.text]);
  const preview = usePreview(previewSettings);
  const font = useHandFont(settings.styleId);
  const pen = penById(settings.penId) ?? PENS[0]!;
  const format = FORMATS.find((f) => f.size === settings.size) ?? FORMATS[0]!;
  const limitRows = entitlements.limits.batch ? table.rows.length : Math.min(FREE_ROWS, table.rows.length);

  const onFile = async (ev: ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    setCsv(await f.text());
    setRowIndex(0);
    ev.target.value = "";
  };

  const insertField = (name: string) => update("text", `${settings.text}${settings.text.endsWith(" ") || !settings.text ? "" : " "}{{${name}}}`);

  const generate = async () => {
    const client = preview.client;
    if (!client || !table.rows.length) return;
    setMessage(null);
    const rows = table.rows.slice(0, limitRows);
    const pro = [...proFeaturesUsed(settings), ...(transparent ? ["transparent"] : [])];
    try {
      const res = await fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: rows.length, dpi: entitlements.limits.maxDpi, pro }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setMessage(body.message ?? "This batch isn't available on your plan.");
        return;
      }
    } catch {
      // Offline: continue with the local limits.
    }

    cancelled.current = false;
    setJob({ done: 0, total: rows.length });
    const style = styleById(settings.styleId) ?? STYLES[0]!;
    const files: { name: string; bytes: Uint8Array }[] = [];
    const started = Date.now();
    try {
      for (const [i, r] of rows.entries()) {
        if (cancelled.current) break;
        const text = fillTemplate(settings.text, r).text;
        const name = rowFileName(r, nameColumn, i);
        const png = output === "zip-png";
        const result = await client.export(toDocumentSpec({ ...settings, text }), style, {
          format: png ? "png" : "pdf",
          dpi: entitlements.limits.maxDpi,
          maxPages: 20,
          effect: settings.effect,
          transparent: png && transparent,
          title: name,
        });
        files.push({ name: `${name}.${result.mime === "application/pdf" ? "pdf" : result.mime === "application/zip" ? "zip" : "png"}`, bytes: result.bytes });
        setJob({ done: i + 1, total: rows.length });
      }
      if (!files.length) return;
      // Free batches keep the progress (and its ad) visible for a moment.
      if (entitlements.limits.ads) await new Promise((r) => setTimeout(r, Math.max(0, 3000 - (Date.now() - started))));

      let blob: Blob;
      let fileName: string;
      if (output === "combined-pdf") {
        const merged = await PDFDocument.create();
        merged.setTitle("Truehand batch");
        for (const f of files) {
          const doc = await PDFDocument.load(f.bytes);
          for (const p of await merged.copyPages(doc, doc.getPageIndices())) merged.addPage(p);
        }
        blob = new Blob([(await merged.save()) as BlobPart], { type: "application/pdf" });
        fileName = "truehand-batch.pdf";
      } else {
        const used = new Map<string, number>();
        const entries: Record<string, Uint8Array> = {};
        for (const f of files) {
          const n = used.get(f.name) ?? 0;
          used.set(f.name, n + 1);
          entries[n ? f.name.replace(/(\.\w+)$/, `-${n + 1}$1`) : f.name] = f.bytes;
        }
        blob = new Blob([zipSync(entries, { level: 0 }) as BlobPart], { type: "application/zip" });
        fileName = "truehand-batch.zip";
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMessage(`${files.length} ${files.length === 1 ? "letter" : "letters"} downloaded as ${fileName}.`);
      void refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Batch failed");
    } finally {
      setJob(null);
    }
  };

  return (
    <div className={e.workspace}>
      <div className={e.left}>
        <div className={e.tabs} role="tablist" aria-label="Batch">
          <button type="button" role="tab" aria-selected={tab === "data"} onClick={() => setTab("data")}>
            <FileSpreadsheet aria-hidden="true" />
            Data
          </button>
          <button type="button" role="tab" aria-selected={tab === "template"} onClick={() => setTab("template")}>
            <PenLine aria-hidden="true" />
            Template
          </button>
          <button type="button" role="tab" aria-selected={tab === "style"} onClick={() => setTab("style")}>
            <SlidersHorizontal aria-hidden="true" />
            Style &amp; output
          </button>
          <span className={e.count}>
            {table.rows.length} {table.rows.length === 1 ? "row" : "rows"}
          </span>
        </div>

        <div className={e.panel} hidden={tab !== "data"}>
          <div className={s.data}>
            <div className={s.dataHead}>
              <p>Paste a spreadsheet as CSV, or upload a .csv file. The first row is the column names.</p>
              <input ref={fileInput} type="file" accept=".csv,text/csv,text/plain" hidden onChange={onFile} />
              <Button variant="secondary" size="s" onClick={() => fileInput.current?.click()}>
                <Upload aria-hidden="true" />
                Upload CSV
              </Button>
            </div>
            <label className="visually-hidden" htmlFor="csv">
              CSV data
            </label>
            <textarea id="csv" className={s.csv} value={csv} spellCheck={false} onChange={(ev) => setCsv(ev.target.value)} />
            {table.rows.length > 0 && (
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      {table.headers.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.slice(0, 50).map((r, i) => (
                      <tr key={i} aria-selected={i === rowIndex} onClick={() => setRowIndex(i)}>
                        <td>{i + 1}</td>
                        {table.headers.map((h) => (
                          <td key={h}>{r[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className={e.panel} hidden={tab !== "template"}>
          <RichText
            value={settings.text}
            onChange={(v) => update("text", v)}
            family={font.family}
            ratio={font.ratio}
            ink={settings.inkColor ?? pen.spec.color}
            pickers={
              <>
                <QuickPickers settings={settings} update={update} />
                <span className={s.fieldsLabel}>Insert field</span>
                {table.headers.map((h) => (
                  <button key={h} type="button" className={s.field} onClick={() => insertField(h)}>
                    {`{{${h}}}`}
                  </button>
                ))}
              </>
            }
            footer={
              <p className={s.fieldNote} data-warn={filled.missing.length > 0 || undefined}>
                {filled.missing.length
                  ? `No column for: ${filled.missing.join(", ")}. Those fields come out empty.`
                  : `Uses ${fields.length ? fields.map((f) => `{{${f}}}`).join(", ") : "no fields yet"}.`}
              </p>
            }
          />
        </div>

        <div className={`${e.panel} ${s.styleTab}`} hidden={tab !== "style"}>
          <div className={s.outputs}>
            <div className={s.outputGroup}>
              <h3>Each item is a</h3>
              <div className={s.formats}>
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={s.format}
                    aria-pressed={f.size === settings.size}
                    onClick={() =>
                      patch({
                        size: f.size,
                        ...(f.paperId
                          ? { paperId: f.paperId }
                          : f.size !== settings.size && ["card", "envelope"].includes(settings.paperId)
                            ? { paperId: "plain" }
                            : {}),
                      })
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={s.outputGroup}>
              <h3>Download as</h3>
              <Segmented
                label="Download as"
                value={output}
                onChange={setOutput}
                options={[
                  { value: "zip-pdf", label: "PDF per row" },
                  { value: "combined-pdf", label: "One PDF to print" },
                  { value: "zip-png", label: "PNG per row" },
                ]}
              />
              {output === "zip-png" && (
                <label className={s.check}>
                  <input type="checkbox" checked={transparent} onChange={(ev) => setTransparent(ev.target.checked)} />
                  Transparent background, ink only {!entitlements.limits.transparent && <ProTag />}
                </label>
              )}
              <label className={s.select}>
                <span>Name files by</span>
                <select value={nameColumn ?? ""} onChange={(ev) => setNameColumn(ev.target.value || null)}>
                  <option value="">Row number</option>
                  {table.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <SettingsPanel settings={settings} update={update} embedded />
        </div>
      </div>

      <section className={e.right} aria-label="Preview">
        <header className={e.previewHead}>
          <div className={e.previewTitle}>
            <strong>Row {Math.min(rowIndex + 1, table.rows.length)}</strong>
            <span className={e.meta}>
              of {table.rows.length} · {format.label}
            </span>
          </div>
          <div className={e.previewActions}>
            <Button onClick={generate} disabled={!preview.client || !table.rows.length || job !== null}>
              <Download aria-hidden="true" />
              Generate {limitRows} {limitRows === 1 ? "letter" : "letters"}
            </Button>
          </div>
        </header>
        {!entitlements.limits.batch && table.rows.length > FREE_ROWS && (
          <p className={s.upsell}>
            Free batches include the first {FREE_ROWS} rows. <a href="/pricing">Pro</a> writes all {table.rows.length}.
          </p>
        )}
        {message && <p className={s.message}>{message}</p>}
        <div className={e.stage}>
          <Preview
            client={preview.client}
            layoutId={preview.layoutId}
            pages={preview.pages}
            size={settings.size}
            effect={settings.effect}
            busy={preview.busy}
            label="Batch preview"
          />
        </div>
      </section>

      {job && (
        <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Generating letters">
          <div className={s.sheet}>
            <h2>Writing letters…</h2>
            <div className={s.bar}>
              <div style={{ width: `${(job.done / Math.max(1, job.total)) * 100}%` }} />
              <span>
                {job.done} of {job.total}
              </span>
            </div>
            <AdSlot placement="export" />
            <Button variant="secondary" onClick={() => (cancelled.current = true)}>
              Stop after this one
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
