import { note, p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "notice-writing-format",
  title: "Notice writing format, with examples",
  seoTitle: "Notice Writing Format with Examples",
  description: "The notice writing format used in school exams, part by part, with three examples: a school trip, a lost and found notice and a competition.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A notice is a short, formal announcement put up for a group of people, like students of a school. In CBSE exams it is written inside a box, in about 50 words, with the institution's name, the word NOTICE, the date, a heading, the details, and the writer's name and designation.",
  sections: [
    {
      heading: "The format",
      blocks: [
        steps(
          "Name of the school or organisation.",
          "NOTICE, in capital letters.",
          "Date.",
          "Heading: what the notice is about.",
          "Body: what, when, where, who can take part, and whom to contact. Around 50 words.",
          "Name and designation of the person issuing it, like Secretary, Literary Club.",
        ),
        note("Draw a box around the whole notice. If you print it from Truehand, draw the box with a ruler afterwards."),
      ],
    },
    {
      heading: "Example 1: school trip",
      blocks: [
        sample("trip", "School trip", [
          "# [School name], [City]",
          "## NOTICE",
          "26 September 2026",
          "**Educational trip to the Science Centre**",
          "The school is organising a one-day trip to the Regional Science Centre for students of Classes VIII to X on 10 October 2026. Buses will leave at 8 a.m. and return by 3 p.m. The cost is ₹300. Interested students should give their names to the undersigned by 3 October.",
          "[Your name]",
          "Secretary, Science Club",
        ]),
      ],
    },
    {
      heading: "Example 2: lost and found",
      blocks: [
        sample("lost", "Lost and found", [
          "# [School name], [City]",
          "## NOTICE",
          "26 September 2026",
          "**Lost: blue water bottle**",
          "A blue steel water bottle with the name “[Name]” written on it was lost in the playground during the games period on 24 September. Anyone who has found it is requested to hand it over to the undersigned or to the school office.",
          "[Your name]",
          "Class [Class and section]",
        ]),
      ],
    },
    {
      heading: "Example 3: inter-house competition",
      blocks: [
        sample("competition", "Inter-house competition", [
          "# [School name], [City]",
          "## NOTICE",
          "26 September 2026",
          "**Inter-house poetry recitation**",
          "An inter-house poetry recitation competition will be held in the school auditorium on 8 October 2026 at 11 a.m. Each house may send two participants from Classes VI to VIII. Poems may be in Hindi or English, up to three minutes long. Give your names to your house captains by 1 October.",
          "[Your name]",
          "Cultural Secretary",
        ]),
      ],
    },
  ],
  faqs: [
    { q: "What is the word limit for a notice?", a: "About 50 words for the body in CBSE Class 10 and 12 exams. Stick close to it." },
    { q: "Is the box necessary?", a: "Yes, in school exams the notice is written inside a box. The heading and date go inside it too." },
  ],
  related: ["formal-letter-format", "informal-letter-format", "text-to-handwriting-converter"],
};

export default post;
