import type { Metadata } from "next";
import Link from "next/link";
import { AdBand } from "@/components/AdBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, Section } from "@/components/Section";
import { BLOG, CATEGORIES, templatesOf, type BlogPost } from "@/content/blog";
import { breadcrumbLd } from "@/lib/seo";
import s from "./blog.module.css";

export const metadata: Metadata = {
  title: "Project file, letter and application samples",
  description:
    "Ready-to-copy samples for project files, leave applications, formal and informal letters and notices, plus handwriting tips. Write any of them by hand.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <main>
      <JsonLd items={[breadcrumbLd([{ name: "Blog", path: "/blog" }])]} />
      <PageHero
        eyebrow="Blog"
        title="Samples to copy, then write by hand"
        lede="Acknowledgements, certificates, leave applications, letters and notices in the format schools expect. Copy one, or open it in Truehand and download it handwritten."
      />
      <AdBand placement="top" tone="page" />
      {CATEGORIES.map((cat, i) => {
        const posts = BLOG.filter((post) => post.category === cat.id);
        if (!posts.length) return null;
        return (
          <Section
            key={cat.id}
            label={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
            title={cat.title}
            lede={cat.lede}
            tone={i % 2 ? undefined : "page"}
          >
            <ul className={s.cards}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
    </main>
  );
}

/** A post with the first sample, handwritten, as its picture. */
function PostCard({ post }: { post: BlogPost }) {
  const first = templatesOf(post)[0];
  return (
    <Link href={`/blog/${post.slug}`} className={s.card}>
      {first && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={s.thumb}
          src={`/specimens/blog-${post.slug}-${first.id}.webp`}
          alt={`${first.title}, handwritten`}
          width={794}
          height={1123}
          loading="lazy"
          decoding="async"
        />
      )}
      <span className={s.cardBody}>
        <strong>{post.title}</strong>
        <span>{post.description}</span>
      </span>
    </Link>
  );
}
