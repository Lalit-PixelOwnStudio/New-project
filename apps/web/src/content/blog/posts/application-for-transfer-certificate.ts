import { list, PUBLISHED, sample, SIGN_OFF, TO_PRINCIPAL } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "application-for-transfer-certificate",
  title: "Application for a transfer certificate (TC): samples to copy",
  seoTitle: "Application for Transfer Certificate (TC)",
  description:
    "Sample applications to the principal for a transfer certificate (TC): a parent's job transfer, moving city, changing school, or written by a parent.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A transfer certificate (TC), also called a school leaving certificate, is what your new school asks for when you change schools. You get it by writing a short application to your principal with the reason. Copy the sample that matches your situation and change the details.",
  sections: [
    {
      heading: "What to include",
      blocks: [
        list(
          "Your name, class and section, roll number, and admission number if you know it.",
          "The reason you're leaving: a transfer, moving city, or changing school.",
          "When you're leaving.",
          "A line saying your fees and library books are cleared, if they are.",
          "A request to issue the TC and any other documents, like a character certificate.",
        ),
      ],
    },
    {
      heading: "Sample 1: parent's job transfer",
      blocks: [
        sample("transfer", "Parent's job transfer", [
          ...TO_PRINCIPAL,
          "Subject: Application for transfer certificate",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section], Admission No. [Admission number]. My father has been transferred to [City], and our family is moving there on [date]. So I will have to leave this school.",
          "I have cleared all my fees and returned my library books. Kindly issue my transfer certificate at the earliest so that I can take admission in a new school.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: moving to another city",
      blocks: [
        sample("moving", "Moving to another city", [
          ...TO_PRINCIPAL,
          "Subject: Application for transfer certificate",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. My family is shifting to [City] for personal reasons, so I will not be able to continue my studies here after [date].",
          "Kindly issue my transfer certificate and character certificate. All my dues have been cleared.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: changing school or stream",
      blocks: [
        sample("changing-school", "Changing school or stream", [
          ...TO_PRINCIPAL,
          "Subject: Application for transfer certificate",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. I have taken admission in [New school's name] for Class [Class] in the [Science / Commerce / Humanities] stream, which is not offered here.",
          "Kindly issue my transfer certificate so that I can complete my admission. I have cleared all my dues.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 4: written by a parent",
      blocks: [
        sample("by-parent", "Written by a parent", [
          ...TO_PRINCIPAL,
          "Subject: Request for transfer certificate",
          "",
          "Respected Sir/Madam,",
          "My [son / daughter], [Student's name], is a student of Class [Class and section], Admission No. [Admission number]. As our family is moving to [City] on [date], [he / she] will be leaving this school.",
          "I request you to kindly issue [his / her] transfer certificate. All fees have been paid.",
          "Thanking you.",
          "Yours faithfully,",
          "[Parent's name]",
          "Phone: [Phone number]",
        ]),
      ],
    },
  ],
  faqs: [
    { q: "Who can write a TC application?", a: "The student or a parent. Many schools prefer the parent to sign it, especially for younger students." },
    {
      q: "How long does a school take to issue a TC?",
      a: "Usually a few working days once all dues are cleared. Apply as early as you can, since the new school will need it for admission.",
    },
    { q: "Is a TC the same as a school leaving certificate?", a: "Yes. Different schools and states use either name for the same document." },
  ],
  related: ["leave-application-for-school", "formal-letter-format", "text-to-handwriting-converter"],
};

export default post;
