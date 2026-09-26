import { STYLES } from "@truehand/catalog";
import type { Metadata } from "next";
import { AdBand } from "@/components/AdBand";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { Editor } from "@/editor/Editor";
import { ORGANIZATION, webAppLd, websiteLd } from "@/lib/seo";
import { Business } from "./_home/Business";
import { Hands } from "./_home/Hands";
import { Hero } from "./_home/Hero";
import { HomeFaq } from "./_home/HomeFaq";
import { OwnHandwriting } from "./_home/OwnHandwriting";
import { Samples } from "./_home/Samples";
import { UseCases } from "./_home/UseCases";
import { WhyReal } from "./_home/WhyReal";
import s from "./_home/home.module.css";

const DESCRIPTION = `Convert typed text into realistic handwriting on ruled notebook paper. ${STYLES.length} handwriting styles, every letter different. Free PDF download, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: "Text to Handwriting Converter, Free & Realistic | Truehand" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
};

/** The home page is the editor, with the sections that explain it below. */
export default function Home() {
  return (
    <main className={s.page}>
      <JsonLd items={[ORGANIZATION, websiteLd(DESCRIPTION), webAppLd(DESCRIPTION)]} />
      <Hero />
      <AdBand placement="top" tone="page" desktopOnly />
      <section className={s.work} aria-label="Handwriting editor">
        <Editor placeholder="/specimens/hero.webp" />
      </section>
      <div className={s.ad}>
        <AdSlot placement="editor" />
      </div>
      <WhyReal />
      <UseCases />
      <Samples />
      <AdBand />
      <Hands />
      <OwnHandwriting />
      <Business />
      <AdBand />
      <HomeFaq />
    </main>
  );
}
