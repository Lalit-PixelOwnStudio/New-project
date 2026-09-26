import { list, PUBLISHED, sample } from "../blocks";
import type { BlogPost } from "../types";

const TO_TEACHER = ["To", "[Teacher's name]", "[Class teacher / Subject teacher]", "[School name]", "", "Date: [DD/MM/YYYY]", ""];
const SIGN_OFF = ["Yours sincerely,", "[Your name]", "Class [Class and section], Roll No. [Roll number]"];

const post: BlogPost = {
  slug: "apology-letter-to-teacher",
  category: "letters",
  title: "Apology letter to a teacher: 5 samples",
  seoTitle: "Apology Letter to Teacher: 5 Samples",
  description:
    "Sincere apology letter samples to a teacher or principal: for misbehaving in class, not doing homework, being late, missing class and using a phone.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A good apology letter is short and honest: say what you did, show you understand why it was wrong, and say what you'll do differently. Don't make excuses. Change the sample so it matches what happened and sounds like you.",
  sections: [
    {
      heading: "How to write a good apology",
      blocks: [
        list(
          "Name what you did, plainly. “I talked during your lesson” is better than “the incident”.",
          "Say why it was wrong, in your own words.",
          "Say sorry once, clearly.",
          "Say what you'll do differently, and keep that promise.",
          "Keep it to one short page. A long letter sounds like excuses.",
        ),
      ],
    },
    {
      heading: "Sample 1: for misbehaving in class",
      blocks: [
        sample("misbehaviour", "Misbehaving in class", [
          ...TO_TEACHER,
          "Subject: Apology for my behaviour in class",
          "",
          "Respected Ma'am/Sir,",
          "I am writing to apologise for my behaviour in your class on [date]. I kept talking and disturbed the lesson even after you asked me to stop. It was disrespectful to you and unfair to my classmates who wanted to learn.",
          "I am truly sorry. From now on I will pay attention in class and follow your instructions.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: for not doing homework",
      blocks: [
        sample("homework", "Not doing homework", [
          ...TO_TEACHER,
          "Subject: Apology for not completing my homework",
          "",
          "Respected Ma'am/Sir,",
          "I am sorry that I did not complete the [subject] homework due on [date]. I did not plan my time well, and I know it held back the class discussion.",
          "I have now finished it and attached it to this letter. I will make a timetable so that I submit my work on time from now on.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: for coming late",
      blocks: [
        sample("late", "Coming late", [
          ...TO_TEACHER,
          "Subject: Apology for coming late to school",
          "",
          "Respected Ma'am/Sir,",
          "I apologise for coming late to school [number] times this month. I understand that it disturbs the class and sets a bad example.",
          "I have started leaving home [number] minutes earlier, and I will make sure I am on time from now on.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 4: for missing class without informing",
      blocks: [
        sample("absent", "Missing class without informing", [
          ...TO_TEACHER,
          "Subject: Apology for missing class without informing",
          "",
          "Respected Ma'am/Sir,",
          "I am sorry that I missed your class on [date] without informing you. I should have asked for permission first.",
          "I have copied the notes from my classmate and will not repeat this mistake.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 5: for using a phone in class",
      blocks: [
        sample("phone", "Using a phone in class", [
          ...TO_TEACHER,
          "Subject: Apology for using my phone in class",
          "",
          "Respected Ma'am/Sir,",
          "I apologise for using my mobile phone during your class on [date], which is against the school rules. It was careless of me, and it disturbed the lesson.",
          "I will not bring my phone into class again, and I request you to kindly return it.",
          ...SIGN_OFF,
        ]),
      ],
    },
  ],
  faqs: [
    { q: "How long should an apology letter be?", a: "Short: three or four sentences in the body, about 80 to 150 words." },
    {
      q: "Should it be handwritten?",
      a: "A handwritten apology feels more personal. If your teacher asked for one in your own handwriting, write it yourself.",
    },
    {
      q: "Should I address it to the teacher or the principal?",
      a: "To whoever asked for it, or to the teacher whose class it concerns. Send a copy to the principal only if you were asked to.",
    },
  ],
  related: ["leave-application-for-school", "formal-letter-format", "informal-letter-format"],
};

export default post;
