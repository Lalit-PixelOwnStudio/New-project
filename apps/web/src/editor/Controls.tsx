"use client";
import { PAPERS, PENS, STYLES, type StyleCategory } from "@truehand/catalog";
import { useState, type ReactNode } from "react";
import { ProTag } from "@/components/ui/ProTag";
import { Segmented } from "@/components/ui/Segmented";
import { Slider } from "@/components/ui/Slider";
import { canUseStyle, useEntitlements } from "@/lib/entitlements-client";
import type { EditorSettings } from "@/lib/settings";
import s from "./Controls.module.css";

type Update = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void;

const CATEGORIES: { id: StyleCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "casual", label: "Everyday" },
  { id: "print", label: "Print" },
  { id: "cursive", label: "Cursive" },
  { id: "marker", label: "Marker" },
  { id: "elegant", label: "Elegant" },
];

function Section({ title, meta, children, id }: { title: string; meta?: ReactNode; children: ReactNode; id: string }) {
  return (
    <section className={s.section} aria-labelledby={id}>
      <header className={s.sectionHead}>
        <h2 id={id}>{title}</h2>
        {meta}
      </header>
      {children}
    </section>
  );
}

export function Controls({ settings, update }: { settings: EditorSettings; update: Update }) {
  const { entitlements } = useEntitlements();
  const [category, setCategory] = useState<StyleCategory | "all">("all");
  const styles = STYLES.filter((st) => category === "all" || st.category === category);
  const pro = entitlements.limits;
  const messiness = settings.messiness;
  const handLabel = messiness < 0.2 ? "Careful" : messiness < 0.45 ? "Natural" : messiness < 0.7 ? "Quick" : "Rushed";

  return (
    <div className={s.controls}>
      <Section id="c-hand" title="Hand" meta={<span className={s.count}>{STYLES.length}</span>}>
        <div className={s.chips} role="tablist" aria-label="Handwriting categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              className={s.chip}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <ul className={s.hands} aria-label="Handwriting styles">
          {styles.map((st) => {
            const selected = st.id === settings.styleId;
            const locked = !canUseStyle(entitlements, st.id, st.tier);
            return (
              <li key={st.id}>
                <button
                  type="button"
                  className={s.hand}
                  aria-pressed={selected}
                  onClick={() => update("styleId", st.id)}
                  title={st.blurb}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/specimens/name-${st.id}.webp`} alt={st.name} width={250} height={62} loading="lazy" decoding="async" />
                  <span className={s.handMeta}>
                    {locked && <ProTag />}
                    <span className={s.cat}>{st.category === "casual" ? "everyday" : st.category}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="c-paper" title="Paper">
        <ul className={s.papers}>
          {PAPERS.map((p) => (
            <li key={p.id}>
              <button type="button" className={s.paper} aria-pressed={p.id === settings.paperId} onClick={() => update("paperId", p.id)} title={p.blurb}>
                <span className={s.paperSwatch} style={{ backgroundImage: `url(/specimens/paper-${p.id}.webp)` }} />
                <span className={s.paperName}>
                  {p.name}
                  {p.tier === "pro" && !pro.proPapers && <ProTag />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="c-pen" title="Pen">
        <ul className={s.pens}>
          {PENS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={s.pen}
                aria-pressed={p.id === settings.penId && !settings.inkColor}
                onClick={() => {
                  update("penId", p.id);
                  update("inkColor", null);
                }}
              >
                <span className={s.ink} style={{ background: p.spec.color }} data-kind={p.spec.kind} />
                <span className={s.penName}>{p.name}</span>
                {p.tier === "pro" && !pro.proPens && <ProTag />}
              </button>
            </li>
          ))}
          <li>
            <label className={s.pen} data-custom aria-pressed={Boolean(settings.inkColor)}>
              <input
                type="color"
                value={settings.inkColor ?? "#1f3c8f"}
                onChange={(e) => update("inkColor", e.target.value)}
                aria-label="Custom ink colour"
              />
              <span className={s.penName}>Any colour</span>
              {!pro.customInk && <ProTag />}
            </label>
          </li>
        </ul>
      </Section>

      <Section id="c-writing" title="Writing">
        <div className={s.stack}>
          <Slider label="Size" value={settings.fontSize} min={0.75} max={1.45} step={0.01} format={(v) => `${v.toFixed(2)}×`} onChange={(v) => update("fontSize", v)} />
          <Slider label="Messiness" value={messiness} min={0} max={1} step={0.01} format={() => handLabel} onChange={(v) => update("messiness", v)} />
          <Slider label="Slant" value={settings.slant} min={-12} max={16} step={0.5} format={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}°`} onChange={(v) => update("slant", v)} />
          <Slider
            label="Fatigue"
            after={!pro.fatigue ? <ProTag /> : null}
            hint="Writing loosens toward the bottom of each page."
            value={settings.fatigue}
            min={0}
            max={1}
            step={0.01}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => update("fatigue", v)}
          />
          <Slider label="Letter spacing" value={settings.letterSpacing} min={-0.06} max={0.2} step={0.005} format={(v) => `${v >= 0 ? "+" : ""}${v.toFixed(3)} em`} onChange={(v) => update("letterSpacing", v)} />
          <button type="button" className={s.reroll} onClick={() => update("seed", (Math.random() * 1e9) >>> 0)}>
            <span>Rewrite with a fresh hand</span>
            <span className={s.seed}>#{String(settings.seed % 10000).padStart(4, "0")}</span>
          </button>
        </div>
      </Section>

      <Section id="c-page" title="Page">
        <div className={s.stack}>
          <Field label="Size">
            <Segmented
              label="Paper size"
              value={settings.size}
              onChange={(v) => update("size", v)}
              options={[
                { value: "a4", label: "A4" },
                { value: "letter", label: "Letter" },
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
              <input className={s.input} value={settings.headerLeft} placeholder="Name" onChange={(e) => update("headerLeft", e.target.value)} />
            </Field>
            <Field label="Top right">
              <input className={s.input} value={settings.headerRight} placeholder="Date" onChange={(e) => update("headerRight", e.target.value)} />
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
        </div>
      </Section>

      <Section id="c-look" title="Finish">
        <Segmented
          label="Finish"
          value={settings.effect}
          onChange={(v) => update("effect", v)}
          options={[
            { value: "none", label: "Clean" },
            { value: "scan", label: <>Scan {!pro.effects && <ProTag />}</> },
            { value: "photo", label: <>Photo {!pro.effects && <ProTag />}</> },
          ]}
        />
      </Section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      {children}
    </div>
  );
}
