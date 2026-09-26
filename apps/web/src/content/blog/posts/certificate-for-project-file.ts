import { list, note, PUBLISHED, sample } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "certificate-for-project-file",
  category: "project-files",
  title: "Certificate for a project file: samples for school and college",
  seoTitle: "Certificate for Project File: Samples to Copy",
  description: "Ready-to-copy certificate pages for school and college project files and practical files, with where each person signs. Free to use.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "The certificate page states that you did the project yourself under your teacher's guidance. It comes right after the cover page, and your teacher signs it, sometimes with the principal and an external examiner. Copy a sample, fill in the blanks, and leave the signature lines empty.",
  sections: [
    {
      heading: "What a certificate page includes",
      blocks: [
        list(
          "The heading “Certificate”.",
          "Your name, class and section, and roll number.",
          "The project title and subject.",
          "The academic session, like 2026–27.",
          "Your teacher's name, and lines for the signatures.",
        ),
        note("Never sign the certificate yourself. The signature lines are for your teacher, the principal and, for board practicals, the examiners."),
      ],
    },
    {
      heading: "Sample 1: school project",
      blocks: [
        sample("school", "School project", [
          "# Certificate",
          "This is to certify that [Your name], a student of Class [Class and section], Roll No. [Roll number], has successfully completed the project titled “[Project title]” in [Subject] under my guidance during the academic session [2026–27].",
          "The project is the student's own work and has been completed to my satisfaction.",
          "",
          "Teacher's signature: ____________",
          "[Teacher's name]",
          "",
          "Principal's signature: ____________",
        ]),
      ],
    },
    {
      heading: "Sample 2: CBSE board practical file",
      blocks: [
        sample("cbse-practical", "CBSE board practical file", [
          "# Certificate",
          "This is to certify that [Your name], Roll No. [Board roll number], a student of Class XII, has satisfactorily completed the practical work in [Subject] as prescribed by the Central Board of Secondary Education for the session [2026–27].",
          "",
          "Internal examiner: ____________",
          "External examiner: ____________",
          "Principal: ____________",
        ]),
      ],
    },
    {
      heading: "Sample 3: science practical file",
      blocks: [
        sample("practical", "Science practical file", [
          "# Certificate",
          "This is to certify that [Your name] of Class [Class and section] has carried out the experiments recorded in this practical file in the [Physics / Chemistry / Biology] laboratory of [School name] during the session [2026–27].",
          "",
          "Subject teacher: ____________",
          "Date: ____________",
        ]),
      ],
    },
    {
      heading: "Sample 4: college project report",
      blocks: [
        sample("college", "College project report", [
          "# Certificate",
          "This is to certify that the project report titled “[Project title]”, submitted by [Your name], Roll No. [Roll number], in partial fulfilment of the requirements for the degree of [Course] at [College name], is a record of original work carried out under my supervision during [Year].",
          "",
          "Project guide: ____________",
          "[Guide's name], [Designation]",
          "",
          "Head of Department: ____________",
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "Who signs the certificate in a project file?",
      a: "Your subject teacher or project guide. For board practical files, the internal and external examiners and the principal sign too. You never sign it yourself.",
    },
    { q: "Where does the certificate go?", a: "Right after the cover page, before the acknowledgement and the index." },
    {
      q: "What is the difference between the certificate and the acknowledgement?",
      a: "The certificate is your teacher confirming the work is yours. The acknowledgement is you thanking the people who helped.",
    },
  ],
  related: ["project-file-cover-page", "acknowledgement-for-project-file", "index-for-project-file"],
};

export default post;
