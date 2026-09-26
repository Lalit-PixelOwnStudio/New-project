import { STYLES } from "@truehand/catalog";
import type { Metadata } from "next";
import { AdBand } from "@/components/AdBand";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { Editor } from "@/editor/Editor";
import { ORGANIZATION, webAppLd, websiteLd } from "@/lib/seo";
import { HomeSections } from "./HomeSections";
import s from "./home.module.css";

const STEPS = ["Write or paste your text", "Choose a hand, paper and pen", "Download a PDF or images"];

const DESCRIPTION = `Convert typed text into realistic handwriting on ruled notebook paper. ${STYLES.length} handwriting styles, every letter different. Free PDF download, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: "Text to Handwriting Converter, Free & Realistic | Truehand" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className={s.page}>
      <JsonLd items={[ORGANIZATION, websiteLd(DESCRIPTION), webAppLd(DESCRIPTION)]} />
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
      <AdBand placement="top" tone="page" desktopOnly />
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
