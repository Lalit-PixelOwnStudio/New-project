import type { UseCase } from "../types";

const useCase: UseCase = {
  slug: "letters",
  name: "Letters & cards",
  title: "Handwritten letters and cards, from typed text",
  description:
    "Write thank-you notes, cards and letters that look handwritten in pen, on plain, kraft or vintage paper. Elegant cursive and relaxed everyday hands.",
  lede: "Thank-you notes, birthday cards and letters that look written with a real pen, on plain, kraft or vintage paper.",
  settings: {
    text: `Dear Maya,
Thank you so much for the book. I started it on the train home and nearly missed my stop, which I think is the best review a book can get.
It was lovely to see you last weekend. Let's not leave it so long next time; I'll cook, you bring the terrible jokes.
With love,
Sam`,
    paperId: "plain",
    styleId: "marlowe",
    penId: "fountain",
    fontSize: 1.2,
    messiness: 0.3,
  },
  sections: [
    {
      heading: "Choose a hand for the occasion",
      body: [
        "Joined cursive like Marlowe, Celeste or Grace suits thank-you notes and formal letters. Everyday hands like Poppy, Lily or Zoe read as warm and informal. For invitations, Vivian's flourished capitals do a lot of the work.",
        "A fountain pen gives slightly feathered edges and darker ink where strokes overlap; gel pens are smoother and more saturated.",
      ],
    },
    {
      heading: "Print it on real card",
      body: [
        "Download a PNG with a transparent background (Pro) and place it on your own card design, or print the plain page onto good paper. In 4K the ink texture survives printing.",
      ],
    },
  ],
  faq: [
    {
      q: "Can I send many personalised letters at once?",
      a: "Yes, with batch letters: write one template with {{name}} and other fields, upload a spreadsheet, and download one letter per row. It is part of Pro and described on the business page.",
    },
  ],
};

export default useCase;
