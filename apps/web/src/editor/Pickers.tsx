"use client";
import { PAPERS, PENS, STYLES, paperById, penById, styleById, type StyleCategory } from "@truehand/catalog";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { ProTag } from "@/components/ui/ProTag";
import { canUseStyle, useEntitlements } from "@/lib/entitlements-client";
import type { EditorSettings } from "@/lib/settings";
import s from "./Pickers.module.css";

type Update = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void;

const CATEGORIES: { id: StyleCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "casual", label: "Everyday" },
  { id: "print", label: "Print" },
  { id: "cursive", label: "Cursive" },
  { id: "marker", label: "Marker" },
  { id: "elegant", label: "Elegant" },
];

export function HandList({ value, onPick }: { value: string; onPick: (id: string) => void }) {
  const { entitlements } = useEntitlements();
  const [category, setCategory] = useState<StyleCategory | "all">("all");
  const list = STYLES.filter((st) => category === "all" || st.category === category);
  return (
    <div className={s.hands}>
      <div className={s.chips} role="tablist" aria-label="Handwriting categories">
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={category === c.id} className={s.chip} onClick={() => setCategory(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <ul className={s.handList}>
        {list.map((st) => (
          <li key={st.id}>
            <button type="button" className={s.hand} aria-pressed={st.id === value} onClick={() => onPick(st.id)} title={st.blurb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/specimens/name-${st.id}.webp`} alt={st.name} width={250} height={62} loading="lazy" decoding="async" />
              {!canUseStyle(entitlements, st.id, st.tier) && <ProTag />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PaperGrid({ value, onPick }: { value: string; onPick: (id: string) => void }) {
  const { entitlements } = useEntitlements();
  return (
    <ul className={s.papers}>
      {PAPERS.map((p) => (
        <li key={p.id}>
          <button type="button" className={s.paper} aria-pressed={p.id === value} onClick={() => onPick(p.id)} title={p.blurb}>
            <span className={s.swatch} style={{ backgroundImage: `url(/specimens/paper-${p.id}.webp)` }} />
            <span className={s.paperName}>
              {p.name}
              {p.tier === "pro" && !entitlements.limits.proPapers && <ProTag />}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function PenList({ settings, update }: { settings: EditorSettings; update: Update }) {
  const { entitlements } = useEntitlements();
  return (
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
            <span className={s.dot} style={{ background: p.spec.color }} />
            <span className={s.penName}>{p.name}</span>
            {p.tier === "pro" && !entitlements.limits.proPens && <ProTag />}
          </button>
        </li>
      ))}
      <li>
        <label className={s.pen} aria-pressed={Boolean(settings.inkColor)}>
          <input className={s.color} type="color" value={settings.inkColor ?? "#1f3c8f"} onChange={(e) => update("inkColor", e.target.value)} aria-label="Custom ink colour" />
          <span className={s.penName}>Any colour</span>
          {!entitlements.limits.customInk && <ProTag />}
        </label>
      </li>
    </ul>
  );
}

/** Hand, paper and ink: the three choices people make most, kept in the toolbar. */
export function QuickPickers({ settings, update }: { settings: EditorSettings; update: Update }) {
  const { entitlements } = useEntitlements();
  const style = styleById(settings.styleId) ?? STYLES[0]!;
  const paper = paperById(settings.paperId) ?? PAPERS[0]!;
  const pen = penById(settings.penId) ?? PENS[0]!;
  const ink = settings.inkColor ?? pen.spec.color;
  return (
    <>
      <Dropdown
        label="Handwriting"
        width={330}
        trigger={
          <>
            <span className={s.triggerLabel}>Hand</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.triggerHand} src={`/specimens/name-${style.id}.webp`} alt={style.name} height={26} />
            {!canUseStyle(entitlements, style.id, style.tier) && <ProTag />}
            <ChevronDown className={s.chev} aria-hidden="true" />
          </>
        }
      >
        {(close) => (
          <HandList
            value={settings.styleId}
            onPick={(id) => {
              update("styleId", id);
              close();
            }}
          />
        )}
      </Dropdown>
      <Dropdown
        label="Paper"
        width={360}
        trigger={
          <>
            <span className={s.triggerLabel}>Paper</span>
            <span>{paper.name}</span>
            {paper.tier === "pro" && !entitlements.limits.proPapers && <ProTag />}
            <ChevronDown className={s.chev} aria-hidden="true" />
          </>
        }
      >
        {(close) => (
          <PaperGrid
            value={settings.paperId}
            onPick={(id) => {
              update("paperId", id);
              close();
            }}
          />
        )}
      </Dropdown>
      <Dropdown
        label="Pen and ink"
        width={320}
        trigger={
          <>
            <span className={s.inkDot} style={{ background: ink }} />
            <span>{settings.inkColor ? "Custom ink" : pen.name}</span>
            <ChevronDown className={s.chev} aria-hidden="true" />
          </>
        }
      >
        {() => <PenList settings={settings} update={update} />}
      </Dropdown>
    </>
  );
}
