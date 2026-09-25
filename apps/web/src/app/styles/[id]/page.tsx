import { STYLES, styleById } from "@truehand/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/Section";
import { ProTag } from "@/components/ui/ProTag";
import { AdSlot } from "@/components/AdSlot";
import { Editor } from "@/editor/Editor";
import s from "../styles.module.css";
import d from "./detail.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => STYLES.map((st) => ({ id: st.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const st = styleById((await params).id);
  if (!st) return {};
  return {
    title: `${st.name} handwriting`,
    description: `${st.blurb} Write any text in the ${st.name} handwriting style and download it as PDF or PNG.`,
    alternates: { canonical: `/styles/${st.id}` },
    openGraph: { images: [`/specimens/style-${st.id}.webp`] },
  };
}

const scriptNames: Record<string, string> = { "latin-ext": "Latin Extended", cyrillic: "Cyrillic", greek: "Greek", vietnamese: "Vietnamese" };

export default async function StylePage({ params }: { params: Promise<{ id: string }> }) {
  const st = styleById((await params).id);
  if (!st) notFound();
  const similar = STYLES.filter((o) => o.category === st.category && o.id !== st.id).slice(0, 6);
  const category = st.category === "casual" ? "Everyday" : st.category[0]!.toUpperCase() + st.category.slice(1);

  return (
    <main>
      <PageHero eyebrow={`${category} handwriting`} title={<>{st.name} handwriting</>} lede={st.blurb} />
      <div className={d.work}>
        <Editor initial={{ styleId: st.id }} />
        <AdSlot placement="editor" className={d.ad} />
      </div>
      <Section label="About this hand" title={`What ${st.name} looks like`}>
        <div className={d.about}>
          <figure className={d.specimen}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/specimens/style-${st.id}.webp`} alt={`${st.name} handwriting sample`} width={930} height={225} />
          </figure>
          <dl className={d.facts}>
            <div>
              <dt>Plan</dt>
              <dd>{st.tier === "pro" ? <ProTag /> : "Free"}</dd>
            </div>
            <div>
              <dt>Letters</dt>
              <dd>{st.connected ? "Joined (cursive)" : "Separate"}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>Latin alphabet{st.scripts.length ? `, ${st.scripts.map((x) => scriptNames[x]).join(", ")}` : ""}</dd>
            </div>
            <div>
              <dt>Based on</dt>
              <dd>
                {st.font.family} by {st.font.designer} ({st.font.license})
              </dd>
            </div>
          </dl>
        </div>
      </Section>
      {similar.length > 0 && (
        <Section label="Similar hands" title={`More ${category.toLowerCase()} styles`} tone="page">
          <ul className={s.grid}>
            {similar.map((o) => (
              <li key={o.id}>
                <Link href={`/styles/${o.id}`} className={s.card}>
                  <span className={s.specimen}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/specimens/style-${o.id}.webp`} alt={`${o.name} handwriting sample`} width={930} height={225} loading="lazy" />
                  </span>
                  <span className={s.body}>
                    <span className={s.name}>
                      {o.name}
                      {o.tier === "pro" ? <ProTag /> : <span className={s.free}>Free</span>}
                    </span>
                    <span className={s.blurb}>{o.blurb}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </main>
  );
}
