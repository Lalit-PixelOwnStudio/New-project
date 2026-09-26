import type { EditorSettings } from "@/lib/settings";

/** The shape of a blog post and the samples in it. */

/** A sample, in the editor's markup: # heading, **bold**, - list, one paragraph per line. */
export interface BlogTemplate {
  id: string;
  title: string;
  text: string;
  settings?: Partial<Pick<EditorSettings, "paperId" | "styleId" | "fontSize">>;
}

export type BlogBlock =
  { kind: "p"; text: string } | { kind: "list" | "steps"; items: string[] } | { kind: "note"; text: string } | { kind: "template"; template: BlogTemplate };

export interface BlogPost {
  slug: string;
  /** The headline on the page. */
  title: string;
  /** The <title>, when the headline is too long for search results. */
  seoTitle: string;
  description: string;
  published: string;
  updated: string;
  minutes: number;
  /** Two or three sentences that answer the search on their own. */
  intro: string;
  sections: { heading: string; blocks: BlogBlock[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
}
