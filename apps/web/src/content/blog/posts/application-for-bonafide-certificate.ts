import { list, PUBLISHED, sample, SIGN_OFF, TO_PRINCIPAL } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "application-for-bonafide-certificate",
  category: "applications",
  title: "Application for a bonafide certificate: samples",
  seoTitle: "Application for Bonafide Certificate",
  description:
    "Sample applications for a bonafide certificate from your school or college, for a scholarship, bank account, passport or bus pass, and what to include.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A bonafide certificate is a letter from your school or college confirming that you study there. You need one for scholarships, opening a bank account, a passport, or a student bus or railway pass. You get it by writing a short application to the principal saying why you need it.",
  sections: [
    {
      heading: "What to include",
      blocks: [
        list(
          "Your name, class or course, roll number and admission number.",
          "Why you need the certificate: a scholarship, bank account, passport, pass or competition.",
          "Any detail the certificate must show, like your date of birth or the academic session.",
          "By when you need it, if there's a deadline.",
        ),
      ],
    },
    {
      heading: "Sample 1: for a scholarship",
      blocks: [
        sample("scholarship", "For a scholarship", [
          ...TO_PRINCIPAL,
          "Subject: Application for bonafide certificate",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section], Admission No. [Admission number]. I am applying for the [scholarship name], which requires a bonafide certificate from my school.",
          "Kindly issue me a bonafide certificate for the session [2026–27]. The last date for the application is [date].",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: to open a bank account",
      blocks: [
        sample("bank", "To open a bank account", [
          ...TO_PRINCIPAL,
          "Subject: Request for bonafide certificate for a bank account",
          "",
          "Respected Sir/Madam,",
          "I am [Your name] of Class [Class and section]. I want to open a savings account at [Bank name], and the bank has asked for a bonafide certificate from my school.",
          "Kindly issue me a bonafide certificate mentioning my date of birth, [DD/MM/YYYY].",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: for a passport",
      blocks: [
        sample("passport", "For a passport", [
          ...TO_PRINCIPAL,
          "Subject: Application for bonafide certificate for a passport",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. I am applying for a passport, and a bonafide certificate from my school is needed as proof of address and study.",
          "Kindly issue me the certificate with my date of birth and residential address.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 4: for a bus or railway pass",
      blocks: [
        sample("pass", "For a bus or railway pass", [
          ...TO_PRINCIPAL,
          "Subject: Request for bonafide certificate for a student pass",
          "",
          "Respected Sir/Madam,",
          "I am [Your name] of Class [Class and section]. I travel to school from [place] every day and want to apply for a student [bus / railway] concession pass, which requires a bonafide certificate.",
          "Kindly issue me the certificate at the earliest.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 5: from a college",
      blocks: [
        sample("college", "From a college", [
          "To",
          "The Principal",
          "[College name], [City]",
          "",
          "Date: [DD/MM/YYYY]",
          "",
          "Subject: Application for bonafide certificate",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of [Course], [Year / Semester], Roll No. [Roll number]. I need a bonafide certificate to apply for [purpose].",
          "Kindly issue the certificate at the earliest.",
          "Thanking you.",
          "Yours sincerely,",
          "[Your name]",
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "How long does it take to get a bonafide certificate?",
      a: "Usually one to a few working days. Apply early if you have a deadline, and mention it in the application.",
    },
    {
      q: "Is a bonafide certificate the same as a character certificate?",
      a: "No. A bonafide certificate confirms you study there. A character certificate describes your conduct, and is usually given when you leave.",
    },
    { q: "Is there a fee?", a: "Some schools and colleges charge a small fee. The office will tell you when you submit the application." },
  ],
  related: ["application-for-fee-concession", "application-for-transfer-certificate", "leave-application-for-college"],
};

export default post;
