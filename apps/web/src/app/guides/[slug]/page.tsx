import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { AdSlot } from "@/components/AdSlot";
import { Faq } from "@/components/Faq";
import { FeedbackForm } from "@/components/FeedbackForm";
import { ButtonLink } from "@/components/ui/Button";
import { GUIDES, guideBySlug, type GuideBlock } from "@/content/guides";
import { SITE_URL } from "@/lib/site";
import s from "../guides.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: "article", modifiedTime: g.updated },
  };
}

/** Shows markup samples and template fields inside guide text as code. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*:?|\{\{[^}]+\}\}|---)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\*\*[^*]+\*\*:?$/.test(part) || /^\{\{[^}]+\}\}$/.test(part) || part === "---" ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

function Block({ block, eager = false }: { block: GuideBlock; eager?: boolean }) {
  switch (block.kind) {
    case "image": {
      const im = block.image!;
      return (
        <figure className={s.figure} data-narrow={im.narrow || undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={im.src} alt={im.alt} width={im.width} height={im.height} loading={eager ? "eager" : "lazy"} decoding="async" />
          {im.caption && <figcaption>{im.caption}</figcaption>}
        </figure>
      );
    }
    case "p":
      return (
        <p>
          <Rich text={block.text!} />
        </p>
      );
    case "list":
      return (
        <ul>
          {block.items!.map((t) => (
            <li key={t}>
              <Rich text={t} />
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className={s.steps}>
          {block.items!.map((t) => (
            <li key={t}>
              <Rich text={t} />
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <p className={s.note}>
          <Rich text={block.text!} />
        </p>
      );
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const related = g.related.map(guideBySlug).filter((x) => x !== undefined);
  const firstImage = g.sections.flatMap((sec) => sec.blocks).find((b) => b.kind === "image");
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    dateModified: g.updated,
    author: { "@type": "Organization", name: "Truehand" },
    publisher: { "@type": "Organization", name: "Truehand", logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/mark.svg` } },
    mainEntityOfPage: `${SITE_URL}/guides/${g.slug}`,
  };

  return (
    <main className={s.page}>
      <article className={s.article}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/guides">Guides</Link>
        </nav>
        <h1>{g.title}</h1>
        <div className={s.answer}>
          <strong>Quick answer</strong>
          <p>{g.answer}</p>
        </div>
        <p className={s.byline}>
          {g.minutes} min read · Updated {new Date(g.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        {g.sections.map((sec, i) => (
          <Fragment key={sec.heading}>
            <section>
              <h2>{sec.heading}</h2>
              {sec.blocks.map((b, j) => (
                // The first picture is usually on screen straight away, so it loads first.
                <Block key={j} block={b} eager={b === firstImage} />
              ))}
            </section>
            {i % 2 === 1 && i < g.sections.length - 1 && <AdSlot placement="article" />}
          </Fragment>
        ))}
        {g.faqs.length > 0 && (
          <section>
            <h2>Common problems</h2>
            <Faq items={g.faqs} />
          </section>
        )}
        <aside className={s.cta}>
          <div>
            <strong>Try it on your own text</strong>
            <span>Paste anything and watch it come out handwritten. Free, no sign-up.</span>
          </div>
          <ButtonLink href={g.cta.href}>{g.cta.label}</ButtonLink>
        </aside>
        <div className={s.feedback}>
          <FeedbackForm
            context={{ source: "guide", guide: g.slug }}
            title="Did this guide help?"
            labels={["Not at all", "Not really", "Somewhat", "Yes", "A lot"]}
          />
        </div>
        {related.length > 0 && (
          <nav className={s.related} aria-label="Related guides">
            <h2>Keep reading</h2>
            {related.map((r) => (
              <Link key={r.slug} href={`/guides/${r.slug}`}>
                {r.title} <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        )}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </main>
  );
}
