import shots from "./guide-images.json";

export interface GuideBlock {
  kind: "p" | "list" | "steps" | "note" | "image";
  text?: string;
  items?: string[];
  image?: { src: string; width: number; height: number; alt: string; caption?: string; narrow?: boolean };
}

/**
 * A starter guide answers one question a student would ask. It opens with a
 * short answer, then shows each step on a screenshot of the real editor, and
 * ends with fixes for what usually goes wrong.
 */
export interface Guide {
  slug: string;
  /** The question, as someone would ask it. */
  title: string;
  description: string;
  /** Two or three sentences that answer the question on their own. */
  answer: string;
  /** Minutes to read, rounded. */
  minutes: number;
  updated: string;
  sections: { heading: string; blocks: GuideBlock[] }[];
  /** Common problems and their fixes. */
  faqs: { q: string; a: string }[];
  related: string[];
  /** Where "try it" goes: usually the editor, already set up for this job. */
  cta: { href: string; label: string };
}

const p = (text: string): GuideBlock => ({ kind: "p", text });
const list = (...items: string[]): GuideBlock => ({ kind: "list", items });
const note = (text: string): GuideBlock => ({ kind: "note", text });

type Shot = keyof typeof shots;
/** A screenshot from public/guides, made by scripts/guide-shots.ts. */
const shot = (name: Shot, alt: string, caption?: string): GuideBlock => ({
  kind: "image",
  image: { src: `/guides/${name}.webp`, ...shots[name], alt, caption, narrow: name.startsWith("phone-") },
});
/** A finished page, rendered by the engine at build time. */
const sample = (name: string, alt: string, caption?: string): GuideBlock => ({
  kind: "image",
  image: { src: `/specimens/${name}.webp`, width: 1111, height: 1572, alt, caption, narrow: true },
});

const UPDATED = "2026-09-25";

/* Problems that come up in more than one guide. */
const ONLY_THREE_PAGES = {
  q: "Why did only 3 pages download?",
  a: "Free downloads include the first 3 pages, and 10 pages a day. For a longer file, download it in parts: keep your full text safe, paste in the first part and download, then paste the next part and download again. A week pass removes the limit.",
};
const PRO_SELECTED = {
  q: "The download window says I picked a Pro option. What do I do?",
  a: "Anyone can try Pro hands, papers and pens in the preview, but downloading them needs Pro. Tap Use free options in the download window and everything switches back to free choices.",
};
const TEXT_PRIVATE = {
  q: "Is my text uploaded or saved anywhere?",
  a: "No. Your text becomes handwriting inside your own browser and is never sent to us. It stays in that browser so it's there when you come back; clearing your browser data removes it.",
};

