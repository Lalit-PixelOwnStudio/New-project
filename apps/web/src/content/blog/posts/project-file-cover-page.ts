import { list, note, p, PUBLISHED, sample } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "project-file-cover-page",
  category: "project-files",
  title: "Cover page for a project file: format and samples",
  seoTitle: "Project File Cover Page: Format and Samples",
  description:
    "What to write on the cover (front) page of a school or college project file, with ready-to-copy samples for school projects, practical files and reports.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "The cover page is the first page of your project file. It shows the project topic in the biggest letters, your school's name, the subject and session, and who submitted it to whom. Copy a sample below, fill in your details, and write it out or let Truehand write it for you.",
  sections: [
    {
      heading: "What goes on a cover page",
      blocks: [
        list(
          "Your school or college name, with space at the top for its logo if you'll paste one.",
          "The project topic, larger than anything else on the page.",
          "The subject and the academic session, like 2026–27.",
          "Submitted by: your name, class and section, and roll number.",
          "Submitted to: your teacher's name and subject.",
        ),
        p("The cover page isn't numbered. Page 1 starts with the introduction, after the certificate, acknowledgement and index."),
      ],
    },
    {
      heading: "Sample 1: school project",
      blocks: [
        sample(
          "school",
          "School project",
          [
            "# [School name], [City]",
            "",
            "# Project on [Project topic]",
            "",
            "Subject: [Subject]",
            "Session: [2026–27]",
            "",
            "**Submitted by:**",
            "[Your name]",
            "Class [Class and section], Roll No. [Roll number]",
            "",
            "**Submitted to:**",
            "[Teacher's name]",
            "[Subject] teacher",
          ],
          { paperId: "plain", fontSize: 1.15 },
        ),
      ],
    },
    {
      heading: "Sample 2: practical file",
      blocks: [
        sample(
          "practical",
          "Practical file",
          [
            "# [School name], [City]",
            "",
            "# [Physics / Chemistry / Biology] Practical File",
            "Session [2026–27]",
            "",
            "**Submitted by:**",
            "[Your name]",
            "Class [Class and section], Roll No. [Roll number]",
            "",
            "**Submitted to:**",
            "[Teacher's name]",
          ],
          { paperId: "plain", fontSize: 1.15 },
        ),
      ],
    },
    {
      heading: "Sample 3: college project report",
      blocks: [
        sample(
          "college",
          "College project report",
          [
            "# [Project title]",
            "A project report submitted in partial fulfilment of the requirements for the degree of [Course]",
            "",
            "**Submitted by:**",
            "[Your name], Roll No. [Roll number]",
            "[Course], [Year / Semester]",
            "",
            "**Under the guidance of:**",
            "[Guide's name], [Designation]",
            "",
            "Department of [Department]",
            "[College name], [City]",
            "[Year]",
          ],
          { paperId: "plain", fontSize: 1.1 },
        ),
      ],
    },
    {
      heading: "Tips for a neat cover page",
      blocks: [
        list(
          "Keep it short. The topic, the names and the session are all a cover needs.",
          "Leave plenty of space between the parts so the page doesn't look crowded.",
          "Use plain paper, or the paper the rest of your file is written on.",
          "Spell your teacher's name and the topic exactly as they appear everywhere else in the file.",
        ),
        note("In Truehand, start a line with # to make it a larger, underlined heading: that's how the topic stands out in the samples above."),
      ],
    },
  ],
  faqs: [
    { q: "What is the first page of a project file called?", a: "The cover page, also called the front page or title page. It comes before the certificate." },
    { q: "Does the cover page have a page number?", a: "No. Numbering usually starts at 1 with the introduction, after the pages that come before the index." },
    {
      q: "Should the cover page be handwritten?",
      a: "Check what your teacher asks for. Many schools accept a printed cover. If it must look handwritten, Truehand writes it on plain paper for you to print.",
    },
  ],
  related: ["certificate-for-project-file", "acknowledgement-for-project-file", "bibliography-for-project-file"],
};

export default post;
