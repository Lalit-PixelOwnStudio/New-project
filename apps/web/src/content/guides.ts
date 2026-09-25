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
  /** Where "try it" goes: usually the editor, already set up for this job. */
  cta: { href: string; label: string };
}

const p = (text: string): GuideBlock => ({ kind: "p", text });
const list = (...items: string[]): GuideBlock => ({ kind: "list", items });
const steps = (...items: string[]): GuideBlock => ({ kind: "steps", items });
const note = (text: string): GuideBlock => ({ kind: "note", text });

const UPDATED = "2026-09-25";

export const GUIDES: Guide[] = [
  {
    slug: "getting-started",
    title: "Your first handwritten page in two minutes",
    description: "New to Truehand? Type or paste your text, pick a handwriting and a paper, and download a PDF. Here is everything on the screen, explained.",
    minutes: 3,
    updated: UPDATED,
    related: ["write-assignment-online", "use-truehand-on-your-phone"],
    cta: { href: "/", label: "Open the editor" },
    sections: [
      {
        heading: "What you need",
        blocks: [
          p(
            "Just a browser, on a laptop or a phone. There is nothing to install and no account to make. What you type stays on your device: the handwriting is drawn right there in your browser, and your text is never uploaded.",
          ),
        ],
      },
      {
        heading: "Make your first page",
        blocks: [
          steps(
            "Open the editor on the home page. There is already a sample page in it; press the bin icon at the right of the toolbar to clear it.",
            "Type your text, or paste it from Word, Google Docs, WhatsApp or anywhere else.",
            "Pick a handwriting from the Hand menu under the toolbar. Each one shows its name written in that hand, so you can see it before you choose.",
            "Pick a paper (college ruled is the usual notebook page) and a pen (blue ballpoint looks the most like school work).",
            "Watch the preview on the right, or below the editor on a phone. It updates as you type.",
            "Press Download, choose PDF, and your page is saved.",
          ),
        ],
      },
      {
        heading: "Make it look like you wrote it",
        blocks: [
          p("Open the Style & page tab for the settings that make the biggest difference:"),
          list(
            "Messiness: low looks careful, high looks rushed. Most real notes sit around the middle.",
            "Size: make the writing bigger or smaller on the lines.",
            "Slant: tilt the letters forward or back, like a real hand does.",
            "Rewrite with a fresh hand: the same style, written again with different small wobbles. Press it until a page feels right.",
          ),
          note("Tip: the Everyday hands (Zoe, Lily, Tara, Milo, Max, Rory) look the least polished, which is often what makes a page believable."),
        ],
      },
      {
        heading: "Headings, lists and more",
        blocks: [
          p(
            "The toolbar works like a normal document. H1 and H2 write a bigger heading, B presses the pen harder, U underlines, the highlighter marks words in yellow, and the list buttons add bullets or numbers. The page icon starts a new page wherever you put it.",
          ),
        ],
      },
      {
        heading: "What's free",
        blocks: [
          list(
            "16 handwritings, 5 papers and 3 ballpoint pens, with no watermark.",
            "Up to 3 pages in each download and 10 pages a day, as PDF, PNG images or a ZIP.",
            "Anything marked Pro can be previewed by anyone. If you download with a Pro choice selected, the download window offers to switch you to free options in one tap.",
          ),
        ],
      },
    ],
  },
  {
    slug: "write-assignment-online",
    title: "How to make a handwritten assignment online, without any app",
    description:
      "Turn a typed assignment into neat, handwritten-looking pages with your name, class and page numbers, ready to print or submit. Free, in your browser.",
    minutes: 4,
    updated: UPDATED,
    related: ["getting-started", "download-print-and-share"],
    cta: { href: "/use/assignments", label: "Write your assignment" },
    sections: [
      {
        heading: "Before you start",
        blocks: [
          p(
            "Have your answers typed somewhere: Word, Google Docs, notes on your phone, anything. You do not need to install anything or sign up. Open the assignment editor from the button at the end of this guide and it is already set up with notebook paper and a name header.",
          ),
          note(
            "If your teacher has asked for the work in your own handwriting, check with them first. Some teachers want it written by hand as practice, and that is their call.",
          ),
        ],
      },
      {
        heading: "Step by step",
        blocks: [
          steps(
            "Clear the sample text with the bin icon, then paste your assignment.",
            "Select the title and press H1 so it is written larger. Use H2 for question numbers or section names.",
            "Go to Style & page. In Top left, type your name and class. In Top right, type the subject or date. Tick Number the pages.",
            "Choose a hand. Mira and Theo are tidy student print; Zoe and Tara look more casual.",
            "Choose the paper your school uses: College ruled or Wide ruled, and A4 or US Letter under Paper size.",
            "Check every page in the preview. Long answers flow onto new pages by themselves.",
            "Press Download and choose PDF.",
          ),
        ],
      },
      {
        heading: "Tips that make it look real",
        blocks: [
          list(
            "Keep Messiness around the middle. Perfectly neat pages look printed.",
            "Blue ballpoint on college ruled paper is the most ordinary school look, which is the point.",
            "Underline headings (in Style & page) the way people do by hand.",
            "Want a new page for each question? Put the cursor where the page should end and press the new page icon in the toolbar.",
            "Not happy with how a page came out? Press Rewrite with a fresh hand for new small variations.",
          ),
        ],
      },
      {
        heading: "Long assignments",
        blocks: [
          p(
            "Free downloads include the first 3 pages, and up to 10 pages a day. For a longer assignment, download it in parts: keep your full text somewhere safe, paste in the first part and download it, then replace it with the next part and download again. Or a week pass covers every page for the week you need it.",
          ),
        ],
      },
    ],
  },
  {
    slug: "write-a-journal-online",
    title: "How to keep a handwritten journal online",
    description: "Write your journal or diary on your phone or laptop and keep it as real-looking handwritten pages you can save, print or share.",
    minutes: 3,
    updated: UPDATED,
    related: ["use-truehand-on-your-phone", "download-print-and-share"],
    cta: { href: "/use/journal", label: "Start a journal page" },
    sections: [
      {
        heading: "Why a handwritten journal",
        blocks: [
          p(
            "Typing is faster, but handwritten pages feel personal: they are nicer to look back on, print into a notebook, or share a page of. With Truehand you can write the quick way and keep the page the handwritten way.",
          ),
        ],
      },
      {
        heading: "Set up your journal page",
        blocks: [
          steps(
            "Open the journal editor from the button at the end of this guide.",
            "In Style & page, put the date in Top right. Leave Top left empty, or add a title like “Week 12”.",
            "Pick a relaxed hand. Lily, Zoe and Tara are free everyday hands that look like real diary writing.",
            "Pick a paper. Plain or Grid work well for journals; Dot grid, like a bullet journal, is part of Pro.",
            "Write. Use the highlighter for the moments you want to find again, and bullet lists for to-dos.",
          ),
          note(
            "The journal editor starts with a few Pro choices (dot grid paper, a cursive hand and a gel pen) so you can see what's possible. If you download on the free plan, tap Use free options in the download window.",
          ),
        ],
      },
      {
        heading: "Make it feel like a diary",
        blocks: [
          list(
            "Turn Messiness up a little. Journals are written quickly, not neatly.",
            "Try Fatigue in Style & page: the writing gets a little looser towards the bottom of the page, as it does when you write for a while.",
            "One page per day: press the new page icon before each new date.",
          ),
        ],
      },
      {
        heading: "Keep and share it",
        blocks: [
          list(
            "Download PNG to get an image of each page, for your gallery, a phone wallpaper or a story.",
            "Download PDF once a month to keep a tidy archive you can print and bind.",
            "Nothing you write is uploaded, so your journal stays on your device.",
          ),
        ],
      },
    ],
  },
  {
    slug: "handwritten-study-notes",
    title: "Turn typed notes into handwritten study notes",
    description: "Paste your class notes and get handwritten revision pages with headings, highlights and lists, on notebook or Cornell paper.",
    minutes: 3,
    updated: UPDATED,
    related: ["write-assignment-online", "download-print-and-share"],
    cta: { href: "/use/cornell-notes", label: "Make study notes" },
    sections: [
      {
        heading: "Why bother",
        blocks: [
          p(
            "Many people remember handwritten notes better than a wall of typed text. Headings, highlights and the odd underline give your eyes something to hold on to when you revise. Truehand gives you that look from the notes you already typed.",
          ),
        ],
      },
      {
        heading: "Make your notes",
        blocks: [
          steps(
            "Paste your notes into the editor.",
            "Make each topic a heading with H1, and sub-topics with H2.",
            "Select key terms and press the highlighter. Press U to underline definitions.",
            "Turn lists of points into bullets with the list button.",
            "Pick College ruled or Grid paper and a clear hand like Mira, Theo or Noor.",
            "Download as PDF and print, or keep it on your phone for revision.",
          ),
        ],
      },
      {
        heading: "Cornell notes",
        blocks: [
          p(
            "Cornell paper has a narrow column on the left for questions and keywords, and a box at the bottom for a short summary. Writing a summary in your own words is one of the best ways to check you understood the topic. Cornell paper is part of Pro; on the free plan, college ruled with a heading per topic works well too.",
          ),
        ],
      },
      {
        heading: "Make revision easier",
        blocks: [
          list(
            "One topic per page: press the new page icon before each new topic.",
            "Keep highlights few. If everything is yellow, nothing stands out.",
            "Use Skip a line between paragraphs (in Style & page) to give your notes room to breathe.",
          ),
        ],
      },
    ],
  },
  {
    slug: "lab-record-format",
    title: "How to write a lab record or practical file online",
    description: "Write each experiment in the usual lab record format (aim, apparatus, procedure, observations, result) and download neat handwritten pages.",
    minutes: 4,
    updated: UPDATED,
    related: ["write-assignment-online", "download-print-and-share"],
    cta: { href: "/use/lab-records", label: "Write a lab record" },
    sections: [
      {
        heading: "The usual format",
        blocks: [
          p("Most schools and colleges want each experiment in this order. Check your lab manual in case yours differs."),
          list(
            "Experiment number and date, at the top of the page.",
            "Aim: what the experiment sets out to find or show.",
            "Apparatus or materials: a list of what you used.",
            "Theory: the idea or formula behind it, in a few lines.",
            "Procedure: numbered steps, written in the past tense.",
            "Observations: readings, usually in a table.",
            "Calculations and result: what you worked out, with units.",
            "Precautions: two or three things you were careful about.",
          ),
        ],
      },
      {
        heading: "Write it in Truehand",
        blocks: [
          steps(
            "Open the lab record editor from the button at the end of this guide. It starts with an example experiment you can overwrite.",
            "In Style & page, put the experiment number in Top left and the date in Top right. Tick Number the pages and Underline headings.",
            "Make each part (Aim, Apparatus, Procedure…) a heading with H2.",
            "Use the numbered list button for the procedure and bullets for apparatus.",
            "Keep Messiness low. Lab records are usually written carefully.",
            "Start each new experiment on a new page with the new page icon, then download as PDF.",
          ),
        ],
      },
      {
        heading: "Observation tables",
        blocks: [
          p(
            "Tables are hard to draw neatly by hand, and it is the same here: write readings as a numbered list (“1. Length 20 cm, time 9.1 s”) or one reading per line. Many teachers accept observations written this way; if yours wants a ruled table, leave space with a few empty lines and draw it in pen after printing.",
          ),
        ],
      },
    ],
  },
  {
    slug: "handwritten-letter-or-card",
    title: "How to write a handwritten letter or card online",
    description: "Write a thank-you note, a birthday card or a letter in a handwriting you like, then print it or send it as an image.",
    minutes: 3,
    updated: UPDATED,
    related: ["download-print-and-share", "getting-started"],
    cta: { href: "/use/letters", label: "Write a letter" },
    sections: [
      {
        heading: "Write your letter",
        blocks: [
          steps(
            "Open the letter editor from the button at the end of this guide.",
            "Type your message. Keep it short for a card: three or four lines look best.",
            "Pick a hand. For something warm, try Lily or June; the flowing cursive and elegant scripts are part of Pro.",
            "Choose Plain paper for a letter. Pro adds card stock, kraft paper and envelopes.",
            "Make the writing a little bigger with Size, so it fills the page like a real note.",
            "Download as PDF to print, or PNG to send as an image.",
          ),
        ],
      },
      {
        heading: "Printing a card",
        blocks: [
          list(
            "Print on thick paper or card if your printer takes it. It makes a big difference.",
            "In the print window, choose Actual size, not Fit to page, so the writing stays the right size.",
            "Sign it with a real pen. A real signature on a written-out card is the finishing touch.",
          ),
        ],
      },
      {
        heading: "Sending as an image",
        blocks: [
          p(
            "A PNG of a handwritten note on WhatsApp, Instagram or email feels much more personal than typed text. With Pro you can also download just the ink, on a transparent background, to put over a photo.",
          ),
        ],
      },
      {
        heading: "Many letters at once",
        blocks: [
          p(
            "Thank-you notes for a whole class, invitations, or letters for customers? Batch letters (Pro) takes a spreadsheet of names and writes one letter for each person, each written a little differently.",
          ),
        ],
      },
    ],
  },
  {
    slug: "use-truehand-on-your-phone",
    title: "How to use Truehand on your phone",
    description: "Everything works on a phone: write in the Text tab, adjust in Style & page, and save the PDF to your phone or share it on WhatsApp.",
    minutes: 2,
    updated: UPDATED,
    related: ["getting-started", "download-print-and-share"],
    cta: { href: "/", label: "Open the editor" },
    sections: [
      {
        heading: "Writing on a phone",
        blocks: [
          steps(
            "Open Truehand in Chrome or Safari. There is no app to install.",
            "The Text tab is where you type or paste. Hand, paper and pen are right under the toolbar.",
            "Scroll down to see the preview. Tap the expand icon to zoom in on the writing.",
            "The Style & page tab has size, messiness, name and date, page numbers and paper size.",
            "Tap Download at the bottom of the screen when you're happy.",
          ),
        ],
      },
      {
        heading: "Where the file goes",
        blocks: [
          list(
            "Android: the PDF or image goes to Downloads. Open it from the notification, or from the Files app.",
            "iPhone: Safari asks where to save it. Choose Save to Files, or open it and use the share button to send it straight to WhatsApp or Mail.",
            "PNG images can be saved to your photo gallery from the share menu.",
          ),
        ],
      },
      {
        heading: "Tips",
        blocks: [
          list(
            "Add Truehand to your home screen from the browser menu to open it in one tap.",
            "Your text is kept in the browser on that phone, so you can close the tab and continue later.",
            "Copying a long assignment from WhatsApp or Docs? Paste it all at once, then fix the headings.",
          ),
        ],
      },
    ],
  },
  {
    slug: "download-print-and-share",
    title: "Download, print and share your handwritten pages",
    description: "Which format to choose, how to print so the writing stays the right size, and how to share pages on WhatsApp, email or social media.",
    minutes: 3,
    updated: UPDATED,
    related: ["getting-started", "write-assignment-online"],
    cta: { href: "/", label: "Open the editor" },
    sections: [
      {
        heading: "Which format",
        blocks: [
          list(
            "PDF: one file with every page. Best for printing, submitting and emailing.",
            "PNG: an image of each page. Best for WhatsApp, Instagram and phone galleries.",
            "ZIP: all the PNG images in one file, handy for many pages.",
          ),
          p(
            "Screen quality (150 dpi) is sharp on phones and fine for most printing. Print quality (300 dpi, Pro) is crisper on paper, and worth it for letters and cards.",
          ),
        ],
      },
      {
        heading: "Printing",
        blocks: [
          steps(
            "Open the PDF and choose Print.",
            "Pick the same paper size you chose in Truehand (A4 in most countries, Letter in the US).",
            "Set scale to Actual size or 100%, not Fit to page.",
            "Print in colour if you can: blue ink and faint ruled lines look much more real than grey.",
          ),
        ],
      },
      {
        heading: "Sharing",
        blocks: [
          list(
            "WhatsApp: send the PDF as a document so it isn't compressed, or send the PNG as a photo.",
            "Email: attach the PDF.",
            "Instagram or stories: use the PNG. It is the shape of a full page, so crop it to the lines you want.",
          ),
        ],
      },
      {
        heading: "Download limits",
        blocks: [
          p(
            "On the free plan, each download includes up to 3 pages, and you can download 10 pages a day. The daily count resets within 24 hours. Pro removes both limits, the ads and the waiting, and a page pack adds extra pages without a plan.",
          ),
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
