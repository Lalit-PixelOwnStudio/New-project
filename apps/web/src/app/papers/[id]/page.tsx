import { PAPERS, paperById } from "@truehand/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/Section";
import { AdBand } from "@/components/AdBand";
import { AdSlot } from "@/components/AdSlot";
import { Editor } from "@/editor/Editor";
import d from "../../styles/[id]/detail.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => PAPERS.map((p) => ({ id: p.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = paperById((await params).id);
  if (!p) return {};
  return {
    title: `${p.name} paper`,
    description: `${p.blurb} Turn typed text into handwriting on ${p.name.toLowerCase()} paper and download it free.`,
    alternates: { canonical: `/papers/${p.id}` },
    openGraph: { images: [`/specimens/paper-${p.id}.webp`] },
  };
}

export default async function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const p = paperById((await params).id);
  if (!p) notFound();
  return (
    <main>
      <PageHero eyebrow={p.tier === "pro" ? "Pro paper" : "Free paper"} title={`Handwriting on ${p.name.toLowerCase()} paper`} lede={p.blurb} />
      <AdBand placement="top" tone="page" desktopOnly />
      <div className={d.work}>
        <Editor initial={{ paperId: p.id }} />
        <AdSlot placement="editor" className={d.ad} />
      </div>
    </main>
  );
}
