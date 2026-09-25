import { STYLES } from "@truehand/catalog";
import { Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Editor } from "@/editor/Editor";
import s from "./home.module.css";

export default function Home() {
  return (
    <main className={s.page}>
      <section className={s.hero}>
        <h1 className={s.title}>Turn typed text into real handwriting</h1>
        <p className={s.lede}>
          Convert typed or pasted text into realistic handwritten pages for assignments, class notes, lab records, letters and cards. {STYLES.length}{" "}
          hands, real paper and ink, and every letter written a little differently.
        </p>
        <p className={s.guide}>
          <Info aria-hidden="true" />
          <span>
            Type or paste in the editor, pick a hand and a paper, and the preview writes itself as you type. Press <kbd>Download</kbd> when it looks right.
          </span>
        </p>
        <Link href="/guides/how-truehand-works" className={s.more}>
          How it works <ArrowRight aria-hidden="true" />
        </Link>
      </section>
      <section className={s.work} aria-label="Handwriting editor">
        <Editor placeholder="/specimens/hero.webp" />
      </section>
      <div className={s.ad}>
        <AdSlot placement="editor" />
      </div>
    </main>
  );
}
