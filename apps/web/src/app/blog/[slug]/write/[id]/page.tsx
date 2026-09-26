import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { PageHero } from "@/components/Section";
import { BLOG, blogBySlug, templateOf, templatesOf } from "@/content/blog";
import { Editor } from "@/editor/Editor";
import d from "../../../../styles/[id]/detail.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => BLOG.flatMap((post) => templatesOf(post).map((t) => ({ slug: post.slug, id: t.id })));

async function find(params: Promise<{ slug: string; id: string }>) {
  const { slug, id } = await params;
  const post = blogBySlug(slug);
  const template = post && templateOf(post, id);
  return post && template ? { post, template } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }): Promise<Metadata> {
  const found = await find(params);
  if (!found) return {};
  return {
    title: `${found.template.title} in handwriting`,
    description: `Write “${found.template.title}” in realistic handwriting: change the details, pick a hand and paper, and download it as a PDF.`,
    // The post is the page to find in search; this one is the editor with its sample loaded.
    alternates: { canonical: `/blog/${found.post.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function WriteTemplate({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const found = await find(params);
  if (!found) notFound();
  const { post, template } = found;
  return (
    <main>
      <PageHero
        eyebrow={post.seoTitle}
        title={`${template.title}, in handwriting`}
        lede={
          <>
            Change the names and details in brackets, pick a hand and paper, and download it. <Link href={`/blog/${post.slug}`}>Back to all samples</Link>
          </>
        }
      />
      <div className={d.work}>
        <Editor
          initial={{ text: template.text, ...template.settings }}
          storageKey={`truehand:blog:${post.slug}:${template.id}:v1`}
          placeholder={`/specimens/blog-${post.slug}-${template.id}.webp`}
        />
        <AdSlot placement="editor" className={d.ad} />
      </div>
    </main>
  );
}
