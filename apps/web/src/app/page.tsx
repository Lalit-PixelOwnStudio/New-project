import { STYLES } from "@truehand/catalog";
import { AdSlot } from "@/components/AdSlot";
import { Editor } from "@/editor/Editor";
import { HomeSections } from "./HomeSections";
import s from "./home.module.css";

const STEPS = ["Write or paste your text", "Choose a hand, paper and pen", "Download a PDF or images"];

export default function Home() {
  return (
    <main className={s.page}>
      <section className={s.hero}>
        <h1 className={s.title}>Type anything. Get it back handwritten.</h1>
        <p className={s.lede}>
          Truehand draws every letter the way a hand would, a little different each time, on ruled, grid or plain paper. {STYLES.length} hands for notes,
          assignments, lab records, letters and cards. Free, and no sign-up.
        </p>
        <ol className={s.steps}>
          {STEPS.map((step, i) => (
            <li key={step}>
              <span className={s.num}>{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
      <section className={s.work} aria-label="Handwriting editor">
        <Editor placeholder="/specimens/hero.webp" />
      </section>
      <div className={s.ad}>
        <AdSlot placement="editor" />
      </div>
      <HomeSections />
    </main>
  );
}
