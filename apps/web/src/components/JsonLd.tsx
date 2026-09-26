/** Structured data for search engines, as one JSON-LD graph. */
export function JsonLd({ items }: { items: Record<string, unknown>[] }) {
  const graph = { "@context": "https://schema.org", "@graph": items };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
