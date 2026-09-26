import { p, shot, UPDATED } from "../blocks";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "make-it-look-real",
  title: "How do I make it look like real handwriting, not a font?",
  description: "The four settings that make a page look really handwritten, shown on screenshots: the hand, messiness, slant and a fresh rewrite.",
  answer:
    "Pick one of the Everyday hands, keep Messiness around the middle, add a small slant, and press Rewrite with a fresh hand until the page looks natural. Real handwriting is never perfectly neat.",
  minutes: 2,
  updated: UPDATED,
  related: ["typed-assignment-to-handwriting", "download-print-and-share"],
  cta: { href: "/", label: "Try it now" },
  sections: [
    {
      heading: "Font vs Truehand",
      blocks: [
        p("A handwriting font repeats every letter exactly. Truehand writes each one a little differently, like a real hand."),
        {
          kind: "image",
          image: {
            src: "/specimens/compare-font.webp",
            width: 720,
            height: 176,
            alt: "The same line three times in a handwriting font, all identical",
            caption: "A handwriting font: three identical lines",
          },
        },
        {
          kind: "image",
          image: {
            src: "/specimens/compare-hand.webp",
            width: 720,
            height: 176,
            alt: "The same line three times in Truehand, each slightly different",
            caption: "Truehand: the same hand, three different lines",
          },
        },
      ],
    },
    {
      heading: "Step 1: Pick an Everyday hand",
      blocks: [
        p("Open Hand and tap Everyday (2). Zoe, Lily, Tara and Milo look the most like real people's notes."),
        shot("pick-hand", "The Everyday handwritings"),
      ],
    },
    {
      heading: "Step 2: Adjust the writing",
      blocks: [
        p(
          "In Style & page: Size (1) fits the writing to the lines, Messiness (2) around the middle looks natural, and a little Slant (3) is how most people write. Rewrite with a fresh hand (4) writes the page again with new small differences.",
        ),
        shot("writing-settings", "The writing settings: size, messiness, slant and rewrite"),
      ],
    },
  ],
  faqs: [
    { q: "It looks too messy.", a: "Turn Messiness down, or pick a neater hand like Mira, Theo or Noor." },
    { q: "The writing is too big for the lines.", a: "Lower Size, or pick Wide ruled paper, which has more space between lines." },
    { q: "Can I make it look scanned or photographed?", a: "Yes, with the Month or Year plan: the Scanned and Phone photo finishes in Style & page." },
  ],
};

export default guide;
