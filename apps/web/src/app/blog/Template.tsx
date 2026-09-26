import { PenLine } from "lucide-react";
import { Fragment } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { plainText, type BlogTemplate } from "@/content/blog";
import { CopyButton } from "./CopyButton";
import s from "./blog.module.css";

/** **bold** inside a line of sample text. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(\*\*[^*]+\*\*)/g)
        .map((part, i) => (/^\*\*[^*]+\*\*$/.test(part) ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

/** A sample to copy, shown the way the editor lays it out, with the way into the editor. */
export function Template({ slug, template }: { slug: string; template: BlogTemplate }) {
  return (
    <figure className={s.template}>
      <figcaption className={s.templateHead}>
        <strong>{template.title}</strong>
        <span className={s.templateActions}>
          <CopyButton text={plainText(template.text)} />
          <ButtonLink href={`/blog/${slug}/write/${template.id}`} size="s">
            <PenLine aria-hidden="true" />
            Write it in handwriting
          </ButtonLink>
        </span>
      </figcaption>
      <div className={s.templateText}>
        {template.text.split("\n").map((line, i) => {
          if (line.startsWith("# "))
            return (
              <p key={i} className={s.t1}>
                <Inline text={line.slice(2)} />
              </p>
            );
          if (line.startsWith("## "))
            return (
              <p key={i} className={s.t2}>
                <Inline text={line.slice(3)} />
              </p>
            );
          if (line.startsWith("- "))
            return (
              <p key={i} className={s.tItem}>
                <Inline text={`• ${line.slice(2)}`} />
              </p>
            );
          if (!line.trim()) return <p key={i} className={s.tGap} aria-hidden="true" />;
          return (
            <p key={i}>
              <Inline text={line} />
            </p>
          );
        })}
      </div>
    </figure>
  );
}
