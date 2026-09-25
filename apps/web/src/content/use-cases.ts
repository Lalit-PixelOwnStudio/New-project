import type { FaqItem } from "@/components/Faq";
import type { EditorSettings } from "@/lib/settings";

export interface UseCase {
  slug: string;
  /** Short name for lists and nav. */
  name: string;
  /** H1, written for search as much as for people. */
  title: string;
  description: string;
  lede: string;
  settings: Partial<EditorSettings>;
  sections: { heading: string; body: string[] }[];
  faq: FaqItem[];
}

export const USE_CASES: UseCase[] = [
  {
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
      headerLeft: "Aarav Mehta · 10B",
      headerRight: "History",
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
  },
  {
    slug: "lab-records",
    name: "Lab records",
    title: "Lab record and practical file pages, handwritten",
    description:
      "Write up experiments with aim, apparatus, procedure, observations and result on ruled pages that look handwritten. Numbered steps, bold labels, free PDF.",
    lede: "Aim, apparatus, procedure, observations, result. Type the write-up once and get tidy, handwritten practical-file pages.",
    settings: {
      text: `# Experiment 4: Verifying Ohm's law
**Aim:** To verify that the current through a resistor is proportional to the potential difference across it.
**Apparatus:** Battery eliminator, resistor (10 Ω), ammeter (0–1 A), voltmeter (0–10 V), rheostat, key, connecting wires.
**Procedure:**
1. Connect the circuit as shown in the diagram, with the voltmeter across the resistor.
2. Close the key and set the rheostat to give a small current.
3. Record the ammeter and voltmeter readings.
4. Repeat for five more rheostat positions.
**Observations:** The ratio V/I stayed between 9.8 Ω and 10.2 Ω for all six readings.
**Result:** V is proportional to I, so Ohm's law is verified. The resistance is __10.0 ± 0.2 Ω__.`,
      paperId: "college",
      styleId: "theo",
      messiness: 0.2,
      headerLeft: "Expt. No. 4",
      headerRight: "Date: 25/09",
      pageNumbers: true,
      underlineHeadings: true,
    },
    sections: [
      {
        heading: "The structure examiners look for",
        body: [
          "Most practical files follow the same order: Aim, Apparatus (or Materials), Theory or Principle, Procedure, Observations, Calculations, Result, and Precautions. Put each label in bold with **Aim:** so it is written a little heavier, the way people press harder on headings.",
          "Numbered lines (1., 2., 3.) become a numbered list with a hanging indent, so long steps wrap neatly under the text rather than under the number.",
        ],
      },
      {
        heading: "Leave space for diagrams and tables",
        body: [
          "Diagrams and observation tables are usually drawn by hand anyway. Leave empty lines where they go, or start a new page with --- on a line of its own, then draw them on the printout.",
        ],
      },
      {
        heading: "Pick a neat hand",
        body: [
          "Lab records are read by someone checking details, so a tidy, upright style works best. Theo, Ada and Sasha are clear print hands; keep messiness low and the page reads like a careful write-up.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I add the experiment number and date to every page?",
        a: "Yes. Put them in the Top left and Top right boxes under Page. They are written on every page, and page numbers can be added too.",
      },
      { q: "What about graphs?", a: "Draw graphs on graph paper and file them next to the write-up; that is what most examiners expect in any case." },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export const useCaseBySlug = (slug: string) => USE_CASES.find((u) => u.slug === slug);
