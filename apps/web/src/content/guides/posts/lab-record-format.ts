import { list, p, sample, shot, UPDATED } from "../blocks";
import { DAILY_PAGES } from "../faqs";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "lab-record-format",
  title: "How do I write my lab record or practical file online?",
  description: "Write each experiment in the usual lab record format and download neat handwritten pages. With the format, screenshots and fixes.",
  answer:
    "Open the lab record editor, write Aim, Apparatus, Procedure, Observations and Result as headings, put the experiment number and date at the top, and download a PDF. Start each experiment on a new page.",
  minutes: 3,
  updated: UPDATED,
  related: ["name-class-on-every-page", "typed-assignment-to-handwriting"],
  cta: { href: "/use/lab-records", label: "Write my lab record" },
  sections: [
    {
      heading: "What you'll get",
      blocks: [sample("use-lab-records-page", "A handwritten lab record page with aim, apparatus and procedure", "A lab record page made in Truehand")],
    },
    {
      heading: "The usual format",
      blocks: [
        list("Experiment number and date", "Aim", "Apparatus", "Theory", "Procedure (numbered steps)", "Observations", "Result", "Precautions"),
        p("Check your lab manual in case yours is different."),
      ],
    },
    {
      heading: "Step 1: Headings and lists",
      blocks: [
        p("Make each part a heading with H2 (1). Use the numbered list (3) for the procedure. Press the new page icon (4) before the next experiment."),
        shot("toolbar", "The formatting toolbar"),
      ],
    },
    {
      heading: "Step 2: Experiment number and date",
      blocks: [p("In Style & page, put the experiment number in Top left and the date in Top right (1)."), shot("page-settings", "The Page settings")],
    },
  ],
  faqs: [
    {
      q: "How do I make an observation table?",
      a: "Tables aren't drawn yet. Write one reading per line, like “1. Length: 20 cm, Time: 9.1 s”. If your teacher wants a ruled table, leave empty lines and draw it after printing.",
    },
    { q: "Where do diagrams go?", a: "Press Enter a few times to leave space, and draw the diagram in pencil after printing." },
    DAILY_PAGES,
  ],
};

export default guide;
