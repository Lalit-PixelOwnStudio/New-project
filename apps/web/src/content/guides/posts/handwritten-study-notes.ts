import { list, p, shot, UPDATED } from "../blocks";
import { DAILY_PAGES, TEXT_PRIVATE } from "../faqs";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "handwritten-study-notes",
  title: "How do I turn my typed notes into handwritten notes?",
  description: "Paste your class notes and get handwritten revision pages with headings and highlights. Step by step with screenshots.",
  answer:
    "Paste your notes, make each topic a heading, highlight the key words, and download a PDF. You get handwritten revision notes without copying everything out by hand.",
  minutes: 2,
  updated: UPDATED,
  related: ["make-it-look-real", "download-print-and-share"],
  cta: { href: "/", label: "Make my notes" },
  sections: [
    {
      heading: "Step 1: Paste and add headings",
      blocks: [
        p("Paste your notes. Make topics H1 and sub-topics H2 (1). Select key words and press the highlighter (2). Turn points into bullets (3)."),
        shot("toolbar", "The formatting toolbar"),
      ],
    },
    {
      heading: "Step 2: Pick a clear hand and paper",
      blocks: [p("Mira or Noor on College ruled or Grid paper are easy to read."), shot("pickers", "The hand, paper and pen menus")],
    },
    {
      heading: "Tips for revision",
      blocks: [
        list(
          "One topic per page: press the new page icon (4) before each topic.",
          "Highlight a few words, not whole paragraphs.",
          "Cornell paper, with a questions column and a summary box, is part of Pro.",
        ),
      ],
    },
  ],
  faqs: [
    { q: "Can I paste from Google Docs or Word?", a: "Yes. Headings, bold, underline and lists usually come across. Italic text becomes normal writing." },
    TEXT_PRIVATE,
    DAILY_PAGES,
  ],
};

export default guide;
