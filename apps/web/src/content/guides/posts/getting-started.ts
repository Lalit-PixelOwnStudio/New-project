import { list, p, shot, UPDATED } from "../blocks";
import { PRO_SELECTED, TEXT_PRIVATE } from "../faqs";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "getting-started",
  title: "How do I use Truehand? A starter guide",
  description: "A quick tour of the editor: where to type, where to pick the handwriting, paper and pen, and how to download your pages. With screenshots.",
  answer:
    "Type or paste your text on the left, pick a handwriting, paper and pen, check the preview on the right, and press Download. It's free, works on a laptop or phone, and needs no sign-up.",
  minutes: 3,
  updated: UPDATED,
  related: ["typed-assignment-to-handwriting", "make-your-own-handwriting-font", "use-truehand-on-your-phone"],
  cta: { href: "/", label: "Make my first page" },
  sections: [
    {
      heading: "The editor at a glance",
      blocks: [
        shot("editor-tour", "The Truehand editor with four numbered parts", "1 Your text · 2 Hand, paper and pen · 3 Live preview · 4 Download"),
        list(
          "1. Your text: type here, or paste from Word, Google Docs or WhatsApp.",
          "2. Hand, paper and pen: how your page looks.",
          "3. Preview: your page, written out. It updates as you type.",
          "4. Download: save it as a PDF or images.",
        ),
      ],
    },
    {
      heading: "Step 1: Add your text",
      blocks: [
        p("Delete the sample with the bin icon (5), then type or paste. Use the toolbar like any document."),
        shot(
          "toolbar",
          "The formatting toolbar with five numbered groups",
          "1 Normal, heading, subheading · 2 Bold, underline, strike, highlighter · 3 Lists · 4 New page · 5 Clear all",
        ),
      ],
    },
    {
      heading: "Step 2: Pick a handwriting",
      blocks: [
        p("Tap Hand (1). Every name is written in its own handwriting, so you can see it before you pick. Everyday (2) has the most natural, messy hands."),
        shot("pick-hand", "The handwriting menu, open"),
      ],
    },
    {
      heading: "Step 3: Pick a paper",
      blocks: [
        p("Tap Paper. College ruled is a normal notebook page. Anything marked Pro can be previewed for free."),
        shot("pick-paper", "The paper menu, open"),
      ],
    },
    {
      heading: "Step 4: Download",
      blocks: [
        p("Press Download, pick PDF (1) and press the big button (3). Full HD quality (2) is fine for most things."),
        shot("download-options", "The download window with format, quality and the download button"),
      ],
    },
  ],
  faqs: [
    {
      q: "Is Truehand free?",
      a: "Yes. The free plan has 16 handwritings, 5 papers and 3 pens, and lets you download 10 pages a day, with no watermark. The Week, Month and Year plans add pages, every hand, paper and pen, up to 4K quality, and no ads.",
    },
    { q: "Do I need an account?", a: "No. You only need one if you buy a plan or a page pack, so your purchase is saved." },
    TEXT_PRIVATE,
    PRO_SELECTED,
  ],
};

export default guide;
