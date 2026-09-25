import { parseDocument, type Block, type Mark, type Span } from "@truehand/engine/markup";
import type { JSONContent } from "@tiptap/react";

/**
 * The editor edits rich text; the engine reads Truehand markup. These two
 * functions convert between them without losing anything the engine can draw.
 */

const MARK_TO_TIPTAP: Record<Mark, string> = { bold: "bold", underline: "underline", strike: "strike", highlight: "highlight" };
const TIPTAP_TO_MARKER: Record<string, string> = { bold: "**", underline: "__", strike: "~~", highlight: "==" };

function inline(spans: Span[]): JSONContent[] {
  return spans
    .filter((s) => s.text)
    .map((s) => ({
      type: "text",
      text: s.text,
      ...(s.marks.length ? { marks: s.marks.map((m) => ({ type: MARK_TO_TIPTAP[m] })) } : {}),
    }));
}

const para = (spans: Span[]): JSONContent => {
  const content = inline(spans);
  return content.length ? { type: "paragraph", content } : { type: "paragraph" };
};

export function markupToDoc(text: string): JSONContent {
  const blocks: Block[] = parseDocument(text);
  const content: JSONContent[] = [];
  // Stack of open lists, one per depth.
  let lists: { node: JSONContent; ordered: boolean }[] = [];

  const closeLists = () => {
    lists = [];
  };

  for (const b of blocks) {
    if (b.kind !== "item") closeLists();
    switch (b.kind) {
      case "paragraph":
        content.push(para(b.spans));
        break;
      case "heading":
        content.push({ type: "heading", attrs: { level: b.level }, content: inline(b.spans) });
        break;
      case "blank":
        content.push({ type: "paragraph" });
        break;
      case "break":
        content.push({ type: "horizontalRule" });
        break;
      case "item": {
        const ordered = /^\d/.test(b.marker);
        const item: JSONContent = { type: "listItem", content: [para(b.spans)] };
        const depth = Math.min(b.depth, lists.length);
        lists = lists.slice(0, depth + 1);
        let current = lists[depth];
        if (!current || current.ordered !== ordered) {
          const node: JSONContent = {
            type: ordered ? "orderedList" : "bulletList",
            ...(ordered ? { attrs: { start: Number.parseInt(b.marker, 10) || 1 } } : {}),
            content: [],
          };
          current = { node, ordered };
          if (depth === 0) content.push(node);
          else {
            const parentItems = lists[depth - 1]!.node.content!;
            const parent = parentItems[parentItems.length - 1]!;
            parent.content = [...(parent.content ?? []), node];
          }
          lists[depth] = current;
          lists = lists.slice(0, depth + 1);
        }
        current.node.content!.push(item);
        break;
      }
    }
  }
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

/** Escapes text so the markup parser reads it literally. */
function escapeText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/([*_~=])\1/g, "\\$1\\$1");
}

function inlineMarkup(nodes: JSONContent[] | undefined): string {
  if (!nodes) return "";
  let out = "";
  for (const n of nodes) {
    if (n.type === "hardBreak") {
      out += "\n";
      continue;
    }
    if (n.type !== "text" || !n.text) continue;
    const markers = (n.marks ?? []).map((m) => TIPTAP_TO_MARKER[m.type]).filter(Boolean) as string[];
    let text = escapeText(n.text);
    // Markers must hug the text, so move edge spaces outside them.
    const lead = /^\s*/.exec(text)![0];
    const trail = /\s*$/.exec(text)![0];
    const core = text.slice(lead.length, text.length - trail.length);
    text = core ? lead + markers.join("") + core + [...markers].reverse().join("") + trail : text;
    out += text;
  }
  return out;
}

/** Keeps a paragraph that happens to look like a heading or list from becoming one. */
function guardLine(line: string) {
  return /^(#{1,2}\s|[-*•]\s|\d{1,3}[.)]\s|[a-zA-Z][.)]\s)/.test(line) || /^\s*(-{3,}|_{3,}|\*{3,})\s*$/.test(line) ? `\\${line}` : line;
}

function listMarkup(list: JSONContent, depth: number, lines: string[]) {
  let n = (list.attrs?.start as number | undefined) ?? 1;
  for (const item of list.content ?? []) {
    const indent = "  ".repeat(depth);
    let first = true;
    for (const child of item.content ?? []) {
      if (child.type === "bulletList" || child.type === "orderedList") {
        listMarkup(child, depth + 1, lines);
        continue;
      }
      const text = inlineMarkup(child.content);
      if (first) {
        lines.push(`${indent}${list.type === "orderedList" ? `${n}.` : "-"} ${text}`);
        first = false;
      } else {
        lines.push(guardLine(text));
      }
    }
    n++;
  }
}

export function docToMarkup(doc: JSONContent): string {
  const lines: string[] = [];
  for (const node of doc.content ?? []) {
    switch (node.type) {
      case "heading":
        lines.push(`${(node.attrs?.level as number) === 1 ? "#" : "##"} ${inlineMarkup(node.content)}`);
        break;
      case "bulletList":
      case "orderedList":
        listMarkup(node, 0, lines);
        break;
      case "horizontalRule":
        lines.push("---");
        break;
      default: {
        const text = inlineMarkup(node.content);
        for (const l of text.split("\n")) lines.push(l ? guardLine(l) : "");
      }
    }
  }
  return lines.join("\n");
}
