import { list, p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "text-to-handwriting-converter",
  title: "Text to handwriting converter: how it works, and how to make it look real",
  seoTitle: "Text to Handwriting Converter: How It Works",
  description: "What a text to handwriting converter does, why most results look fake, and how to make typed text look genuinely handwritten on ruled paper.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 5,
  intro:
    "A text to handwriting converter takes typed text and writes it out on a page in a handwriting style, ready to download as a PDF or image. The good ones vary every letter, wobble the line and press the ink unevenly, the way a real hand does. Here's how that works and how to get the most realistic result.",
  sections: [
    {
      heading: "Why most converters look fake",
      blocks: [
        p(
          "Most converters simply set your text in a handwriting font. A font draws every “e” exactly the same, on a perfectly straight line, with perfectly even spacing. Your eye notices that repetition immediately, even if you can't say why.",
        ),
        p(
          "Real handwriting is never that regular. The same letter changes a little every time, words drift up and down, and the writing gets looser as your hand tires.",
        ),
      ],
    },
    {
      heading: "What makes it look real",
      blocks: [
        list(
          "Letter variation: each letter is drawn slightly differently every time it appears.",
          "A wandering baseline: words sit a little above or below the line, and lines drift.",
          "Ink and pressure: strokes are darker where the pen pressed harder, and the ink looks absorbed by the paper.",
          "The right paper: ruled lines, a margin and a paper texture that match a real notebook.",
          "Fatigue: the writing loosens slightly towards the bottom of a long page.",
        ),
        p("Truehand does all of these for every page, so no two pages come out the same, and you can press Rewrite for a fresh version of the same text."),
      ],
    },
    {
      heading: "How to use it",
      blocks: [
        steps(
          "Type or paste your text in the editor. Start a line with # for a heading.",
          "Pick a handwriting, a paper and a pen. Blue ballpoint on college ruled paper looks most like a school notebook.",
          "In Style & page, set the size and messiness, and add your name and page numbers if you need them.",
          "Download a PDF to print, or PNG images to share.",
        ),
        sample("try-it", "Try it with this paragraph", [
          "# My first handwritten page",
          "This page was typed, not written. Every letter was drawn a moment ago, with its own slant, its own pressure and a small wobble off the line.",
          "Change anything and watch the page write itself again.",
        ]),
      ],
    },
    {
      heading: "Tips for the most realistic result",
      blocks: [
        list(
          "Choose an everyday hand, not a decorative one. Everyday and print styles look most natural.",
          "Keep messiness around the middle. Too neat looks printed; too messy looks careless.",
          "Print at Actual size, not Fit to page, so the ruled lines stay the right height.",
          "Print in colour: blue ink looks far more real than black.",
        ),
      ],
    },
  ],
  faqs: [
    {
      q: "Can teachers tell it isn't handwritten?",
      a: "It's designed to look natural, but rules differ. If your teacher asks for work written in your own hand, write it yourself. Truehand is best for notes, drafts, letters, cards and anything where printed handwriting is welcome.",
    },
    { q: "Is it free?", a: "Yes. You can write and download 10 pages a day free, in Full HD, with no sign-up." },
    {
      q: "Can I use my own handwriting?",
      a: "Yes. Fill in a one-page template by hand, take a photo, and Truehand turns it into your own handwriting.",
    },
  ],
  related: ["how-to-improve-handwriting", "acknowledgement-for-project-file", "leave-application-for-school"],
};

export default post;
