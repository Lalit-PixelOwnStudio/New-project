import { p, shot, UPDATED } from "../blocks";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "name-class-on-every-page",
  title: "How do I add my name, class and roll number to every page?",
  description: "Put your name, class, roll number, subject and date at the top of every handwritten page, and number the pages.",
  answer:
    "Open the Style & page tab, type your details in Top left and Top right, and tick Number the pages. They're written at the top of every page, in the same handwriting.",
  minutes: 1,
  updated: UPDATED,
  related: ["typed-assignment-to-handwriting", "lab-record-format"],
  cta: { href: "/use/assignments", label: "Open the editor" },
  sections: [
    {
      heading: "Step 1: Open Style & page",
      blocks: [p("It's the second tab at the top of the editor, next to Text. Scroll down to Page.")],
    },
    {
      heading: "Step 2: Fill in the top of the page",
      blocks: [
        p("Top left: your name, class and roll number. Top right: the subject and date (1). Tick Number the pages (2)."),
        shot("page-settings", "Top left, Top right and Number the pages in the Page settings"),
      ],
    },
    {
      heading: "The result",
      blocks: [shot("page-header-result", "A handwritten page with the name and subject at the top")],
    },
  ],
  faqs: [
    {
      q: "Can I put my name only on the first page?",
      a: "Top left and Top right go on every page. For the first page only, leave them empty and type your name as the first line of your text.",
    },
    { q: "My details are too long.", a: "Keep each side short: name, class and roll number on the left; subject and date on the right." },
    { q: "Where do the page numbers go?", a: "At the bottom right of each page." },
  ],
};

export default guide;
