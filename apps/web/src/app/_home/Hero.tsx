import { STYLES } from "@truehand/catalog";
import s from "./home.module.css";

const STEPS = ["Write or paste your text", "Choose a hand, paper and pen", "Download a PDF or images"];

/** The headline, what Truehand does in one sentence, and the three steps. */
export function Hero() {
  return (
    <section className={s.hero}>
      <p className={s.eyebrow}>Free text to handwriting converter</p>
      <h1 className={s.title}>Handwriting that&rsquo;s truly yours.</h1>
      <p className={s.lede}>
        Type or paste anything and get it back handwritten, every letter a little different, on ruled, grid or plain paper. {STYLES.length} hands for notes,
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
  );
}
