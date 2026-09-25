import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { PageHero, Section } from "@/components/Section";
import { USE_CASES, useCaseBySlug } from "@/content/use-cases";
import { AdSlot } from "@/components/AdSlot";
import { Editor } from "@/editor/Editor";
import d from "../../styles/[id]/detail.module.css";
import s from "./use.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => USE_CASES.map((u) => ({ slug: u.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const u = useCaseBySlug((await params).slug);
  if (!u) return {};
  return {
    title: u.title,
    description: u.description,
    alternates: { canonical: `/use/${u.slug}` },
    openGraph: { images: [`/specimens/use-${u.slug}.webp`] },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const u = useCaseBySlug((await params).slug);
  if (!u) notFound();
  const others = USE_CASES.filter((o) => o.slug !== u.slug);
  return (
    <main>
      <PageHero eyebrow={u.name} title={u.title} lede={u.lede} />
      <div className={d.work}>
        <Editor initial={u.settings} placeholder={`/specimens/use-${u.slug}-page.webp`} />
        <AdSlot placement="editor" className={d.ad} />
      </div>
      <Section label="Guide" title={`Tips for ${u.name.toLowerCase()}`}>
        <div className={s.article}>
          {u.sections.map((sec) => (
            <section key={sec.heading}>
              <h3>{sec.heading}</h3>
              {sec.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </Section>
      <Section label="Questions" title="Good to know" tone="page">
        <Faq items={u.faq} />
      </Section>
      <Section label="Also made for">
        <ul className={s.others}>
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/use/${o.slug}`}>{o.name}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
