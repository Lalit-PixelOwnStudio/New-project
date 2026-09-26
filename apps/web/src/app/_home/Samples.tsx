import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { BLOG } from "@/content/blog";
import s from "./home.module.css";

/** Links to the blog's samples: templates students search for. */
export function Samples() {
  return (
    <Section label="Samples" title="Copy a sample, get it handwritten">
      <ul className={s.samples}>
        {BLOG.map((b) => (
          <li key={b.slug}>
            <Link href={`/blog/${b.slug}`}>
              {b.title} <ArrowRight aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
