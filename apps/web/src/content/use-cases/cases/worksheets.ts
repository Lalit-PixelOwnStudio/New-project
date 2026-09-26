import type { UseCase } from "../types";

const useCase: UseCase = {
  slug: "worksheets",
  name: "Worksheets",
  title: "Handwritten worksheets and notes for teachers",
  description: "Make worksheets, board notes and handouts that look handwritten. Clear, friendly hands on grid or wide-ruled paper, with free PDF downloads.",
  lede: "Friendly, readable handwriting for worksheets and handouts, on grid or wide-ruled paper, ready to print.",
  settings: {
    text: `# Fractions warm-up
Name: ______________   Date: ________
1. 1/2 + 1/4 = ______
2. 3/5 − 1/5 = ______
3. Which is bigger, 2/3 or 3/5? Explain how you know.
4. Shade 3/8 of the circle below.
**Challenge:** Write three different fractions that are equal to 1/2.`,
    paperId: "wide",
    styleId: "pip",
    messiness: 0.2,
    fontSize: 1.15,
  },
  sections: [
    {
      heading: "Readable first",
      body: [
        "For younger readers, rounder hands like Pip, Max and Lily are the easiest to read, and a larger size on wide-ruled paper helps. Keep messiness low so letters stay consistent.",
      ],
    },
  ],
  faq: [{ q: "Can I use it for commercial worksheets?", a: "Yes. What you create with Truehand is yours to use, including in materials you sell." }],
};

export default useCase;