export const GUIDES: Guide[] = [
  {
    slug: "getting-started",
    title: "How do I use Truehand? A starter guide",
    description: "A quick tour of the editor: where to type, where to pick the handwriting, paper and pen, and how to download your pages. With screenshots.",
    answer:
      "Type or paste your text on the left, pick a handwriting, paper and pen, check the preview on the right, and press Download. It's free, works on a laptop or phone, and needs no sign-up.",
    minutes: 3,
    updated: UPDATED,
    related: ["typed-assignment-to-handwriting", "use-truehand-on-your-phone"],
    cta: { href: "/", label: "Make my first page" },
    sections: [
      {
        heading: "The editor at a glance",
        blocks: [
          shot("editor-tour", "The Truehand editor with four numbered parts", "1 Your text · 2 Hand, paper and pen · 3 Live preview · 4 Download"),
          list(
            "1. Your text: type here, or paste from Word, Google Docs or WhatsApp.",
            "2. Hand, paper and pen: how your page looks.",
            "3. Preview: your page, written out. It updates as you type.",
            "4. Download: save it as a PDF or images.",
          ),
        ],
      },
      {
        heading: "Step 1: Add your text",
        blocks: [
          p("Delete the sample with the bin icon (5), then type or paste. Use the toolbar like any document."),
          shot(
            "toolbar",
            "The formatting toolbar with five numbered groups",
            "1 Normal, heading, subheading · 2 Bold, underline, strike, highlighter · 3 Lists · 4 New page · 5 Clear all",
          ),
        ],
      },
      {
        heading: "Step 2: Pick a handwriting",
        blocks: [
          p("Tap Hand (1). Every name is written in its own handwriting, so you can see it before you pick. Everyday (2) has the most natural, messy hands."),
          shot("pick-hand", "The handwriting menu, open"),
        ],
      },
      {
        heading: "Step 3: Pick a paper",
        blocks: [
          p("Tap Paper. College ruled is a normal notebook page. Anything marked Pro can be previewed for free."),
          shot("pick-paper", "The paper menu, open"),
        ],
      },
      {
        heading: "Step 4: Download",
        blocks: [
          p("Press Download, pick PDF (1) and press the big button (3). Screen quality (2) is fine for most things."),
          shot("download-options", "The download window with format, quality and the download button"),
        ],
      },
    ],
    faqs: [
      {
        q: "Is Truehand free?",
        a: "Yes. The free plan has 16 handwritings, 5 papers and 3 pens, and lets you download up to 3 pages at a time and 10 a day, with no watermark. Pro removes the ads and limits and unlocks everything.",
      },
      { q: "Do I need an account?", a: "No. You only need one if you buy Pro or a page pack, so your purchase is saved." },
      TEXT_PRIVATE,
      PRO_SELECTED,
    ],
  },
  {
    slug: "typed-assignment-to-handwriting",
    title: "How do I convert my typed assignment into handwriting?",
    description: "Turn a typed assignment into handwritten pages with your name, class and page numbers, free and online. Step by step with screenshots.",
    answer:
      "Paste your assignment into Truehand, add your name and class in Style & page, pick a handwriting and notebook paper, and download a PDF. It takes about two minutes and it's free.",
    minutes: 3,
    updated: UPDATED,
    related: ["name-class-on-every-page", "make-it-look-real"],
    cta: { href: "/use/assignments", label: "Convert my assignment" },
    sections: [
      {
        heading: "What you'll get",
        blocks: [
          sample("use-assignments-page", "A handwritten assignment page with a name, class and subject at the top", "An assignment page made in Truehand"),
        ],
      },
      {
        heading: "Step 1: Paste your assignment",
        blocks: [
          p("Clear the sample (5) and paste. Make the title bigger with H1 and question numbers with H2 (1)."),
          shot("toolbar", "The formatting toolbar"),
        ],
      },
      {
        heading: "Step 2: Add your name and class",
        blocks: [
          p("Open Style & page. Type your name and class in Top left, and the subject and date in Top right (1). Tick Number the pages (2)."),
          shot("page-settings", "The Page settings with name, class and page numbers"),
          shot(
            "page-header-result",
            "The top of a handwritten page with the name, class, roll number and subject",
            "Your details are written at the top of every page",
          ),
        ],
      },
      {
        heading: "Step 3: Pick the hand and paper",
        blocks: [
          p("Mira and Theo look like neat student writing. For paper, pick College ruled or Wide ruled."),
          shot("pickers", "The hand, paper and pen menus"),
        ],
      },
      {
        heading: "Step 4: Download the PDF",
        blocks: [
          p("Press Download, choose PDF, and you're done. Print at Actual size so the lines stay the right size."),
          shot("download-options", "The download window"),
        ],
      },
      {
        heading: "Before you submit",
        blocks: [
          note("If your teacher asked for the assignment in your own handwriting, check with them first. Some teachers want it written by hand as practice."),
        ],
      },
    ],
    faqs: [
      ONLY_THREE_PAGES,
      {
        q: "Will my teacher know it isn't my handwriting?",
        a: "It looks like real handwriting, with letters that change slightly every time, but it won't look like your own. If your teacher knows how you write, or asked for work in your own hand, ask them before you use it.",
      },
      { q: "How do I start each question on a new page?", a: "Click where the page should end and press the new page icon in the toolbar." },
      {
        q: "Can I draw diagrams or tables?",
        a: "Not yet. Write table rows one per line, like “1. Length: 20 cm, Time: 9.1 s”. For diagrams, leave a few empty lines and draw them after printing.",
      },
      {
        q: "Can I write in Hindi or another language?",
        a: "Truehand writes English and languages with the same alphabet, like Spanish or French; some hands also write Russian or Greek. Hindi isn't supported yet. Characters it can't write are skipped and listed above the preview.",
      },
    ],
  },
  {
    slug: "name-class-on-every-page",
    title: "How do I add my name, class and roll number to every page?",
    description: "Put your name, class, roll number, subject and date at the top of every handwritten page, and number the pages.",
    answer:
      "Open the Style & page tab, type your details in Top left and Top right, and tick Number the pages. They're written at the top of every page, in the same handwriting.",
    minutes: 1,
    updated: UPDATED,
    related: ["typed-assignment-to-handwriting", "lab-record-format"],
    cta: { href: "/use/assignments", label: "Open the editor" },
    sections: [
      {
        heading: "Step 1: Open Style & page",
        blocks: [p("It's the second tab at the top of the editor, next to Text. Scroll down to Page.")],
      },
      {
        heading: "Step 2: Fill in the top of the page",
        blocks: [
          p("Top left: your name, class and roll number. Top right: the subject and date (1). Tick Number the pages (2)."),
          shot("page-settings", "Top left, Top right and Number the pages in the Page settings"),
        ],
      },
      {
        heading: "The result",
        blocks: [shot("page-header-result", "A handwritten page with the name and subject at the top")],
      },
    ],
    faqs: [
      {
        q: "Can I put my name only on the first page?",
        a: "Top left and Top right go on every page. For the first page only, leave them empty and type your name as the first line of your text.",
      },
      { q: "My details are too long.", a: "Keep each side short: name, class and roll number on the left; subject and date on the right." },
      { q: "Where do the page numbers go?", a: "At the bottom right of each page." },
    ],
  },
  {
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
      { q: "Can I make it look scanned or photographed?", a: "Yes, with Pro: the Scanned and Phone photo finishes in Style & page." },
    ],
  },
  {
    slug: "lab-record-format",
    title: "How do I write my lab record or practical file online?",
    description: "Write each experiment in the usual lab record format and download neat handwritten pages. With the format, screenshots and fixes.",
    answer:
      "Open the lab record editor, write Aim, Apparatus, Procedure, Observations and Result as headings, put the experiment number and date at the top, and download a PDF. Start each experiment on a new page.",
    minutes: 3,
    updated: UPDATED,
    related: ["name-class-on-every-page", "typed-assignment-to-handwriting"],
    cta: { href: "/use/lab-records", label: "Write my lab record" },
    sections: [
      {
        heading: "What you'll get",
        blocks: [sample("use-lab-records-page", "A handwritten lab record page with aim, apparatus and procedure", "A lab record page made in Truehand")],
      },
      {
        heading: "The usual format",
        blocks: [
          list("Experiment number and date", "Aim", "Apparatus", "Theory", "Procedure (numbered steps)", "Observations", "Result", "Precautions"),
          p("Check your lab manual in case yours is different."),
        ],
      },
      {
        heading: "Step 1: Headings and lists",
        blocks: [
          p("Make each part a heading with H2 (1). Use the numbered list (3) for the procedure. Press the new page icon (4) before the next experiment."),
          shot("toolbar", "The formatting toolbar"),
        ],
      },
      {
        heading: "Step 2: Experiment number and date",
        blocks: [p("In Style & page, put the experiment number in Top left and the date in Top right (1)."), shot("page-settings", "The Page settings")],
      },
    ],
    faqs: [
      {
        q: "How do I make an observation table?",
        a: "Tables aren't drawn yet. Write one reading per line, like “1. Length: 20 cm, Time: 9.1 s”. If your teacher wants a ruled table, leave empty lines and draw it after printing.",
      },
      { q: "Where do diagrams go?", a: "Press Enter a few times to leave space, and draw the diagram in pencil after printing." },
      ONLY_THREE_PAGES,
    ],
  },
  {
    slug: "handwritten-study-notes",
    title: "How do I turn my typed notes into handwritten notes?",
    description: "Paste your class notes and get handwritten revision pages with headings and highlights. Step by step with screenshots.",
    answer:
      "Paste your notes, make each topic a heading, highlight the key words, and download a PDF. You get handwritten revision notes without copying everything out by hand.",
    minutes: 2,
    updated: UPDATED,
    related: ["make-it-look-real", "download-print-and-share"],
    cta: { href: "/", label: "Make my notes" },
    sections: [
      {
        heading: "Step 1: Paste and add headings",
        blocks: [
          p("Paste your notes. Make topics H1 and sub-topics H2 (1). Select key words and press the highlighter (2). Turn points into bullets (3)."),
          shot("toolbar", "The formatting toolbar"),
        ],
      },
      {
        heading: "Step 2: Pick a clear hand and paper",
        blocks: [p("Mira or Noor on College ruled or Grid paper are easy to read."), shot("pickers", "The hand, paper and pen menus")],
      },
      {
        heading: "Tips for revision",
        blocks: [
          list(
            "One topic per page: press the new page icon (4) before each topic.",
            "Highlight a few words, not whole paragraphs.",
            "Cornell paper, with a questions column and a summary box, is part of Pro.",
          ),
        ],
      },
    ],
    faqs: [
      { q: "Can I paste from Google Docs or Word?", a: "Yes. Headings, bold, underline and lists usually come across. Italic text becomes normal writing." },
      TEXT_PRIVATE,
      ONLY_THREE_PAGES,
    ],
  },
  {
    slug: "write-a-journal-online",
    title: "How do I write a journal or diary in handwriting online?",
    description: "Write your journal or diary on your phone or laptop and keep each day as a handwritten page you can save or share.",
    answer:
      "Type your entry, put the date in Top right, pick a relaxed hand like Lily or Zoe, and download each day as a PNG image or a PDF. Nothing you write is uploaded, so your diary stays private.",
    minutes: 2,
    updated: UPDATED,
    related: ["use-truehand-on-your-phone", "download-print-and-share"],
    cta: { href: "/use/journal", label: "Start my journal" },
    sections: [
      {
        heading: "What you'll get",
        blocks: [sample("use-journal-page", "A handwritten journal page with a date and highlighted lines", "A journal page made in Truehand")],
      },
      {
        heading: "Step 1: Write and add the date",
        blocks: [p("Write your entry. In Style & page, put the date in Top right (1)."), shot("page-settings", "The Page settings")],
      },
      {
        heading: "Step 2: Switch to free options if asked",
        blocks: [
          p("The journal page starts with some Pro choices so you can see them. On the free plan, tap Use free options (1) when you download."),
          shot("download-pro", "The download window offering to switch to free options"),
        ],
      },
    ],
    faqs: [
      TEXT_PRIVATE,
      { q: "Can I write one page per day?", a: "Yes. Press the new page icon in the toolbar before each new date." },
      { q: "Can I post a page on Instagram?", a: "Download it as PNG and post the image. Crop it to the part you want." },
    ],
  },
  {
    slug: "handwritten-letter-or-card",
    title: "How do I make a handwritten letter or card online?",
    description: "Write a thank-you note, birthday card or letter in a handwriting you like, then print it or send it as an image.",
    answer:
      "Type your message, pick a warm hand like Lily or June on plain paper, make the writing a bit bigger, and download a PDF to print or a PNG to send. Sign it with a real pen after printing.",
    minutes: 2,
    updated: UPDATED,
    related: ["download-print-and-share", "make-it-look-real"],
    cta: { href: "/use/letters", label: "Write my letter" },
    sections: [
      {
        heading: "What you'll get",
        blocks: [sample("use-letters-page", "A handwritten letter on plain paper", "A letter made in Truehand")],
      },
      {
        heading: "Step 1: Write and pick a hand",
        blocks: [
          p("Type your message; three or four lines look best on a card. Lily and June are free; flowing cursive hands are part of Pro."),
          shot("pick-hand", "The handwriting menu"),
        ],
      },
      {
        heading: "Step 2: Make the writing bigger",
        blocks: [p("In Style & page, turn Size (1) up so the message fills the page."), shot("writing-settings", "The Size setting")],
      },
    ],
    faqs: [
      {
        q: "How do I print it on a card?",
        a: "Use thick paper or card if your printer takes it, choose Actual size in the print window, and sign it by hand.",
      },
      {
        q: "Can I write lots of letters with different names?",
        a: "Yes, with Batch letters (Pro): upload a list of names and Truehand writes one letter for each person.",
      },
      PRO_SELECTED,
    ],
  },
  {
    slug: "use-truehand-on-your-phone",
    title: "Can I use Truehand on my phone?",
    description: "Yes. Here's where everything is on a phone: the Text tab, the Style & page tab and the Download button. With screenshots.",
    answer:
      "Yes. Open Truehand in Chrome or Safari; there's no app to install. Type in the Text tab, change the look in Style & page, and tap Download at the bottom of the screen.",
    minutes: 1,
    updated: UPDATED,
    related: ["download-print-and-share", "typed-assignment-to-handwriting"],
    cta: { href: "/", label: "Open the editor" },
    sections: [
      {
        heading: "Step 1: Write in the Text tab",
        blocks: [
          p("Type or paste in the Text tab (1). Hand, paper and pen are just below the toolbar (2). Download (3) stays at the bottom of the screen."),
          shot("phone-text", "Truehand on a phone, with the Text tab, pickers and Download button marked"),
        ],
      },
      {
        heading: "Step 2: Change the look in Style & page",
        blocks: [p("Tap Style & page (1) for size, messiness, your name and date, and page numbers."), shot("phone-style", "The Style & page tab on a phone")],
      },
    ],
    faqs: [
      {
        q: "Where did my PDF go?",
        a: "On Android, it's in Downloads (open it from the notification or the Files app). On iPhone, choose Save to Files, or use the share button to send it to WhatsApp.",
      },
      { q: "Will my text be there if I close the tab?", a: "Yes, it's kept in your phone's browser. Clearing your browser data removes it." },
      { q: "Is there an app?", a: "No app is needed. Add Truehand to your home screen from the browser menu to open it in one tap." },
    ],
  },
  {
    slug: "download-print-and-share",
    title: "How do I download, print or send my handwritten pages?",
    description: "Which format to pick, how to print at the right size, and how to send your pages on WhatsApp, email or Instagram.",
    answer:
      "Press Download and pick PDF for printing or submitting, or PNG for images to send. When you print, choose Actual size, not Fit to page, so the writing stays the right size.",
    minutes: 2,
    updated: UPDATED,
    related: ["use-truehand-on-your-phone", "typed-assignment-to-handwriting"],
    cta: { href: "/", label: "Open the editor" },
    sections: [
      {
        heading: "Step 1: Pick a format",
        blocks: [
          p(
            "PDF (1) puts every page in one file, best for printing and submitting. PNG gives one image per page, best for WhatsApp and Instagram. ZIP is all the images in one file.",
          ),
          shot("download-options", "The download window with format and quality"),
        ],
      },
      {
        heading: "Step 2: Save it",
        blocks: [
          p("The file downloads by itself. If it didn't, press Download again (1)."),
          shot("download-ready", "The download window after the file is ready"),
        ],
      },
      {
        heading: "Printing",
        blocks: [
          list(
            "Pick the same paper size you used (A4 in most countries).",
            "Set scale to Actual size or 100%.",
            "Print in colour if you can: blue ink looks much more real.",
          ),
        ],
      },
    ],
    faqs: [
      ONLY_THREE_PAGES,
      { q: "How do I send it on WhatsApp without it getting blurry?", a: "Send the PDF as a document; WhatsApp doesn't compress documents." },
      { q: "The printed lines don't match my notebook.", a: "Check the paper type and paper size in Truehand, and print at Actual size." },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
