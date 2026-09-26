import { STYLES, type StyleCategory } from "@truehand/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { AdBand } from "@/components/AdBand";
import { PageHero, Section } from "@/components/Section";
import { ProTag } from "@/components/ui/ProTag";
import s from "./styles.module.css";

export const metadata: Metadata = {
  title: `${STYLES.length} realistic handwriting styles and fonts`,
  description: `${STYLES.length} realistic handwriting styles: messy everyday hands, neat print, joined cursive, marker and elegant scripts. Preview any of them free.`,
  alternates: { canonical: "/styles" },
};

const GROUPS: { id: StyleCategory; title: string; lede: string }[] = [
  { id: "casual", title: "Everyday", lede: "Unpolished, real-person handwriting. The notes nobody tidied up." },
  { id: "print", title: "Print", lede: "Separate letters, from careful to quick. The most common way people write." },
  { id: "cursive", title: "Cursive", lede: "Joined-up and flowing. Letters, cards and anyone taught to write this way." },
  { id: "marker", title: "Marker", lede: "Felt-tip and marker lettering with heavier strokes." },
  { id: "elegant", title: "Elegant", lede: "Formal scripts for invitations and thank-you cards." },
];

const scriptNames: Record<string, string> = { "latin-ext": "Latin Extended", cyrillic: "Cyrillic", greek: "Greek", vietnamese: "Vietnamese" };

export default function StylesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Handwriting styles"
        title={`${STYLES.length} hands, from tidy to terrible`}
        lede="Every style is drawn with Truehand's realism engine, so no two letters come out the same. Pick one to try it in the editor; Pro styles can be previewed by anyone."
      />
      <AdBand placement="top" tone="page" />
      {GROUPS.map((g, i) => {
        const list = STYLES.filter((st) => st.category === g.id);
        return (
          <Fragment key={g.id}>
            {(i === 2 || i === 4) && <AdBand placement="banner" tone="page" />}
            <Section id={g.id} label={`${list.length} styles`} title={g.title} lede={g.lede} tone={i % 2 ? "page" : "plain"}>
              <ul className={s.grid}>
                {list.map((st) => (
                  <li key={st.id}>
                    <Link href={`/styles/${st.id}`} className={s.card}>
                      <span className={s.specimen}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/specimens/style-${st.id}.webp`} alt={`${st.name} handwriting sample`} width={930} height={225} loading="lazy" />
                      </span>
                      <span className={s.body}>
                        <span className={s.name}>
                          {st.name}
                          {st.tier === "pro" ? <ProTag /> : <span className={s.free}>Free</span>}
                        </span>
                        <span className={s.blurb}>{st.blurb}</span>
                        {st.scripts.length > 0 && <span className={s.scripts}>Also writes {st.scripts.map((sc) => scriptNames[sc]).join(", ")}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          </Fragment>
        );
      })}
    </main>
  );
}
