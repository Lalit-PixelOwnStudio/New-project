import type { UseCase } from "../types";

const useCase: UseCase = {
  slug: "journal",
  name: "Journals",
  title: "Journal and diary pages in handwriting",
  description:
    "Turn typed journal entries into dot-grid or lined diary pages that look handwritten, with highlights and underlines. Free and private: nothing is uploaded.",
  lede: "Type the way you think, keep pages that look like you wrote them. Nothing is uploaded; it all happens in your browser.",
  settings: {
    text: `Thursday, late
Walked the long way home because the light was doing that golden thing again. Saw the neighbour's cat asleep on the ==exact same car== as yesterday.
Things I want to remember:
- the smell of rain on the hot road
- Nani laughing at her own joke before she finished it
- that I __finally__ finished the draft
Tomorrow: sleep earlier. (I say this every night.)`,
    paperId: "dot",
    styleId: "poppy",
    penId: "gel-black",
    messiness: 0.45,
  },
  sections: [
    {
      heading: "Private by design",
      body: [
        "Journals are personal, so Truehand never sends your text to a server to render it. The handwriting is drawn in your browser, and your draft is kept only in this browser unless you save it to your account.",
      ],
    },
  ],
  faq: [{ q: "Can I print it into a physical journal?", a: "Yes. Choose A5 under Page for most notebook-sized journals, and print at actual size." }],
};

export default useCase;
