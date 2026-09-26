import { list, note, p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "index-for-project-file",
  category: "project-files",
  title: "Index for a project file: format and example",
  seoTitle: "Index for Project File: Format and Example",
  description: "How to write the index page of a school project or practical file, the right order of pages, and a ready-to-copy example.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 3,
  intro:
    "The index lists what's in your project file and on which page. It comes after the acknowledgement. Number your pages first and write the index last, so every page number is right.",
  sections: [
    {
      heading: "The order of pages",
      blocks: [
        steps(
          "Cover page",
          "Certificate",
          "Acknowledgement",
          "Index",
          "Introduction",
          "Main content, or the experiments in a practical file",
          "Conclusion",
          "Bibliography",
        ),
        p("The pages before the index usually aren't numbered. Start at 1 with the introduction."),
      ],
    },
    {
      heading: "What each line of the index shows",
      blocks: [
        list(
          "A serial number.",
          "The topic or experiment, the same as its heading in the file.",
          "The page number it starts on.",
          "In a practical file, also the date and a space for the teacher's signature.",
        ),
        note(
          "Truehand writes on ruled lines but doesn't draw table columns. For a ruled table, draw the columns with a ruler after printing, or use the list layout below, which needs no table.",
        ),
      ],
    },
    {
      heading: "Sample: project file index",
      blocks: [
        sample("project", "Project file index", [
          "# Index",
          "1. Introduction ........................ 1",
          "2. Objectives ........................ 2",
          "3. [Topic 1] ........................ 3",
          "4. [Topic 2] ........................ 6",
          "5. [Topic 3] ........................ 9",
          "6. Findings ........................ 12",
          "7. Conclusion ........................ 14",
          "8. Bibliography ........................ 15",
        ]),
      ],
    },
    {
      heading: "Sample: practical file index",
      blocks: [
        sample("practical", "Practical file index", [
          "# Index",
          "1. [Aim of experiment 1]: page 1, date __/__/____, sign ______",
          "2. [Aim of experiment 2]: page 4, date __/__/____, sign ______",
          "3. [Aim of experiment 3]: page 7, date __/__/____, sign ______",
          "4. [Aim of experiment 4]: page 10, date __/__/____, sign ______",
          "5. [Aim of experiment 5]: page 13, date __/__/____, sign ______",
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "Should the certificate and acknowledgement be in the index?",
      a: "Usually not. The index starts from the first numbered page, the introduction. Ask your teacher if your school does it differently.",
    },
    { q: "When should I write the index?", a: "Last. Finish the file and number the pages first, then the page numbers in the index will be right." },
  ],
  related: ["acknowledgement-for-project-file", "bibliography-for-project-file", "certificate-for-project-file"],
};

export default post;
