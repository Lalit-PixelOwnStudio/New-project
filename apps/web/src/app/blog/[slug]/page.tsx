import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { AdSlot } from "@/components/AdSlot";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { BLOG, blogBySlug, templatesOf, type BlogBlock } from "@/content/blog";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import g from "../../guides/guides.module.css";
import { Template } from "../Template";
import s from "../blog.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => BLOG.map((b) => ({ slug: b.slug }));

const image = (slug: string, id: string) => `/specimens/blog-${slug}-${id}.webp`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = blogBySlug((await params).slug);
  if (!post) return {};
  const first = templatesOf(post)[0];
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
      ...(first ? { images: [image(post.slug, first.id)] } : {}),
    },
  };
}

function Block({ slug, block }: { slug: string; block: BlogBlock }) {
  switch (block.kind) {
    case "p":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className={g.steps}>
          {block.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      );
    case "note":
      return <p className={g.note}>{block.text}</p>;
    case "template":
      return <Template slug={slug} template={block.template} />;
  }
}

const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = blogBySlug((await params).slug);
  if (!post) notFound();
  const first = templatesOf(post)[0];
  const related = post.related.map(blogBySlug).filter((x) => x !== undefined);
  const ld = [
    articleLd({
      type: "BlogPosting",
      path: `/blog/${post.slug}`,
      headline: post.title,
      description: post.description,
      published: post.published,
      modified: post.updated,
      image: first ? image(post.slug, first.id) : undefined,
    }),
    breadcrumbLd([
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <main className={g.page}>
      <article className={g.article}>
        <nav className={g.crumbs} aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link>
        </nav>
        <h1>{post.title}</h1>
        <div className={g.answer}>
          <strong>In short</strong>
          <p>{post.intro}</p>
        </div>
        <p className={g.byline}>
          {post.minutes} min read · Updated {longDate(post.updated)}
        </p>
        {first && (
          <figure className={s.hero}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image(post.slug, first.id)} alt={`${first.title}, written in handwriting by Truehand`} width={794} height={1123} />
            <figcaption>
              {first.title}, written by Truehand. <Link href={`/blog/${post.slug}/write/${first.id}`}>Write yours in handwriting</Link>
            </figcaption>
          </figure>
        )}
        {post.sections.map((sec, i) => (
          <Fragment key={sec.heading}>
            <section>
              <h2>{sec.heading}</h2>
              {sec.blocks.map((b, j) => (
                <Block key={j} slug={post.slug} block={b} />
              ))}
            </section>
            {i % 3 === 2 && i < post.sections.length - 1 && <AdSlot placement="article" />}
          </Fragment>
        ))}
        {post.faqs.length > 0 && (
          <section>
            <h2>Questions</h2>
            <Faq items={post.faqs} />
          </section>
        )}
        <aside className={g.cta}>
          <div>
            <strong>Write any of these in handwriting</strong>
            <span>Paste your text, pick a hand and paper, and download it as a PDF. Free, no sign-up.</span>
          </div>
          <ButtonLink href={first ? `/blog/${post.slug}/write/${first.id}` : "/"}>Open in Truehand</ButtonLink>
        </aside>
        {related.length > 0 && (
          <nav className={g.related} aria-label="Related posts">
            <h2>Keep reading</h2>
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`}>
                {r.title} <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        )}
      </article>
      <JsonLd items={ld} />
    </main>
  );
}
