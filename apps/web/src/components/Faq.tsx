import s from "./Faq.module.css";

export interface FaqItem {
  q: string;
  a: string;
}

/** Questions as native disclosure widgets; also emitted as FAQPage structured data. */
export function Faq({ items }: { items: FaqItem[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div className={s.faq}>
      {items.map((i) => (
        <details key={i.q} className={s.item}>
          <summary>{i.q}</summary>
          <p>{i.a}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </div>
  );
}
