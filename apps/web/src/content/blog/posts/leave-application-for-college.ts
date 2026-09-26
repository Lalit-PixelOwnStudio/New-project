import { p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const TO_HOD = ["To", "The Head of Department", "Department of [Department]", "[College name], [City]", "", "Date: [DD/MM/YYYY]", ""];
const SIGN_OFF = ["Thanking you.", "Yours sincerely,", "[Your name]", "[Course], [Year / Semester], Roll No. [Roll number]"];

const post: BlogPost = {
  slug: "leave-application-for-college",
  category: "applications",
  title: "Leave application for college: 5 samples",
  seoTitle: "Leave Application for College: 5 Samples",
  description:
    "Leave application samples for college students: sick leave, a family function, medical leave, an event, and urgent work, to the principal or HOD.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A college leave application goes to your Head of Department (HOD) or the principal. It gives your course, semester and roll number, the reason for leave, and the exact dates. Pick the sample that fits and change the details.",
  sections: [
    {
      heading: "The format",
      blocks: [
        steps(
          "To: the Head of Department (or the Principal), the department, and the college's name and city.",
          "Date.",
          "Subject: one line, like “Application for sick leave”.",
          "Respected Sir / Madam.",
          "Body: your name, course, semester and roll number; the reason; the dates; a request for leave.",
          "Closing: Thanking you. Yours sincerely, your name, course, semester and roll number.",
        ),
        p("Address it to your HOD for a day or two away from classes, or to the principal if your college asks for that."),
      ],
    },
    {
      heading: "Sample 1: sick leave",
      blocks: [
        sample("sick-leave", "Sick leave", [
          ...TO_HOD,
          "Subject: Application for sick leave",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of [Course], [Year / Semester]. I have been suffering from a viral fever since [date], and the doctor has advised me to rest for [number] days. So I will not be able to attend classes from [date] to [date].",
          "Kindly grant me leave for these days. I will cover the syllabus I miss from my classmates' notes.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: a family function",
      blocks: [
        sample("family-function", "A family function", [
          ...TO_HOD,
          "Subject: Application for leave to attend a family wedding",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of [Course], [Year / Semester]. My [relation]'s wedding is on [date] in [place], and I have to travel with my family to attend it. So I will not be able to attend college from [date] to [date].",
          "Kindly grant me leave for these [number] days.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: medical leave, with a certificate",
      blocks: [
        sample("medical", "Medical leave", [
          ...TO_HOD,
          "Subject: Application for medical leave",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of [Course], [Year / Semester]. I was admitted to hospital with [illness] on [date], and the doctor has advised complete rest until [date]. I have attached my medical certificate.",
          "Kindly grant me medical leave from [date] to [date], and consider it for my attendance.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 4: leave to take part in an event",
      blocks: [
        sample("event", "Taking part in an event", [
          ...TO_HOD,
          "Subject: Application for leave to take part in [event name]",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of [Course], [Year / Semester]. I have been selected to represent our college in [event name] at [place] from [date] to [date].",
          "Kindly grant me leave for these days. I have attached the invitation letter.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 5: one day for urgent work",
      blocks: [
        sample("urgent-work", "One day for urgent work", [
          ...TO_HOD,
          "Subject: Application for one day's leave",
          "",
          "Respected Sir/Madam,",
          "I am [Your name], a student of [Course], [Year / Semester]. Because of urgent work at home, I will not be able to attend college on [date].",
          "Kindly grant me leave for one day.",
          ...SIGN_OFF,
        ]),
      ],
    },
  ],
  faqs: [
    {
      q: "Should I write to the principal or the HOD?",
      a: "Usually your HOD, for a short leave from classes. Some colleges want applications addressed to the principal, forwarded through the HOD; follow your college's rule.",
    },
    {
      q: "Will approved leave count towards my attendance?",
      a: "It depends on your college. Many have a minimum attendance rule and consider medical leave with a certificate. Check with your department.",
    },
    { q: "When should I submit it?", a: "Before the leave if you can. For sudden illness, submit it on the day you return, with a medical certificate." },
  ],
  related: ["leave-application-for-school", "sick-leave-application-for-office", "application-for-bonafide-certificate"],
};

export default post;
