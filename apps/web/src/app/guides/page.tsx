import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdBand } from "@/components/AdBand";
import { PageHero, Section } from "@/components/Section";
import { GUIDES } from "@/content/guides";
import s from "./guides.module.css";

export const metadata: Metadata = {
  title: "Guides",
  description: "How Truehand works, how to make typed text look handwritten, ruled paper sizes, Cornell notes, lab records and handwritten business letters.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Guides"
        title="Handwriting, paper and getting it right"
        lede="Short, practical articles on making pages that look written by hand, and on how Truehand does it."
      />
      <AdBand placement="top" tone="page" />
      <Section tone="page">
        <ul className={s.list}>
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className={s.card}>
                <span className={s.meta}>{g.minutes} min read</span>
                <strong>{g.title}</strong>
                <span className={s.desc}>{g.description}</span>
                <span className={s.read}>
                  Read <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
