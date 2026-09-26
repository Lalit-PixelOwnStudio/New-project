import type { UseCase } from "../types";

const useCase: UseCase = {
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
};

export default useCase;
