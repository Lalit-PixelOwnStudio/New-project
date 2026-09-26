import type { BlogCategory } from "./types";

/** The groups on the blog page, in order. */
export const CATEGORIES: { id: BlogCategory; title: string; lede: string }[] = [
  {
    id: "project-files",
    title: "Project files",
    lede: "Every page before the project itself: cover, certificate, acknowledgement, index and bibliography.",
  },
  { id: "applications", title: "Applications", lede: "Leave, certificates and fees: applications to your principal, college or office." },
  { id: "letters", title: "Letters and exam formats", lede: "Formal and informal letters, notices and diary entries, in the format schools teach." },
  { id: "handwriting", title: "Handwriting", lede: "Neater handwriting, and how Truehand makes typed text look written by hand." },
];
