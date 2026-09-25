"use client";
import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { ProTag } from "@/components/ui/ProTag";
import { Segmented } from "@/components/ui/Segmented";
import { Slider } from "@/components/ui/Slider";
import { useEntitlements } from "@/lib/entitlements-client";
import type { EditorSettings } from "@/lib/settings";
import { HandList, PaperGrid, PenList } from "./Pickers";
import s from "./SettingsPanel.module.css";

type Update = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void;

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={s.group}>
      <h3 className={s.groupTitle}>{title}</h3>
      <div className={s.fields}>{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  );
}

const handLabel = (m: number) => (m < 0.2 ? "Careful" : m < 0.45 ? "Natural" : m < 0.7 ? "Quick" : "Rushed");

export function SettingsPanel({ settings, update }: { settings: EditorSettings; update: Update }) {
  const { entitlements } = useEntitlements();
  const pro = entitlements.limits;
  return (
    <div className={s.panel}>
      <div className={s.scroll}>
        <Group title="Handwriting">
          <HandList value={settings.styleId} onPick={(id) => update("styleId", id)} />
        </Group>
        <Group title="Paper">
          <PaperGrid value={settings.paperId} onPick={(id) => update("paperId", id)} />
        </Group>
        <Group title="Pen">
          <PenList settings={settings} update={update} />
        </Group>
        <Group title="Writing">
          <Slider
            label="Size"
            value={settings.fontSize}
            min={0.75}
            max={1.45}
            step={0.01}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => update("fontSize", v)}
          />
          <Slider label="Messiness" value={settings.messiness} min={0} max={1} step={0.01} format={handLabel} onChange={(v) => update("messiness", v)} />
          <Slider
            label="Slant"
            value={settings.slant}
            min={-12}
            max={16}
            step={0.5}
            format={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}°`}
            onChange={(v) => update("slant", v)}
          />
          <Slider
            label="Letter spacing"
            value={settings.letterSpacing}
            min={-0.06}
            max={0.2}
            step={0.005}
            format={(v) => `${v >= 0 ? "+" : ""}${Math.round(v * 100)}`}
            onChange={(v) => update("letterSpacing", v)}
          />
          <Slider
            label="Fatigue"
            after={!pro.fatigue ? <ProTag /> : null}
            hint="Writing loosens toward the bottom of each page, the way a tired hand does."
            value={settings.fatigue}
            min={0}
            max={1}
            step={0.01}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => update("fatigue", v)}
          />
          <button type="button" className={s.reroll} onClick={() => update("seed", (Math.random() * 1e9) >>> 0)}>
            <RefreshCw aria-hidden="true" />
            Rewrite with a fresh hand
          </button>
        </Group>

        <Group title="Page">
          <Field label="Paper size">
            <Segmented
              label="Paper size"
              value={settings.size}
              onChange={(v) => update("size", v)}
              options={[
                { value: "a4", label: "A4" },
                { value: "letter", label: "US Letter" },
                { value: "a5", label: "A5" },
              ]}
            />
          </Field>
          <Field label="Punched holes">
            <Segmented
              label="Punched holes"
              value={settings.holes}
              onChange={(v) => update("holes", v)}
              options={[
                { value: "none", label: "None" },
                { value: "two", label: "Two" },
                { value: "three", label: "Three" },
              ]}
            />
          </Field>
          <div className={s.pair}>
            <Field label="Top left">
              <input className={s.input} value={settings.headerLeft} placeholder="Name, class" onChange={(e) => update("headerLeft", e.target.value)} />
            </Field>
            <Field label="Top right">
              <input className={s.input} value={settings.headerRight} placeholder="Date, subject" onChange={(e) => update("headerRight", e.target.value)} />
            </Field>
          </div>
          <label className={s.check}>
            <input type="checkbox" checked={settings.pageNumbers} onChange={(e) => update("pageNumbers", e.target.checked)} />
            Number the pages
          </label>
          <label className={s.check}>
            <input type="checkbox" checked={settings.underlineHeadings} onChange={(e) => update("underlineHeadings", e.target.checked)} />
            Underline headings
          </label>
          <label className={s.check}>
            <input type="checkbox" checked={settings.paragraphGap > 0} onChange={(e) => update("paragraphGap", e.target.checked ? 1 : 0)} />
            Skip a line between paragraphs
          </label>
        </Group>

        <Group title="Finish">
          <Segmented
            label="Finish"
            value={settings.effect}
            onChange={(v) => update("effect", v)}
            options={[
              { value: "none", label: "Clean" },
              { value: "scan", label: <>Scanned {!pro.effects && <ProTag />}</> },
              { value: "photo", label: <>Phone photo {!pro.effects && <ProTag />}</> },
            ]}
          />
          <p className={s.note}>Scanned adds a slight tilt and scanner contrast. Phone photo lays the page on a desk with uneven light.</p>
        </Group>
      </div>
    </div>
  );
}
