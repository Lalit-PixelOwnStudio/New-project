import { list, note, p, PUBLISHED, sample } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "bibliography-for-project-file",
  category: "project-files",
  title: "Bibliography for a project file: format and examples",
  seoTitle: "Bibliography for Project File: Format",
  description:
    "How to write the bibliography page of a school or college project file, with the format for books, textbooks and websites and an example to copy.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "The bibliography is the last page of a project file. It lists the books, textbooks and websites you used, so your teacher can see where your information came from. List the books first, then the websites, each written the same way.",
  sections: [
    {
      heading: "The format",
      blocks: [
        list(
          "A book: author's surname, initials (year). Title of the book. Publisher.",
          "A textbook: NCERT (year). Subject: Textbook for Class X. NCERT.",
          "A website: website name. Title of the page. Web address, and the date you visited it.",
        ),
        note("This simple format is accepted in most schools. If your teacher has given you a format, follow that one instead."),
      ],
    },
    {
      heading: "Sample 1: school project",
      blocks: [
        sample("school", "School project bibliography", [
          "# Bibliography",
          "**Books**",
          "1. [Author's surname], [Initials] ([Year]). [Title of the book]. [Publisher].",
          "2. NCERT ([Year]). [Subject]: Textbook for Class [Class]. NCERT.",
          "3. [Author's surname], [Initials] ([Year]). [Title of the reference book]. [Publisher].",
          "",
          "**Websites**",
          "4. [Website name]. [Title of the page]. [Web address], visited on [date].",
          "5. [Website name]. [Title of the page]. [Web address], visited on [date].",
        ]),
      ],
    },
    {
      heading: "Sample 2: a short bibliography",
      blocks: [
        p("For a small project, many teachers are happy with a simple list:"),
        sample("short", "Short bibliography", [
          "# Bibliography",
          "- NCERT [Subject] textbook for Class [Class]",
          "- [Title of the reference book] by [Author]",
          "- [Website name] ([web address])",
          "- [Website name] ([web address])",
        ]),
      ],
    },
    {
      heading: "Tips",
      blocks: [
        list(
          "Note each source down while you research. Finding them again at the end takes much longer.",
          "List only what you actually used.",
          "If your teacher asks, arrange the books alphabetically by the author's surname.",
          "Information from a website still has to be written in your own words in the project; the bibliography only says where it came from.",
        ),
      ],
    },
  ],
  faqs: [
    { q: "Where does the bibliography go in a project file?", a: "On the last page, after the conclusion." },
    {
      q: "What is the difference between a bibliography and references?",
      a: "References list only the sources you quoted or cited in the text. A bibliography lists everything you read for the project. School projects usually ask for a bibliography.",
    },
    {
      q: "Can I list Wikipedia?",
      a: "You can list any website you used. It's better, though, to check facts in your textbook or on a reliable site, and to list those.",
    },
  ],
  related: ["index-for-project-file", "project-file-cover-page", "acknowledgement-for-project-file"],
};

export default post;
