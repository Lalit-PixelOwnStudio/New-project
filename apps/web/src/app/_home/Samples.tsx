import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { BLOG, FEATURED } from "@/content/blog";
import s from "./home.module.css";

/** Links to the blog samples students search for most, and to the rest. */
export function Samples() {
  return (
    <Section label="Samples" title="Copy a sample, get it handwritten">
      <ul className={s.samples}>
        {FEATURED.map((b) => (
          <li key={b.slug}>
            <Link href={`/blog/${b.slug}`}>
              {b.title} <ArrowRight aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href="/blog" variant="secondary">
        See all {BLOG.length} samples and guides <ArrowRight aria-hidden="true" />
      </ButtonLink>
    </Section>
  );
}
