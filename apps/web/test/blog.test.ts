import { PAPERS, STYLES } from "@truehand/catalog";
import { describe, expect, it } from "vitest";
import { BLOG, blogBySlug, plainText, templatesOf } from "@/content/blog";
import { GUIDES } from "@/content/guides";

const SUFFIX = " · Truehand".length;

describe("blog posts", () => {
  it("have unique slugs and working related links", () => {
    expect(new Set(BLOG.map((b) => b.slug)).size).toBe(BLOG.length);
    for (const b of BLOG) {
      for (const r of b.related) expect(blogBySlug(r), `${b.slug} -> ${r}`).toBeDefined();
      expect(b.related).not.toContain(b.slug);
    }
  });

  it("fit in search results", () => {
    for (const b of BLOG) {
      expect(b.seoTitle.length + SUFFIX, b.slug).toBeLessThanOrEqual(60);
      expect(b.description.length, b.slug).toBeGreaterThanOrEqual(70);
      expect(b.description.length, b.slug).toBeLessThanOrEqual(155);
    }
    for (const g of GUIDES) expect(g.title.length, g.slug).toBeLessThanOrEqual(60);
  });

  it("each has samples with unique ids, in free hands and papers", () => {
    for (const b of BLOG) {
      const templates = templatesOf(b);
      expect(templates.length, b.slug).toBeGreaterThan(0);
      expect(new Set(templates.map((t) => t.id)).size, b.slug).toBe(templates.length);
      for (const t of templates) {
        // A sample opens in the editor for everyone, so it may only use what's free.
        if (t.settings?.styleId) expect(STYLES.find((s) => s.id === t.settings!.styleId)?.tier, `${b.slug}/${t.id}`).toBe("free");
        if (t.settings?.paperId) expect(PAPERS.find((p) => p.id === t.settings!.paperId)?.tier, `${b.slug}/${t.id}`).toBe("free");
      }
    }
  });

  it("copies samples without their formatting marks", () => {
    expect(plainText("# Notice\n## Sub\n**Lost:** a bottle")).toBe("Notice\nSub\nLost: a bottle");
  });
});
