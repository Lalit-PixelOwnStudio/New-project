import { note, p, sample, shot, UPDATED } from "../blocks";
import { DAILY_PAGES } from "../faqs";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "typed-assignment-to-handwriting",
  title: "How do I convert my typed assignment into handwriting?",
  description: "Turn a typed assignment into handwritten pages with your name, class and page numbers, free and online. Step by step with screenshots.",
  answer:
    "Paste your assignment into Truehand, add your name and class in Style & page, pick a handwriting and notebook paper, and download a PDF. It takes about two minutes and it's free.",
  minutes: 3,
  updated: UPDATED,
  related: ["name-class-on-every-page", "make-it-look-real"],
  cta: { href: "/use/assignments", label: "Convert my assignment" },
  sections: [
    {
      heading: "What you'll get",
      blocks: [
        sample("use-assignments-page", "A handwritten assignment page with a name, class and subject at the top", "An assignment page made in Truehand"),
      ],
    },
    {
      heading: "Step 1: Paste your assignment",
      blocks: [p("Clear the sample (5) and paste. Make the title bigger with H1 and question numbers with H2 (1)."), shot("toolbar", "The formatting toolbar")],
    },
    {
      heading: "Step 2: Add your name and class",
      blocks: [
        p("Open Style & page. Type your name and class in Top left, and the subject and date in Top right (1). Tick Number the pages (2)."),
        shot("page-settings", "The Page settings with name, class and page numbers"),
        shot(
          "page-header-result",
          "The top of a handwritten page with the name, class, roll number and subject",
          "Your details are written at the top of every page",
        ),
      ],
    },
    {
      heading: "Step 3: Pick the hand and paper",
      blocks: [
        p("Mira and Theo look like neat student writing. For paper, pick College ruled or Wide ruled."),
        shot("pickers", "The hand, paper and pen menus"),
      ],
    },
    {
      heading: "Step 4: Download the PDF",
      blocks: [
        p("Press Download, choose PDF, and you're done. Print at Actual size so the lines stay the right size."),
        shot("download-options", "The download window"),
      ],
    },
    {
      heading: "Before you submit",
      blocks: [
        note("If your teacher asked for the assignment in your own handwriting, check with them first. Some teachers want it written by hand as practice."),
      ],
    },
  ],
  faqs: [
    DAILY_PAGES,
    {
      q: "Will my teacher know it isn't my handwriting?",
      a: "It looks like real handwriting, with letters that change slightly every time, but it won't look like your own. If your teacher knows how you write, or asked for work in your own hand, ask them before you use it.",
    },
    { q: "How do I start each question on a new page?", a: "Click where the page should end and press the new page icon in the toolbar." },
    {
      q: "Can I draw diagrams or tables?",
      a: "Not yet. Write table rows one per line, like “1. Length: 20 cm, Time: 9.1 s”. For diagrams, leave a few empty lines and draw them after printing.",
    },
    {
      q: "Can I write in Hindi or another language?",
      a: "Truehand writes English and languages with the same alphabet, like Spanish or French; some hands also write Russian or Greek. Hindi isn't supported yet. Characters it can't write are skipped and listed above the preview.",
    },
  ],
};

export default guide;
