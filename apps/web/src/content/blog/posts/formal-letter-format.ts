import { note, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "formal-letter-format",
  title: "Formal letter format, with examples",
  seoTitle: "Formal Letter Format with Examples",
  description:
    "The formal letter format taught in school, part by part, with three full examples: a letter to the editor, a complaint letter and a letter of enquiry.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 6,
  intro:
    "A formal letter follows a fixed order: your address, the date, the receiver's address, the subject, the salutation, the body, and the closing. Most school boards, including CBSE, use this block format with every part starting at the left margin. The examples below follow it exactly.",
  sections: [
    {
      heading: "The parts of a formal letter",
      blocks: [
        steps(
          "Sender's address. In exams, use “Examination Hall” or the address given in the question.",
          "Date, written in full, like 26 September 2026.",
          "Receiver's address: their designation, organisation and city.",
          "Subject: one line that says what the letter is about.",
          "Salutation: Sir / Madam, or Respected Sir / Madam.",
          "Body: an opening paragraph that says why you're writing, one or two paragraphs of detail, and a closing paragraph with what you'd like done.",
          "Complimentary close: Yours faithfully (or Yours sincerely), then your name.",
        ),
        note("CBSE letters are usually 120 to 150 words. Marks go to format, content and language, so every part above matters."),
      ],
    },
    {
      heading: "Example 1: letter to the editor",
      blocks: [
        sample("editor", "Letter to the editor", [
          "Examination Hall",
          "[City]",
          "",
          "26 September 2026",
          "",
          "The Editor",
          "[Newspaper name]",
          "[City]",
          "",
          "Subject: Traffic jams near schools during rush hours",
          "",
          "Sir,",
          "Through the columns of your esteemed newspaper, I wish to draw the attention of the authorities to the traffic jams outside schools in our area every morning and afternoon.",
          "Cars are parked on both sides of the road, buses stop in the middle of it, and there is no traffic police to manage the rush. Students have to walk between moving vehicles, which is dangerous, and many reach school late.",
          "I request the traffic police to post a constable near schools during these hours and to mark a separate area for school buses. Parents should also be asked not to park on the road.",
          "Yours faithfully,",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Example 2: complaint letter",
      blocks: [
        sample("complaint", "Complaint letter", [
          "[House number, Street]",
          "[Area, City]",
          "",
          "26 September 2026",
          "",
          "The Commissioner",
          "Municipal Corporation",
          "[City]",
          "",
          "Subject: Garbage not collected in [Area name]",
          "",
          "Sir,",
          "I am writing to complain that garbage has not been collected from [Area name] for the last two weeks.",
          "Heaps of waste have piled up at the street corners. The smell is unbearable, stray animals scatter the garbage, and mosquitoes are breeding, which puts residents at risk of dengue and malaria.",
          "I request you to arrange for the garbage to be cleared at once and to make sure it is collected regularly in future.",
          "Yours faithfully,",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Example 3: letter of enquiry",
      blocks: [
        sample("enquiry", "Letter of enquiry", [
          "Examination Hall",
          "[City]",
          "",
          "26 September 2026",
          "",
          "The Director",
          "[Institute name]",
          "[City]",
          "",
          "Subject: Enquiry about the summer coding course",
          "",
          "Sir/Madam,",
          "I read your advertisement in [newspaper] about the summer coding course for school students and would like to know more about it.",
          "Kindly send me details of the course duration, class timings, fees, and whether any prior knowledge is needed. I would also like to know if a certificate is given at the end.",
          "I look forward to your reply.",
          "Yours faithfully,",
          "[Your name]",
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "Yours faithfully or yours sincerely?",
      a: "Use “Yours faithfully” when you start with “Sir” or “Madam” and don't know the person by name. Use “Yours sincerely” when you address them by name.",
    },
    { q: "Where does the date go in a formal letter?", a: "Below your address, before the receiver's address, in the block format used by CBSE." },
    { q: "Is the subject line necessary?", a: "Yes. In school exams, missing the subject line costs a format mark." },
  ],
  related: ["informal-letter-format", "notice-writing-format", "leave-application-for-school"],
};

export default post;
