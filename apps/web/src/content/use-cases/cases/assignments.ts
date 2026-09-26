import type { UseCase } from "../types";

const useCase: UseCase = {
  slug: "assignments",
  name: "Assignments",
  title: "Typed assignments, written out by hand",
  description:
    "Turn a typed assignment into ruled notebook pages that look handwritten, with headings, underlines, page numbers and your name in the corner. Free PDF download.",
  lede: "Paste your answer, add your name and date, and download notebook pages with the headings underlined and the pages numbered.",
  settings: {
    text: `# The causes of the First World War
Historians often sum up the long-term causes with one word: __MAIN__, for militarism, alliances, imperialism and nationalism.
By 1914 the great powers had spent a decade building armies and navies, and each side read the other's build-up as a threat. The alliance system meant a local quarrel could not stay local for long.
The assassination of Archduke Franz Ferdinand in Sarajevo on 28 June 1914 was the ==spark, not the cause==. Within six weeks, Austria-Hungary, Russia, Germany, France and Britain were at war.
## Short-term causes
- The July Crisis and Austria-Hungary's ultimatum to Serbia
- Germany's "blank cheque" of support to Austria-Hungary
- The Schlieffen Plan, which required an attack through Belgium`,
    paperId: "college",
    styleId: "mira",
    pageNumbers: true,
  },
  sections: [
    {
      heading: "Format it like a real notebook page",
      body: [
        "Start the title with # and it is written larger and underlined, the way most people head a page. Use ## for sub-headings, and a dash for bullet points. Put your name and class in the top-left box and the subject or date on the right; with page numbers on, every page is numbered in the corner.",
        "College-ruled paper (7.1 mm lines) is the default in most countries. If your school uses wider lines, switch to Wide ruled; narrow lines fit more words per page.",
      ],
    },
    {
      heading: "Make it read as written, not printed",
      body: [
        "Real handwriting is never perfectly even. Messiness around Natural gives letters that vary without looking careless. Fatigue makes the writing loosen slightly toward the bottom of each page, which is what happens to anyone writing three pages in one go.",
        "Every time you press “Rewrite with a fresh hand”, the whole page is written again with new variation, while your text stays the same.",
      ],
    },
    {
      heading: "Print it the right size",
      body: [
        "Choose A4 or Letter to match your printer paper, and print at 100% or “actual size”, not “fit to page”, so the ruled lines stay the right height. The free Full HD download prints cleanly; 2K and 4K are sharper if you look closely.",
      ],
    },
    {
      heading: "Check what your school allows",
      body: [
        "Truehand is a writing tool, like a word processor with a very human font. Some teachers set handwritten work on purpose, to practise handwriting or to be sure the work is yours. If a task says it must be written by hand, ask before you hand in a printed page.",
      ],
    },
  ],
  faq: [
    {
      q: "Is it free?",
      a: "Yes. You can download 10 pages a day for free, with 16 handwriting styles and no watermark. A plan adds pages and every style, and removes the ads.",
    },
    {
      q: "Can I use my own handwriting?",
      a: "Capturing your own handwriting from a photo is being built now. Until then, pick the style closest to yours and adjust size, slant and messiness.",
    },
    {
      q: "Does my assignment get uploaded anywhere?",
      a: "No. The pages are drawn in your browser. Your text never leaves your device unless you choose to save it to your account.",
    },
  ],
};

export default useCase;
