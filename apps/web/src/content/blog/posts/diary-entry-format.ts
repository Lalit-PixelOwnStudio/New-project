import { list, note, p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "diary-entry-format",
  category: "letters",
  title: "Diary entry format, with examples for Class 6 to 10",
  seoTitle: "Diary Entry Format with Examples",
  description:
    "The diary entry format for school exams: day, date and time, Dear Diary, the body in the first person, and your name, with three sample entries to copy.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A diary entry records what happened on a day and how you felt about it, written in the first person. In exams it's usually 100 to 150 words and follows a simple format: the day, date and time at the top, “Dear Diary”, the entry, and your name at the end.",
  sections: [
    {
      heading: "The format",
      blocks: [
        steps(
          "Day and date, like Monday, 14 July 2026, on the left.",
          "Time, like 9:30 p.m., below it or on the right.",
          "“Dear Diary,” to begin.",
          "The body: what happened, in the order it happened, and how you felt about it.",
          "Your name at the end.",
        ),
        note("Write in the first person (I, me, my), and in the past tense for what happened today. Feelings and thoughts matter as much as events."),
      ],
    },
    {
      heading: "Tips for full marks",
      blocks: [
        list(
          "Stick to the word limit. Examiners stop reading past it.",
          "Open with the event, not with “Today I woke up”.",
          "Say how you felt, and why, at least once.",
          "End with a thought about the day, or what you'll do next.",
          "Keep it informal, but avoid slang and short forms like “gonna”.",
        ),
      ],
    },
    {
      heading: "Sample 1: first day at a new school",
      blocks: [
        sample("new-school", "First day at a new school", [
          "Monday, 7 April 2026",
          "9:00 p.m.",
          "",
          "Dear Diary,",
          "Today was my first day at [School name], and I was nervous all morning. I didn't know anyone, and the building felt huge.",
          "In the first period, our class teacher asked me to introduce myself. My voice shook, but a girl called [Friend's name] smiled and later showed me the way to the library and the canteen. We sat together at lunch and found out we both love cricket.",
          "By the last bell, the school felt a little less strange. I think I'm going to like it here.",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Sample 2: a school trip",
      blocks: [
        sample("trip", "A school trip", [
          "Friday, 21 November 2026",
          "10:00 p.m.",
          "",
          "Dear Diary,",
          "Today our class went on a trip to [place], and it was the best day of the term. We left school at 7 a.m. and sang all the way in the bus.",
          "The guide showed us [what you saw]. I had only read about it in my textbook, and seeing it for real was amazing. We had lunch on the lawns, and our teacher even let us play for an hour.",
          "I'm tired, but I'll remember today for a long time. I've already started a page about it in my scrapbook.",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Sample 3: a day I'll never forget",
      blocks: [
        sample("unforgettable", "A day I'll never forget", [
          "Sunday, 15 March 2026",
          "8:30 p.m.",
          "",
          "Dear Diary,",
          "The results of the inter-school quiz came out today, and our team won first prize! I still can't believe it.",
          "The final round was so close. On the last question, everyone looked at me, and I remembered the answer from a book Dadi gave me last year. When the host said “correct”, the whole hall clapped.",
          "I learnt that reading for fun can pay off in surprising ways. I'm going to call Dadi tomorrow and thank her.",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Diary entry or letter?",
      blocks: [
        p(
          "A diary entry is private and written to yourself, so it has no address, subject or closing like “Yours sincerely”. An informal letter is written to someone else and has their address, a greeting and a closing.",
        ),
      ],
    },
  ],
  faqs: [
    { q: "How many words should a diary entry be?", a: "Usually 100 to 150 words in school exams. Check the question: it often says the limit." },
    {
      q: "Is a diary entry written in the past tense?",
      a: "Mostly. Events of the day are in the past tense; your feelings now and plans for later can be in the present or future.",
    },
    { q: "Does a diary entry need a title?", a: "No. The day, date and time and “Dear Diary” are enough, unless your teacher asks for one." },
  ],
  related: ["informal-letter-format", "notice-writing-format", "thank-you-note-for-teacher"],
};

export default post;
