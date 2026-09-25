/**
 * The document format: plain text, one paragraph per line, plus a small set of
 * markers people already know from chat apps and Markdown.
 *
 *   # Heading, ## Subheading
 *   - bullet, * bullet, 1. numbered
 *   **bold**  __underline__  ~~strike~~  ==highlight==
 *   ---  on its own line starts a new page
 *   an empty line leaves a ruled line empty
 *
 * A backslash escapes the next character. Unclosed markers are kept as text.
 */

export type Mark = "bold" | "underline" | "strike" | "highlight";

export interface Span {
  text: string;
  marks: Mark[];
}

export type Block =
  | { kind: "paragraph"; spans: Span[] }
  | { kind: "heading"; level: 1 | 2; spans: Span[] }
  | { kind: "item"; marker: string; depth: number; spans: Span[] }
  | { kind: "blank" }
  | { kind: "break" };

const PAIRS: [string, Mark][] = [
  ["**", "bold"],
  ["__", "underline"],
  ["~~", "strike"],
  ["==", "highlight"],
];

/** True if the marker at `i` is followed by text and by a matching closer later on. */
function canOpen(src: string, i: number, tok: string): boolean {
  const start = i + tok.length;
  if (start >= src.length || /\s/.test(src[start]!)) return false;
  for (let j = start + 1; j < src.length; j++) {
    if (src[j] === "\\") {
      j++;
      continue;
    }
    if (src.startsWith(tok, j) && !/\s/.test(src[j - 1]!)) return true;
  }
  return false;
}

export function parseInline(src: string): Span[] {
  const spans: Span[] = [];
  const active: Mark[] = [];
  let text = "";

  const flush = () => {
    if (text) spans.push({ text, marks: [...active] });
    text = "";
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (ch === "\\" && i + 1 < src.length) {
      text += src[++i];
      continue;
    }
    const pair = PAIRS.find(([tok]) => src.startsWith(tok, i));
    if (pair) {
      const [tok, mark] = pair;
      const open = active.indexOf(mark);
      // Like Markdown: a marker closes after a non-space and opens before one.
      if (open >= 0 && i > 0 && !/\s/.test(src[i - 1]!)) {
        flush();
        active.splice(open, 1);
        i += tok.length - 1;
        continue;
      }
      if (open < 0 && canOpen(src, i, tok)) {
        flush();
        active.push(mark);
        i += tok.length - 1;
        continue;
      }
    }
    text += ch;
  }
  flush();
  return spans;
}

export function parseDocument(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      blocks.push({ kind: "blank" });
      continue;
    }
    if (/^\s*(-{3,}|_{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push({ kind: "break" });
      continue;
    }
    const heading = /^(#{1,2})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1]!.length as 1 | 2, spans: parseInline(heading[2]!) });
      continue;
    }
    const item = /^(\s*)([-*•]|\d{1,3}[.)]|[a-zA-Z][.)])\s+(.*)$/.exec(line);
    if (item) {
      const marker = item[2] === "*" || item[2] === "-" ? "•" : item[2]!;
      blocks.push({
        kind: "item",
        marker,
        depth: Math.min(3, Math.floor(item[1]!.length / 2)),
        spans: parseInline(item[3]!),
      });
      continue;
    }
    blocks.push({ kind: "paragraph", spans: parseInline(line.trim()) });
  }
  // Trailing empty lines would only add blank pages.
  while (blocks.length && blocks[blocks.length - 1]!.kind === "blank") blocks.pop();
  return blocks;
}
