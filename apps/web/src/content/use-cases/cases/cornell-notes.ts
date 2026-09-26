import type { UseCase } from "../types";

const useCase: UseCase = {
  slug: "cornell-notes",
  name: "Cornell notes",
  title: "Cornell notes, written out by hand",
  description:
    "Cornell-style note pages with a cue column and summary box, filled with your typed notes in realistic handwriting. Print, then add cues and a summary by hand.",
  lede: "Your notes go in the main column; the cue column and summary box are left for you to fill in by hand when you revise.",
  settings: {
    text: `# Cellular respiration
Glucose is broken down to release energy stored as __ATP__.
C6H12O6 + 6O2 → 6CO2 + 6H2O + energy
## Three stages
1. Glycolysis: in the cytoplasm, glucose → 2 pyruvate, net 2 ATP
2. Krebs cycle: in the mitochondrial matrix, releases CO2
3. Electron transport chain: inner membrane, makes ~34 ATP
Without oxygen, cells fall back on ==fermentation==: lactic acid in muscles, ethanol in yeast.`,
    paperId: "cornell",
    styleId: "noor",
  },
  sections: [
    {
      heading: "How the Cornell method works",
      body: [
        "The page is split in three. Notes go in the wide right-hand column during the lesson. Afterwards, you write short questions or keywords in the narrow left column, one per idea. At the bottom, you summarise the page in two or three sentences.",
        "Covering the notes and answering your own cue questions is a form of active recall, which is why the method has lasted since the 1950s.",
      ],
    },
    {
      heading: "Why the cue column stays empty",
      body: [
        "Writing the cues yourself is the part that makes you learn. Truehand fills the notes column; print the pages and add cues and the summary with a pen when you review.",
      ],
    },
  ],
  faq: [{ q: "Is Cornell paper free?", a: "Cornell notes paper is part of Pro, along with the legal pad, dot grid, engineering and other papers." }],
};

export default useCase;
