"use client";
import { useRef, type KeyboardEvent } from "react";
import s from "./TextPanel.module.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
  words: number;
  pages: number;
}

type Action = { label: string; title: string; run: (el: HTMLTextAreaElement) => [string, number, number] };

/** Wraps the selection (or the word at the caret) in a marker pair. */
function wrap(el: HTMLTextAreaElement, marker: string): [string, number, number] {
  const { value, selectionStart: a, selectionEnd: b } = el;
  let start = a;
  let end = b;
  if (a === b) {
    while (start > 0 && /\S/.test(value[start - 1]!)) start--;
    while (end < value.length && /\S/.test(value[end]!)) end++;
  }
  const inner = value.slice(start, end);
  if (inner.startsWith(marker) && inner.endsWith(marker) && inner.length >= marker.length * 2) {
    const bare = inner.slice(marker.length, -marker.length);
    return [value.slice(0, start) + bare + value.slice(end), start, start + bare.length];
  }
  const next = value.slice(0, start) + marker + inner + marker + value.slice(end);
  return [next, start + marker.length, start + marker.length + inner.length];
}

/** Toggles a prefix on every line touched by the selection. */
function prefixLines(el: HTMLTextAreaElement, prefix: string): [string, number, number] {
  const { value, selectionStart: a, selectionEnd: b } = el;
  const lineStart = value.lastIndexOf("\n", a - 1) + 1;
  const lineEndIdx = value.indexOf("\n", b);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const all = lines.every((l) => l.startsWith(prefix));
  const changed = lines.map((l) => (all ? l.slice(prefix.length) : prefix + l.replace(/^(#{1,2} |- |\d+\. )/, ""))).join("\n");
  return [value.slice(0, lineStart) + changed + value.slice(lineEnd), lineStart, lineStart + changed.length];
}

function pageBreak(el: HTMLTextAreaElement): [string, number, number] {
  const { value, selectionEnd: b } = el;
  const insert = `${b > 0 && value[b - 1] !== "\n" ? "\n" : ""}---\n`;
  const next = value.slice(0, b) + insert + value.slice(b);
  return [next, b + insert.length, b + insert.length];
}

const ACTIONS: Action[] = [
  { label: "H", title: "Heading (# at line start)", run: (el) => prefixLines(el, "# ") },
  { label: "•", title: "Bullet list (- at line start)", run: (el) => prefixLines(el, "- ") },
  { label: "B", title: "Bold: pressed harder (Ctrl+B)", run: (el) => wrap(el, "**") },
  { label: "U", title: "Underline (Ctrl+U)", run: (el) => wrap(el, "__") },
  { label: "S", title: "Strike through (Ctrl+Shift+X)", run: (el) => wrap(el, "~~") },
  { label: "HL", title: "Highlighter (Ctrl+Shift+H)", run: (el) => wrap(el, "==") },
  { label: "¶↓", title: "New page (--- on its own line)", run: pageBreak },
];

export function TextPanel({ value, onChange, words, pages }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (action: Action) => {
    const el = ref.current;
    if (!el) return;
    const [next, a, b] = action.run(el);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a, b);
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    const key = e.key.toLowerCase();
    const action =
      key === "b" && !e.shiftKey
        ? ACTIONS[2]
        : key === "u" && !e.shiftKey
          ? ACTIONS[3]
          : key === "x" && e.shiftKey
            ? ACTIONS[4]
            : key === "h" && e.shiftKey
              ? ACTIONS[5]
              : undefined;
    if (action) {
      e.preventDefault();
      apply(action);
    }
  };

  return (
    <div className={s.panel}>
      <div className={s.toolbar} role="toolbar" aria-label="Formatting">
        {ACTIONS.map((a) => (
          <button key={a.label} type="button" className={s.tool} data-tool={a.label} title={a.title} aria-label={a.title} onClick={() => apply(a)}>
            {a.label}
          </button>
        ))}
      </div>
      <label htmlFor="editor-text" className="visually-hidden">
        Your text
      </label>
      <textarea
        id="editor-text"
        ref={ref}
        className={s.text}
        value={value}
        spellCheck
        placeholder="Type or paste your text. It is written out by hand on the right."
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className={s.status}>
        <span>
          {words.toLocaleString("en")} {words === 1 ? "word" : "words"} · {pages} {pages === 1 ? "page" : "pages"}
        </span>
        <span className={s.private}>Stays on this device</span>
      </div>
    </div>
  );
}
