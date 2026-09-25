export interface GuideBlock {
  kind: "p" | "list" | "steps" | "note";
  text?: string;
  items?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** Minutes to read, rounded. */
  minutes: number;
  updated: string;
  sections: { heading: string; blocks: GuideBlock[] }[];
  related: string[];
}

const p = (text: string): GuideBlock => ({ kind: "p", text });
const list = (...items: string[]): GuideBlock => ({ kind: "list", items });
const steps = (...items: string[]): GuideBlock => ({ kind: "steps", items });
const note = (text: string): GuideBlock => ({ kind: "note", text });

export const GUIDES: Guide[] = [
  {
    slug: "how-truehand-works",
    title: "How Truehand makes typed text look handwritten",
    description:
      "What happens between pressing a key and seeing a handwritten page: shaping, placing words on ruled lines, controlled randomness, and ink on textured paper.",
    minutes: 6,
    updated: "2026-09-25",
    related: ["make-typed-text-look-handwritten", "ruled-paper-sizes"],
    sections: [
      {
        heading: "Why handwriting fonts look fake",
        blocks: [
          p(
            "A handwriting font stores one drawing of each letter. Type the word “letter” and both t’s are pixel-for-pixel the same, every line sits exactly on its baseline, and every word is the same distance from the next. Our eyes are very good at spotting repetition, so a page set in a handwriting font reads as printed, however scruffy the font itself is.",
          ),
          p(
            "Real handwriting is consistent in style and inconsistent in detail. The same person writes the same letter slightly differently every time, drifts above and below the line, spaces words unevenly and gets a little looser as the page goes on. Truehand keeps the style of a hand and puts the variation back.",
          ),
        ],
      },
      {
        heading: "Step 1: shaping the text",
        blocks: [
          p(
            "Text is first shaped with HarfBuzz, the same text engine used by Chrome, Android and LibreOffice. Shaping turns characters into positioned glyphs and applies the font’s own rules: ligatures, contextual alternates that join cursive letters, and kerning between pairs such as “To”.",
          ),
          p(
            "If a character is missing from a hand, Truehand substitutes what people write by hand: → becomes ->, curly quotes become straight ones, and ≠ becomes =/=. Anything still missing is drawn by a fallback hand with the same visual size.",
          ),
        ],
      },
      {
        heading: "Step 2: putting words on the lines",
        blocks: [
          p(
            "Pages are laid out in real units. College-ruled paper has lines 7.1 mm apart and a margin about 31 mm from the edge; the text size is chosen so the body of each letter fills about a third of the line height, as it does in most people’s notebooks. Words wrap to the next line, headings get a line of space, lists indent under their bullet, and long documents flow onto new pages.",
          ),
        ],
      },
      {
        heading: "Step 3: controlled randomness",
        blocks: [
          p("Every word then gets its own small differences, drawn from a seeded random generator:"),
          list(
            "Size, rotation and slant vary by a few percent and a degree or two.",
            "Each line tilts by a fraction of a degree and its baseline wobbles gently from one end to the other.",
            "Letter outlines are bent by a smooth noise field that lives in the word’s own space, so shapes change without breaking the joins between cursive letters.",
            "Ink pressure varies from word to word, so some words come out a touch darker or heavier.",
            "With fatigue on, all of this grows slowly toward the bottom of each page.",
          ),
          p(
            "The randomness is keyed to the words themselves, not to their order. When you edit one paragraph, the letters in every other paragraph keep exactly the same shapes, so the preview doesn’t jitter while you type. “Rewrite with a fresh hand” simply picks a new seed.",
          ),
        ],
      },
      {
        heading: "Step 4: paper and ink",
        blocks: [
          p(
            "Paper is drawn with a faint tonal variation and a fibre texture, then the printed rules, margin line and any punched holes. The writing is rendered on its own layer, where each pen leaves its own marks: ballpoint skips slightly, gel is smooth and saturated, fountain ink feathers at the edges, and pencil picks up the grain. The ink layer is multiplied onto the paper, so the paper texture shows through the writing as it would in real life.",
          ),
          p(
            "The optional scan and phone-photo finishes then add what a camera or scanner adds: a slight rotation, uneven light, perspective, shadow and sensor noise.",
          ),
        ],
      },
      {
        heading: "Everything runs in your browser",
        blocks: [
          p(
            "All of this happens on your own device, in a background thread, so the page stays responsive and your text is never uploaded. The preview is rendered at screen resolution and only for pages you can see; downloads are rendered again at 150 or 300 dpi.",
          ),
        ],
      },
    ],
  },
  {
    slug: "make-typed-text-look-handwritten",
    title: "How to make typed text look genuinely handwritten",
    description:
      "Practical settings for pages that read as written by hand: choosing a hand, paper and pen, how messy to go, and how to print so it looks right.",
    minutes: 5,
    updated: "2026-09-25",
    related: ["how-truehand-works", "ruled-paper-sizes"],
    sections: [
      {
        heading: "Pick a hand that matches the job",
        blocks: [
          p(
            "Handwriting says something about the writer and the moment. Neat, upright print (Theo, Ada, Sasha) reads as careful. Quick, slanted print (Mira, Kit, Idris) reads as notes taken in class. Everyday hands (Zoe, Rory, Lily, Doc) look like nobody tried to make them pretty, which is often the most convincing choice. Joined cursive (Celeste, Rosa, Marlowe) suits letters and cards.",
          ),
        ],
      },
      {
        heading: "Set the messiness honestly",
        blocks: [
          steps(
            "Start at Natural. Almost everyone’s handwriting sits here.",
            "Go toward Careful for things written slowly: a letter, a fair copy, a title page.",
            "Go toward Quick or Rushed for notes, drafts and anything written under time pressure.",
            "Turn on fatigue for anything longer than a page.",
          ),
          note("Too neat is as suspicious as too messy. If every line is perfectly level, nudge messiness up a little."),
        ],
      },
      {
        heading: "Use structure the way people do",
        blocks: [
          list(
            "Underline titles. Most people do, and Truehand draws the line by hand, slightly uneven.",
            "Use bullets and numbered steps where you would in real notes.",
            "Highlight a few key phrases, not whole paragraphs.",
            "Strike through a word now and then if you’re copying a draft; real pages have corrections.",
          ),
        ],
      },
      {
        heading: "Choose paper and pen together",
        blocks: [
          p(
            "Blue ballpoint on college-ruled paper is the classic school combination. Black gel on plain or dot-grid paper looks like a bullet journal. A fountain pen on cream or kraft paper suits letters. Pencil on grid paper is maths homework.",
          ),
        ],
      },
      {
        heading: "Print it so the lines stay right",
        blocks: [
          p(
            "Match the page size to your printer paper (A4 in most countries, Letter in the US and Canada) and print at 100% or “actual size”, never “fit to page”. The ruled lines are drawn at their real spacing, so scaling would make them look wrong next to a real notebook.",
          ),
        ],
      },
    ],
  },
  {
    slug: "ruled-paper-sizes",
    title: "College, wide and narrow ruled: paper sizes explained",
    description:
      "The line spacing of college-ruled, wide-ruled and narrow-ruled paper in millimetres and inches, what grid and dot paper are for, and which to choose.",
    minutes: 4,
    updated: "2026-09-25",
    related: ["make-typed-text-look-handwritten", "cornell-notes-method"],
    sections: [
      {
        heading: "The three common rulings",
        blocks: [
          list(
            "Wide ruled: 11/32 inch (8.7 mm) between lines. Used in primary schools and by people with large handwriting.",
            "College ruled: 9/32 inch (7.1 mm). The default for most notebooks sold today, for students and adults.",
            "Narrow ruled: 1/4 inch (6.35 mm), often rounded to 6 mm. Fits more words per page for small handwriting.",
          ),
          p(
            "Outside North America, notebooks are usually sold by line spacing in millimetres (6, 7, 8 mm) rather than by name, but they map closely onto the same three sizes.",
          ),
        ],
      },
      {
        heading: "The margin line",
        blocks: [
          p(
            "Most ruled paper has a vertical margin line, traditionally red or pink, about 30 mm (1¼ inch) from the left edge. Writing starts just to its right. Legal pads use a double line, and many European notebooks put the margin on the right instead.",
          ),
        ],
      },
      {
        heading: "Grid, dot and engineering paper",
        blocks: [
          p(
            "Grid paper usually has 5 mm squares, and people write on every second row; engineering pads use a quarter-inch grid on pale green paper. Dot grid prints only the intersections, which keeps pages clean for bullet journals and sketches.",
          ),
        ],
      },
      {
        heading: "Which should I use?",
        blocks: [
          p(
            "If you are copying the look of a school notebook, use college ruled. If your handwriting is large, or the reader is a child, use wide ruled. For maths and science, use grid. For letters and cards, use plain paper, where slightly wandering lines are part of the charm.",
          ),
        ],
      },
    ],
  },
  {
    slug: "cornell-notes-method",
    title: "The Cornell note-taking method, step by step",
    description: "How to set out a Cornell notes page with a cue column, notes area and summary, and how to use it to revise with active recall.",
    minutes: 4,
    updated: "2026-09-25",
    related: ["ruled-paper-sizes", "lab-record-format"],
    sections: [
      {
        heading: "The layout",
        blocks: [
          p(
            "A Cornell page has three parts: a narrow cue column on the left (about 6 cm), a wide notes column on the right, and a summary box across the bottom (about 5 cm tall). Walter Pauk designed it at Cornell University in the 1950s, and it is still one of the most recommended ways to take notes.",
          ),
        ],
      },
      {
        heading: "Using it",
        blocks: [
          steps(
            "During the lesson, write notes in the right-hand column. Keep them brief: phrases, not sentences.",
            "Within a day, reread them and write a question or keyword in the cue column beside each idea.",
            "Write a two- or three-sentence summary of the page in the box at the bottom.",
            "To revise, cover the notes column and answer the questions in the cue column from memory.",
          ),
          note("Truehand fills the notes column for you. Writing the cues and summary by hand, when you review, is the part that makes the method work."),
        ],
      },
    ],
  },
  {
    slug: "lab-record-format",
    title: "How to format a lab record or practical file",
    description: "The standard sections of a lab record (aim, apparatus, theory, procedure, observations, result, precautions) with what to write in each.",
    minutes: 5,
    updated: "2026-09-25",
    related: ["cornell-notes-method", "make-typed-text-look-handwritten"],
    sections: [
      {
        heading: "The standard order",
        blocks: [
          list(
            "Aim: one sentence on what the experiment sets out to show or measure.",
            "Apparatus or materials: everything used, with ranges and least counts for instruments.",
            "Theory or principle: the law or relationship being tested, with the formula.",
            "Procedure: numbered steps in the past tense, specific enough to repeat.",
            "Observations: a table of readings with units in the headings.",
            "Calculations: working shown line by line.",
            "Result: the answer with units and, where relevant, its uncertainty.",
            "Precautions and sources of error: what you did to keep results reliable.",
          ),
        ],
      },
      {
        heading: "Making it quick to mark",
        blocks: [
          p(
            "Examiners read dozens of these. Bold the section labels, number every step, and keep one experiment per page where you can. Put the experiment number and date in the top corners of every page, and number the pages.",
          ),
          p(
            "In Truehand, start a line with **Aim:** to write the label in a heavier hand, use 1. 2. 3. for the procedure, and set the header boxes to the experiment number and date.",
          ),
        ],
      },
      {
        heading: "Diagrams and tables",
        blocks: [
          p(
            "Draw circuit diagrams, ray diagrams and graphs by hand on the printout or on graph paper. Leave empty lines where they belong, or start a new page with --- on a line of its own.",
          ),
        ],
      },
    ],
  },
  {
    slug: "handwritten-letters-for-business",
    title: "Handwritten notes for business: when they work and how to send them",
    description:
      "Why handwritten thank-you notes and letters get read, where they pay off, and how to produce hundreds of personalised ones from a spreadsheet.",
    minutes: 5,
    updated: "2026-09-25",
    related: ["how-truehand-works", "make-typed-text-look-handwritten"],
    sections: [
      {
        heading: "Why they get read",
        blocks: [
          p(
            "Almost everything businesses send is typed. A handwritten envelope or note stands out on a doormat or in a parcel, and people read it because it looks like someone took the time. The effect is strongest when the note is short, specific and signed by a real person.",
          ),
        ],
      },
      {
        heading: "Where they pay off",
        blocks: [
          list(
            "Thank-you notes in e-commerce orders, especially first orders and repeat customers.",
            "Follow-ups after a sales meeting, naming something that was discussed.",
            "Donor thank-yous for charities and schools.",
            "Real estate letters to a single street or building.",
            "Invitations and place cards for events.",
          ),
        ],
      },
      {
        heading: "Producing them at scale",
        blocks: [
          steps(
            "Export your list to CSV with a column for each thing you want to mention: first name, company, city, product bought.",
            "Open batch letters and paste the CSV.",
            "Write the note once with fields like {{first_name}}. Keep it under 80 words.",
            "Choose a size (A6 or 5×7 card, or a DL envelope for addresses), a hand and a pen.",
            "Download one combined PDF and print it at actual size, or a transparent PNG per person for your own designs.",
          ),
          note("Every letter is written separately, with its own variation, so two customers comparing notes won’t find identical copies."),
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
