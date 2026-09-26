import { p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const TO_MANAGER = ["To", "[Manager's name]", "[Designation]", "[Company name], [City]", "", "Date: [DD/MM/YYYY]", ""];
const SIGN_OFF = ["Thank you.", "Yours sincerely,", "[Your name]", "[Designation], Employee ID [ID]"];

const post: BlogPost = {
  slug: "sick-leave-application-for-office",
  category: "applications",
  title: "Sick leave application for office: 5 samples",
  seoTitle: "Sick Leave Application for Office: 5 Samples",
  description:
    "Sick leave application samples for employees: one day off, fever, extending sick leave, medical leave with a certificate, and a short email version.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A sick leave application tells your manager you're unwell, how many days you need, and who can cover urgent work. Keep it short and give exact dates. Most offices accept an email; some want a signed letter for longer leave.",
  sections: [
    {
      heading: "The format",
      blocks: [
        steps(
          "To: your manager's name and designation, and the company.",
          "Date.",
          "Subject: “Sick leave application” with the dates.",
          "Dear [Manager's name], or Respected Sir / Madam.",
          "Body: that you're unwell, the dates you'll be away, and who can handle urgent work.",
          "Closing: Thank you. Yours sincerely, your name, designation and employee ID.",
        ),
      ],
    },
    {
      heading: "Sample 1: one day",
      blocks: [
        sample("one-day", "One day of sick leave", [
          ...TO_MANAGER,
          "Subject: Sick leave on [date]",
          "",
          "Dear [Manager's name],",
          "I am unwell today and won't be able to come to the office. I request one day of sick leave for [date].",
          "I'll keep an eye on my phone for anything urgent, and [Colleague's name] has agreed to handle [task] today.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: fever, for a few days",
      blocks: [
        sample("fever", "Fever, for a few days", [
          ...TO_MANAGER,
          "Subject: Sick leave from [date] to [date]",
          "",
          "Dear [Manager's name],",
          "I have had a high fever since [date], and my doctor has advised me to rest for [number] days. I request sick leave from [date] to [date].",
          "I have handed over [task] to [Colleague's name]. I will attach the medical certificate when I rejoin.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: extending sick leave",
      blocks: [
        sample("extension", "Extending sick leave", [
          ...TO_MANAGER,
          "Subject: Extension of sick leave until [date]",
          "",
          "Dear [Manager's name],",
          "I am still recovering from [illness], and my doctor has advised rest for [number] more days. I request you to extend my sick leave until [date]. I expect to rejoin on [date].",
          "I have attached the doctor's note.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 4: medical leave, with a certificate",
      blocks: [
        sample("medical", "Medical leave", [
          ...TO_MANAGER,
          "Subject: Medical leave from [date] to [date]",
          "",
          "Dear [Manager's name],",
          "I have to undergo [procedure / treatment] on [date], and the doctor has advised [number] weeks of rest afterwards. I request medical leave from [date] to [date], and have attached the medical certificate.",
          "I will brief [Colleague's name] on my work before I leave.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 5: a short email",
      blocks: [
        p("For a quick email, the subject line does most of the work:"),
        sample("email", "Short email", [
          "Subject: Sick leave today, [date]",
          "",
          "Hi [Manager's name],",
          "I'm down with a fever and won't be able to work today. I'd like to take a day of sick leave. I'll be reachable on my phone for anything urgent.",
          "Thanks,",
          "[Your name]",
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "Do I need a medical certificate?",
      a: "Many companies ask for one when sick leave is longer than two or three days. Your HR policy or offer letter says exactly when.",
    },
    { q: "Email or letter?", a: "An email is enough in most offices. Some ask for a signed application for longer leave, which you can print." },
    {
      q: "Should I say what illness I have?",
      a: "A general reason, like fever or a medical procedure, is enough. You don't have to share more than you want to.",
    },
  ],
  related: ["resignation-letter", "leave-application-for-college", "formal-letter-format"],
};

export default post;
