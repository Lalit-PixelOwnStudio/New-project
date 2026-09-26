import { p, shot, UPDATED } from "../blocks";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "use-truehand-on-your-phone",
  title: "Can I use Truehand on my phone?",
  description: "Yes. Here's where everything is on a phone: the Text tab, the Style & page tab and the Download button. With screenshots.",
  answer:
    "Yes. Open Truehand in Chrome or Safari; there's no app to install. Type in the Text tab, change the look in Style & page, and tap Download at the bottom of the screen.",
  minutes: 1,
  updated: UPDATED,
  related: ["download-print-and-share", "typed-assignment-to-handwriting"],
  cta: { href: "/", label: "Open the editor" },
  sections: [
    {
      heading: "Step 1: Write in the Text tab",
      blocks: [
        p("Type or paste in the Text tab (1). Hand, paper and pen are just below the toolbar (2). Download (3) stays at the bottom of the screen."),
        shot("phone-text", "Truehand on a phone, with the Text tab, pickers and Download button marked"),
      ],
    },
    {
      heading: "Step 2: Change the look in Style & page",
      blocks: [p("Tap Style & page (1) for size, messiness, your name and date, and page numbers."), shot("phone-style", "The Style & page tab on a phone")],
    },
  ],
  faqs: [
    {
      q: "Where did my PDF go?",
      a: "On Android, it's in Downloads (open it from the notification or the Files app). On iPhone, choose Save to Files, or use the share button to send it to WhatsApp.",
    },
    { q: "Will my text be there if I close the tab?", a: "Yes, it's kept in your phone's browser. Clearing your browser data removes it." },
    { q: "Is there an app?", a: "No app is needed. Add Truehand to your home screen from the browser menu to open it in one tap." },
  ],
};

export default guide;
