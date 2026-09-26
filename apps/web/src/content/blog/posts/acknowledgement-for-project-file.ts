import { list, p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "acknowledgement-for-project-file",
  title: "Acknowledgement for a project file: 6 samples you can copy",
  seoTitle: "Acknowledgement for Project File: 6 Samples",
  description:
    "Six ready-to-copy acknowledgements for school and college project files: CBSE, science practical, computer, group and college projects. Free to use.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 5,
  intro:
    "An acknowledgement is the page where you thank the people who helped with your project: your teacher, the principal, your parents and friends. It comes right after the certificate page. Copy a sample below, change the names, and write it out, or let Truehand write it in handwriting for you.",
  sections: [
    {
      heading: "Where the acknowledgement goes",
      blocks: [
        p("Most schools expect the pages of a project file in this order:"),
        steps("Cover page", "Certificate", "Acknowledgement", "Index", "The project itself: introduction, main content, conclusion", "Bibliography"),
        p(
          "Keep the acknowledgement to one page, about 100 to 200 words, and write it in the first person: “I would like to thank…”. In a group project, use “we”.",
        ),
      ],
    },
    {
      heading: "Who to thank",
      blocks: [
        list(
          "Your subject teacher or project guide, by name (Mrs., Mr., Ms. or Dr.).",
          "The principal, for the opportunity and the facilities.",
          "The lab assistant or librarian, if they helped.",
          "Your parents, friends and group members.",
          "Books, websites or people you took information from, briefly.",
        ),
      ],
    },
    {
      heading: "Sample 1: school project (CBSE)",
      blocks: [
        sample("school", "School project (CBSE)", [
          "# Acknowledgement",
          "I would like to express my special thanks of gratitude to my teacher, [Teacher's name], who gave me the opportunity to do this project on the topic “[Project topic]”. It helped me do a lot of research, and I learnt many new things.",
          "I would also like to thank our principal, [Principal's name], for providing the facilities needed for this project.",
          "I am grateful to my parents and friends, who helped me a lot in finishing this project within the given time.",
          "",
          "[Your name]",
          "Class [Class and section]",
        ]),
      ],
    },
    {
      heading: "Sample 2: science practical file",
      blocks: [
        sample("practical", "Science practical file", [
          "# Acknowledgement",
          "I am grateful to my [Physics / Chemistry / Biology] teacher, [Teacher's name], for guiding me through every experiment in this practical file and for patiently answering my questions in the laboratory.",
          "I sincerely thank our principal, [Principal's name], for a well-equipped laboratory, and our lab assistant, [Lab assistant's name], for helping us set up the apparatus safely.",
          "Finally, I thank my parents and classmates for their support and encouragement while I completed this file.",
          "",
          "[Your name]",
          "Class [Class and section], Roll No. [Roll number]",
        ]),
      ],
    },
    {
      heading: "Sample 3: computer science project",
      blocks: [
        sample("computer", "Computer science project", [
          "# Acknowledgement",
          "I would like to thank my computer science teacher, [Teacher's name], for guiding me throughout this project, “[Project name]”, and for helping me solve the problems I faced while writing and testing the program.",
          "I am thankful to our principal, [Principal's name], for providing the computer lab and the time we needed to complete this work.",
          "I also thank my parents and friends for their support, and the authors of the books and websites that helped me understand the concepts used in this project.",
          "",
          "[Your name]",
          "Class [Class and section], Roll No. [Roll number]",
        ]),
      ],
    },
    {
      heading: "Sample 4: group project",
      blocks: [
        sample("group", "Group project", [
          "# Acknowledgement",
          "We, the students of Class [Class and section], would like to thank our teacher, [Teacher's name], for guiding us through this project on “[Project topic]” and for the valuable suggestions at every stage.",
          "We are grateful to our principal, [Principal's name], for encouraging us and giving us this opportunity.",
          "We also thank our parents for their constant support, and each member of our group for working together patiently and sharing the work fairly.",
          "",
          "Group members:",
          "- [Name 1]",
          "- [Name 2]",
          "- [Name 3]",
          "- [Name 4]",
        ]),
      ],
    },
    {
      heading: "Sample 5: college project or report",
      blocks: [
        sample("college", "College project or report", [
          "# Acknowledgement",
          "I would like to express my sincere gratitude to my project guide, [Guide's name], [Designation], Department of [Department], for the guidance, encouragement and valuable feedback throughout this project.",
          "I am thankful to [Head of Department's name], Head of the Department of [Department], and to [College name] for providing the resources and facilities needed to complete this work.",
          "I also thank my parents, friends and classmates for their support and motivation.",
          "",
          "[Your name]",
          "[Course and year], Roll No. [Roll number]",
        ]),
      ],
    },
    {
      heading: "Sample 6: a short acknowledgement",
      blocks: [
        sample("short", "Short acknowledgement", [
          "# Acknowledgement",
          "I sincerely thank my teacher, [Teacher's name], for the guidance and support that helped me complete this project, and our principal, [Principal's name], for the opportunity. I am also grateful to my parents and friends for their encouragement.",
          "",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Tips for a good acknowledgement",
      blocks: [
        list(
          "Change a line or two so it sounds like you. Teachers read the same sample many times.",
          "Spell every name exactly right, with the correct title.",
          "Mention the project topic once; it makes the page specific.",
          "Use the same pen and handwriting as the rest of the file, and sign your name at the end.",
        ),
      ],
    },
  ],
  faqs: [
    {
      q: "Where does the acknowledgement go in a project file?",
      a: "After the certificate page and before the index. The cover page comes first, then the certificate, then the acknowledgement.",
    },
    { q: "How long should an acknowledgement be?", a: "One page at most. Around 100 to 200 words, in three or four short paragraphs, is plenty." },
    {
      q: "Does the acknowledgement have to be handwritten?",
      a: "Many schools ask for handwritten project files, so check what your teacher wants. If handwriting is allowed to be printed, Truehand writes it in realistic handwriting on ruled paper for you to print.",
    },
    {
      q: "Should I write “I” or “we”?",
      a: "Use “I” for your own project and “we” for a group project, where you can also list the group members at the end.",
    },
  ],
  related: ["certificate-for-project-file", "index-for-project-file", "how-to-improve-handwriting"],
};

export default post;
