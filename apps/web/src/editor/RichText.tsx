"use client";
import Highlight from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Highlighter,
  List,
  ListOrdered,
  Pilcrow,
  Redo2,
  SeparatorHorizontal,
  Strikethrough,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { docToMarkup, markupToDoc } from "./markupDoc";
import s from "./RichText.module.css";

interface Props {
  value: string;
  onChange: (markup: string) => void;
  /** CSS font family of the chosen hand, once loaded. */
  family: string | null;
  /** The hand's x-height as a fraction of font size. */
  ratio: number;
  ink: string;
  /** Extra controls shown in the toolbar's second row (hand, paper, ink pickers). */
  pickers: ReactNode;
  footer: ReactNode;
}

function ToolButton({ label, active, onClick, children, disabled }: { label: string; active?: boolean; onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" className={s.tool} aria-label={label} title={label} aria-pressed={active} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: TiptapEditor }) {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      bold: e.isActive("bold"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      highlight: e.isActive("highlight"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  return (
    <div className={s.row} role="toolbar" aria-label="Formatting">
      <div className={s.group}>
        <ToolButton label="Normal text" active={!st.h1 && !st.h2} onClick={() => c().setParagraph().run()}>
          <Pilcrow />
        </ToolButton>
        <ToolButton label="Heading" active={st.h1} onClick={() => c().toggleHeading({ level: 1 }).run()}>
          <Heading1 />
        </ToolButton>
        <ToolButton label="Subheading" active={st.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}>
          <Heading2 />
        </ToolButton>
      </div>
      <span className={s.sep} />
      <div className={s.group}>
        <ToolButton label="Bold (pressed harder), Ctrl+B" active={st.bold} onClick={() => c().toggleBold().run()}>
          <Bold />
        </ToolButton>
        <ToolButton label="Underline, Ctrl+U" active={st.underline} onClick={() => c().toggleUnderline().run()}>
          <Underline />
        </ToolButton>
        <ToolButton label="Strike through" active={st.strike} onClick={() => c().toggleStrike().run()}>
          <Strikethrough />
        </ToolButton>
        <ToolButton label="Highlighter" active={st.highlight} onClick={() => c().toggleHighlight().run()}>
          <Highlighter />
        </ToolButton>
      </div>
      <span className={s.sep} />
      <div className={s.group}>
        <ToolButton label="Bullet list" active={st.bullet} onClick={() => c().toggleBulletList().run()}>
          <List />
        </ToolButton>
        <ToolButton label="Numbered list" active={st.ordered} onClick={() => c().toggleOrderedList().run()}>
          <ListOrdered />
        </ToolButton>
        <ToolButton label="Start a new page" onClick={() => c().setHorizontalRule().run()}>
          <SeparatorHorizontal />
        </ToolButton>
      </div>
      <span className={s.sep} />
      <div className={s.group}>
        <ToolButton label="Undo" onClick={() => c().undo().run()} disabled={!st.undo}>
          <Undo2 />
        </ToolButton>
        <ToolButton label="Redo" onClick={() => c().redo().run()} disabled={!st.redo}>
          <Redo2 />
        </ToolButton>
      </div>
    </div>
  );
}

/**
 * Rich-text editor whose text is shown in the chosen handwriting. It edits a
 * document and reports Truehand markup, which is what the engine reads.
 */
export function RichText({ value, onChange, family, ratio, ink, pickers, footer }: Props) {
  const lastEmitted = useRef(value);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
        code: false,
        codeBlock: false,
        blockquote: false,
        italic: false,
        link: false,
      }),
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder: "Type or paste your text here…" }),
    ],
    content: markupToDoc(value),
    editorProps: {
      attributes: { class: s.prose ?? "", "aria-label": "Your text", spellcheck: "true" },
    },
    onUpdate: ({ editor: e }) => {
      const markup = docToMarkup(e.getJSON());
      lastEmitted.current = markup;
      onChange(markup);
    },
  });

  // Text changed from outside (a sample, a saved document): load it.
  useEffect(() => {
    if (!editor || value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(markupToDoc(value), { emitUpdate: false });
  }, [editor, value]);

  const style = {
    "--hand": family ? `"${family}"` : "var(--font-text)",
    "--hand-size": family ? `${(9.6 / ratio).toFixed(1)}px` : "17px",
    "--ink": ink,
  } as CSSProperties;

  return (
    <div className={s.card}>
      <div className={s.toolbar}>
        {editor ? <Toolbar editor={editor} /> : <div className={s.row} />}
        <div className={`${s.row} ${s.pickers}`}>
          {pickers}
          <button type="button" className={s.clear} onClick={() => editor?.chain().focus().clearContent(true).run()}>
            <Trash2 aria-hidden="true" />
            Clear text
          </button>
        </div>
      </div>
      <div className={s.body} style={style} data-hand={family ? "on" : "off"}>
        <EditorContent editor={editor} className={s.content} />
      </div>
      {footer}
    </div>
  );
}
