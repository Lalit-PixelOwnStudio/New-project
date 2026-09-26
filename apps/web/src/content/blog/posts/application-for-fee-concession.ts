import { list, PUBLISHED, sample, SIGN_OFF, TO_PRINCIPAL } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "application-for-fee-concession",
  category: "applications",
  title: "Application for a fee concession: samples for school and college",
  seoTitle: "Application for Fee Concession: Samples",
  description:
    "Applications to the principal for a fee concession or waiver: money trouble at home, a parent's job loss, siblings in one school, or paying in parts.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A fee concession application asks your principal to reduce or waive your school fees because your family is going through a difficult time. Be honest and specific about the reason, mention your results or conduct if they're good, and attach any proof the school asks for.",
  sections: [
    {
      heading: "What to include",
      blocks: [
        list(
          "Your name, class and section, roll number, and admission number.",
          "The reason, in a sentence or two: a loss of income, illness in the family, more than one child in the school.",
          "What you're asking for: a full waiver, a part concession, or time to pay in parts.",
          "Anything that supports it, like good marks or a sibling's name and class.",
          "Proof you've attached, such as an income certificate or a letter from a parent's employer.",
        ),
      ],
    },
    {
      heading: "Sample 1: money trouble at home",
      blocks: [
        sample("financial", "Money trouble at home", [
          ...TO_PRINCIPAL,
          "Subject: Application for fee concession",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section], Admission No. [Admission number]. My family's income has fallen sharply this year, and my parents are finding it very difficult to pay my school fees.",
          "I have always worked hard and scored [percentage] in my last exams. I request you to kindly grant me a fee concession so that I can continue my studies here.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: a parent has lost their job",
      blocks: [
        sample("job-loss", "A parent's job loss", [
          ...TO_PRINCIPAL,
          "Subject: Request for fee concession",
          "",
          "Respected Sir/Madam,",
          "I am [Your name] of Class [Class and section]. My father lost his job in [month], and our family has no regular income at present. We are unable to pay the fees for this term.",
          "I request you to waive my fees for this term, or reduce them, until my father finds work. I have attached a letter from his previous employer.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: two children in the same school",
      blocks: [
        sample("siblings", "Two children in one school", [
          ...TO_PRINCIPAL,
          "Subject: Application for sibling fee concession",
          "",
          "Respected Sir/Madam,",
          "My [son / daughter], [Student's name], studies in Class [Class and section], and my [son / daughter], [Sibling's name], studies in Class [Class and section] of your school.",
          "Paying the full fees for both children is difficult for our family. I request you to kindly grant a concession on the fees of one of them.",
          "Thanking you.",
          "Yours faithfully,",
          "[Parent's name]",
          "Phone: [Phone number]",
        ]),
      ],
    },
    {
      heading: "Sample 4: paying the fees in parts",
      blocks: [
        sample("instalments", "Paying in parts", [
          ...TO_PRINCIPAL,
          "Subject: Request to pay fees in instalments",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. Because of unexpected medical expenses at home, my parents cannot pay this term's fees of ₹[amount] at once.",
          "I request you to kindly allow us to pay in [number] monthly instalments, starting from [month].",
          ...SIGN_OFF,
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "What documents should I attach?",
      a: "Whatever your school asks for. Common ones are an income certificate, a salary slip or a letter from a parent's employer, and previous fee receipts.",
    },
    { q: "Who should write the application?", a: "For school students, a parent often writes or signs it. College students usually write it themselves." },
    {
      q: "Is a fee concession the same as a scholarship?",
      a: "Not quite. A concession reduces fees because of need; a scholarship is usually awarded for merit or through a scheme.",
    },
  ],
  related: ["application-for-bonafide-certificate", "application-for-transfer-certificate", "leave-application-for-school"],
};

export default post;
