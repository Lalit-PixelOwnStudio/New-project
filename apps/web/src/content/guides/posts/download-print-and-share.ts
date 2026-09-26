import { list, p, shot, UPDATED } from "../blocks";
import { DAILY_PAGES } from "../faqs";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "download-print-and-share",
  title: "How do I download, print or send my handwritten pages?",
  description: "Which format to pick, how to print at the right size, and how to send your pages on WhatsApp, email or Instagram.",
  answer:
    "Press Download and pick PDF for printing or submitting, or PNG for images to send. When you print, choose Actual size, not Fit to page, so the writing stays the right size.",
  minutes: 2,
  updated: UPDATED,
  related: ["use-truehand-on-your-phone", "typed-assignment-to-handwriting"],
  cta: { href: "/", label: "Open the editor" },
  sections: [
    {
      heading: "Step 1: Pick a format",
      blocks: [
        p(
          "PDF (1) puts every page in one file, best for printing and submitting. PNG gives one image per page, best for WhatsApp and Instagram. ZIP is all the images in one file.",
        ),
        shot("download-options", "The download window with format and quality"),
      ],
    },
    {
      heading: "Step 2: Save it",
      blocks: [
        p("The file downloads by itself. If it didn't, press Download again (1)."),
        shot("download-ready", "The download window after the file is ready"),
      ],
    },
    {
      heading: "Printing",
      blocks: [
        list(
          "Pick the same paper size you used (A4 in most countries).",
          "Set scale to Actual size or 100%.",
          "Print in colour if you can: blue ink looks much more real.",
        ),
      ],
    },
  ],
  faqs: [
    DAILY_PAGES,
    { q: "How do I send it on WhatsApp without it getting blurry?", a: "Send the PDF as a document; WhatsApp doesn't compress documents." },
    { q: "The printed lines don't match my notebook.", a: "Check the paper type and paper size in Truehand, and print at Actual size." },
  ],
};

export default guide;
