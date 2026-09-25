import type { ReactNode } from "react";
import s from "./Section.module.css";

/**
 * A page section laid out like a notebook page: the label sits in the margin,
 * left of a thin red rule, and the content fills the page.
 */
export function Section({
  label,
  index,
  title,
  lede,
  children,
  id,
  tone = "plain",
}: {
  label: string;
  index?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  id?: string;
  tone?: "plain" | "sunk";
}) {
  return (
    <section className={s.section} id={id} data-tone={tone}>
      <div className={s.inner}>
        <div className={s.margin}>
          <span className={s.label}>
            {index && <span className={s.index}>{index}</span>}
            {label}
          </span>
        </div>
        <div className={s.body}>
          {(title || lede) && (
            <header className={s.head}>
              {title && <h2 className={s.title}>{title}</h2>}
              {lede && <p className={s.lede}>{lede}</p>}
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className={s.hero}>
      <div className={s.inner}>
        <div className={s.margin}>
          <span className={s.label}>{eyebrow}</span>
        </div>
        <div className={s.body}>
          <h1 className={s.heroTitle}>{title}</h1>
          {lede && <p className={s.heroLede}>{lede}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
