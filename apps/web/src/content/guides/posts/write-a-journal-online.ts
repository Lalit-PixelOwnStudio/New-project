import { p, sample, shot, UPDATED } from "../blocks";
import { TEXT_PRIVATE } from "../faqs";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "write-a-journal-online",
  title: "How do I write a journal or diary in handwriting online?",
  description: "Write your journal or diary on your phone or laptop and keep each day as a handwritten page you can save or share.",
  answer:
    "Type your entry, put the date in Top right, pick a relaxed hand like Lily or Zoe, and download each day as a PNG image or a PDF. Nothing you write is uploaded, so your diary stays private.",
  minutes: 2,
  updated: UPDATED,
  related: ["use-truehand-on-your-phone", "download-print-and-share"],
  cta: { href: "/use/journal", label: "Start my journal" },
  sections: [
    {
      heading: "What you'll get",
      blocks: [sample("use-journal-page", "A handwritten journal page with a date and highlighted lines", "A journal page made in Truehand")],
    },
    {
      heading: "Step 1: Write and add the date",
      blocks: [p("Write your entry. In Style & page, put the date in Top right (1)."), shot("page-settings", "The Page settings")],
    },
    {
      heading: "Step 2: Switch to free options if asked",
      blocks: [
        p("The journal page starts with some Pro choices so you can see them. On the free plan, tap Use free options (1) when you download."),
        shot("download-pro", "The download window offering to switch to free options"),
      ],
    },
  ],
  faqs: [
    TEXT_PRIVATE,
    { q: "Can I write one page per day?", a: "Yes. Press the new page icon in the toolbar before each new date." },
    { q: "Can I post a page on Instagram?", a: "Download it as PNG and post the image. Crop it to the part you want." },
  ],
};

export default guide;
