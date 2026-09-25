import { PAPERS } from "@truehand/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/Section";
import { ProTag } from "@/components/ui/ProTag";
import s from "./papers.module.css";

export const metadata: Metadata = {
  title: "Paper types",
  description:
    "College, wide and narrow ruled, grid, dot grid, legal pad, Cornell notes, engineering, vintage, recycled and kraft paper for handwritten pages.",
};

export default function PapersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Paper"
        title="The right page for the job"
        lede="Ruling sizes match real notebooks, margins sit where they should, and every sheet has its own texture. Handwriting sits on the lines the way it would on paper."
      />
      <Section tone="page">
        <ul className={s.grid}>
          {PAPERS.map((p) => (
            <li key={p.id}>
              <Link href={`/papers/${p.id}`} className={s.card}>
                <span className={s.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/specimens/paper-${p.id}.webp`} alt={`${p.name} paper`} width={794} height={471} loading="lazy" />
                </span>
                <span className={s.body}>
                  <span className={s.name}>
                    {p.name}
                    {p.tier === "pro" ? <ProTag /> : <span className={s.free}>Free</span>}
                  </span>
                  <span className={s.blurb}>{p.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
