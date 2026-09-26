import type { FaqItem } from "@/components/Faq";
import type { EditorSettings } from "@/lib/settings";

/** A landing page for one job: assignments, lab records, letters and so on. */
export interface UseCase {
  slug: string;
  /** Short name for lists and nav. */
  name: string;
  /** H1, written for search as much as for people. */
  title: string;
  description: string;
  lede: string;
  settings: Partial<EditorSettings>;
  sections: { heading: string; body: string[] }[];
  faq: FaqItem[];
}
