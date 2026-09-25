import type { ReactNode } from "react";
import s from "./Section.module.css";

/** A page section: small blue eyebrow, a clear headline, and content. */
export function Section({
  label,
  title,
  lede,
  children,
  id,
  tone = "plain",
  align = "left",
}: {
  label?: string;
  /** Kept for older call sites; no longer shown. */
  index?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  id?: string;
  tone?: "plain" | "page";
  align?: "left" | "center";
}) {
  return (
    <section className={s.section} id={id} data-tone={tone}>
      <div className={s.inner}>
        {(label || title || lede) && (
          <header className={s.head} data-align={align}>
            {label && <p className={s.eyebrow}>{label}</p>}
            {title && <h2 className={s.title}>{title}</h2>}
            {lede && <p className={s.lede}>{lede}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lede, children }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className={s.hero}>
      <div className={s.inner}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <h1 className={s.heroTitle}>{title}</h1>
        {lede && <p className={s.heroLede}>{lede}</p>}
        {children}
      </div>
    </header>
  );
}
