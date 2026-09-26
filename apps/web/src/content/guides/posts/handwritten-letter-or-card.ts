import { p, sample, shot, UPDATED } from "../blocks";
import { PRO_SELECTED } from "../faqs";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "handwritten-letter-or-card",
  title: "How do I make a handwritten letter or card online?",
  description: "Write a thank-you note, birthday card or letter in a handwriting you like, then print it or send it as an image.",
  answer:
    "Type your message, pick a warm hand like Lily or June on plain paper, make the writing a bit bigger, and download a PDF to print or a PNG to send. Sign it with a real pen after printing.",
  minutes: 2,
  updated: UPDATED,
  related: ["download-print-and-share", "make-it-look-real"],
  cta: { href: "/use/letters", label: "Write my letter" },
  sections: [
    {
      heading: "What you'll get",
      blocks: [sample("use-letters-page", "A handwritten letter on plain paper", "A letter made in Truehand")],
    },
    {
      heading: "Step 1: Write and pick a hand",
      blocks: [
        p("Type your message; three or four lines look best on a card. Lily and June are free; flowing cursive hands are part of Pro."),
        shot("pick-hand", "The handwriting menu"),
      ],
    },
    {
      heading: "Step 2: Make the writing bigger",
      blocks: [p("In Style & page, turn Size (1) up so the message fills the page."), shot("writing-settings", "The Size setting")],
    },
  ],
  faqs: [
    {
      q: "How do I print it on a card?",
      a: "Use thick paper or card if your printer takes it, choose Actual size in the print window, and sign it by hand.",
    },
    {
      q: "Can I write lots of letters with different names?",
      a: "Yes, with Batch letters (Month or Year plan): upload a list of names and Truehand writes one letter for each person.",
    },
    PRO_SELECTED,
  ],
};

export default guide;
