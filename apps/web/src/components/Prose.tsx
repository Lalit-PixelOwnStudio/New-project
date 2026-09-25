import type { ReactNode } from "react";
import s from "./Prose.module.css";

/** Long-form text pages: legal, about, credits. */
export function Prose({ eyebrow, title, updated, children }: { eyebrow?: string; title: string; updated?: string; children: ReactNode }) {
  return (
    <main className={s.page}>
      <article className={s.prose}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <h1>{title}</h1>
        {updated && <p className={s.updated}>Last updated {updated}</p>}
        {children}
      </article>
    </main>
  );
}
