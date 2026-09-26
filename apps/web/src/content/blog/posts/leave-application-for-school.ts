import { p, PUBLISHED, sample, SIGN_OFF, steps, TO_PRINCIPAL } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "leave-application-for-school",
  category: "applications",
  title: "Leave application for school: 7 samples for students",
  seoTitle: "Leave Application for School: 7 Samples",
  description:
    "Seven leave application samples for school students: sick leave, fever, family function, urgent work, out of station, half day and a parent's letter.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 5,
  intro:
    "A leave application is a short, polite letter to your principal or class teacher asking for leave and giving the reason. Write it before the leave if you can, or on the day you return. Pick the sample that fits, change the details, and write it out or let Truehand write it for you.",
  sections: [
    {
      heading: "The format",
      blocks: [
        steps(
          "To, The Principal (or Class Teacher), the school's name and city.",
          "The date.",
          "Subject: one line saying what you want, like “Application for sick leave”.",
          "Salutation: Respected Sir / Respected Madam.",
          "The body: who you are, why you need leave, the exact dates, and a polite request.",
          "Closing: Thanking you. Yours obediently, your name, class, section and roll number.",
        ),
        p("Keep it short: three or four sentences in the body are enough. Always give exact dates."),
      ],
    },
    {
      heading: "Sample 1: sick leave (fever)",
      blocks: [
        sample("sick-leave", "Sick leave (fever)", [
          ...TO_PRINCIPAL,
          "Subject: Application for sick leave",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. I have had a high fever since last night, and the doctor has advised me to rest for [number] days. So I will not be able to attend school from [date] to [date].",
          "Kindly grant me leave for these days. I will complete the work I miss.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: leave for a family function",
      blocks: [
        sample("family-function", "Leave for a family function", [
          ...TO_PRINCIPAL,
          "Subject: Application for leave to attend my [relation]'s wedding",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. My [relation]'s wedding is on [date], and my family and I will be attending it in [place]. So I will not be able to come to school from [date] to [date].",
          "Kindly grant me leave for these [number] days. I will make up for the classes I miss.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: leave for urgent work at home",
      blocks: [
        sample("urgent-work", "Leave for urgent work", [
          ...TO_PRINCIPAL,
          "Subject: Application for leave due to urgent work",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. Due to some urgent work at home, I will not be able to attend school today, [date].",
          "Kindly grant me leave for one day.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 4: going out of station",
      blocks: [
        sample("out-of-station", "Going out of station", [
          ...TO_PRINCIPAL,
          "Subject: Application for leave to go out of station",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. My family has to travel to [place] because of [reason], and we will be away from [date] to [date]. So I will not be able to attend school on these days.",
          "Kindly grant me leave for this period. I will complete my homework and notes after I return.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 5: half-day leave",
      blocks: [
        sample("half-day", "Half-day leave", [
          "To",
          "The Class Teacher",
          "Class [Class and section]",
          "[School name]",
          "",
          "Date: [DD/MM/YYYY]",
          "",
          "Subject: Application for half-day leave",
          "",
          "Respected Sir/Madam,",
          "I have a dentist's appointment at [time] today, so I need to leave school after the [number] period. My [father / mother] will come to pick me up.",
          "Kindly allow me to leave early today.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 6: leave application written by a parent",
      blocks: [
        sample("by-parent", "Written by a parent", [
          ...TO_PRINCIPAL,
          "Subject: Leave application for my [son / daughter]",
          "",
          "Respected Sir/Madam,",
          "My [son / daughter], [Student's name], studies in Class [Class and section] of your school. [He / She] has been unwell with [illness] and has been advised rest by the doctor, so [he / she] will not be able to attend school from [date] to [date].",
          "Kindly grant [him / her] leave for these days.",
          "Thanking you.",
          "Yours sincerely,",
          "[Parent's name]",
          "Phone: [Phone number]",
        ]),
      ],
    },
    {
      heading: "Sample 7: application after being absent",
      blocks: [
        sample("after-absence", "After being absent", [
          ...TO_PRINCIPAL,
          "Subject: Application for leave for the days I was absent",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of Class [Class and section]. I could not attend school from [date] to [date] because I was suffering from [illness]. I have attached my medical certificate.",
          "Kindly grant me leave for these days. I have already started completing the work I missed.",
          ...SIGN_OFF,
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "Who should I address a leave application to?",
      a: "The principal for one day or more, or your class teacher if your school allows it for a short leave. Use “The Principal” unless you've been told otherwise.",
    },
    {
      q: "Should I write “Yours obediently” or “Yours faithfully”?",
      a: "Students usually write “Yours obediently” to the principal. A parent writes “Yours sincerely” or “Yours faithfully”.",
    },
    {
      q: "Do I need a medical certificate?",
      a: "For sick leave of more than two or three days, most schools ask for one. Mention it in the letter and attach it.",
    },
  ],
  related: ["leave-application-for-college", "apology-letter-to-teacher", "application-for-transfer-certificate"],
};

export default post;
