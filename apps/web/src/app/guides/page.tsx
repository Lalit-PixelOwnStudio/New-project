import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdBand } from "@/components/AdBand";
import { PageHero, Section } from "@/components/Section";
import { GUIDES } from "@/content/guides";
import s from "./guides.module.css";

export const metadata: Metadata = {
  title: "How-to guides for text to handwriting",
  description: "How Truehand works, how to make typed text look handwritten, ruled paper sizes, Cornell notes, lab records and handwritten business letters.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Guides"
        title="How to use Truehand"
        lede={
          <>
            Quick answers with screenshots for assignments, lab records, notes, journals, letters and more. Start with the starter guide if you&rsquo;re new.
            Looking for something to copy? See the <Link href="/blog">samples for project files, letters and applications</Link>.
          </>
        }
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
