import { list, p, PUBLISHED, sample } from "../blocks";
import type { BlogPost } from "../types";

/** A card reads better in a relaxed hand on blank paper. */
const CARD = { styleId: "zoe", paperId: "plain", fontSize: 1.1 } as const;

const post: BlogPost = {
  slug: "thank-you-note-for-teacher",
  category: "letters",
  title: "Thank-you notes for teachers: cards, letters and short messages",
  seoTitle: "Thank-You Notes for Teachers: Messages",
  description:
    "Thank-you note samples for teachers: a Teachers' Day card, a farewell letter, a note from a parent, and short messages you can write inside a card.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "The best thank-you note to a teacher names one thing they actually did for you: a subject they made you enjoy, extra help before an exam, a kind word on a bad day. A few honest lines in your own handwriting mean more than a long, general message.",
  sections: [
    {
      heading: "How to write one",
      blocks: [
        list(
          "Start with “Dear [Teacher's name] Ma'am/Sir,”.",
          "Name one specific thing they did, and what it changed for you.",
          "Say thank you plainly. You don't need big words.",
          "End warmly: “With love and respect,” or “Gratefully,” and your name and class.",
        ),
        p("Keep it to five or six lines. A card has little space, and a short note is easier to read and remember."),
      ],
    },
    {
      heading: "Sample 1: a Teachers' Day card",
      blocks: [
        sample(
          "teachers-day",
          "Teachers' Day card",
          [
            "Dear [Teacher's name] Ma'am,",
            "",
            "Happy Teachers' Day!",
            "",
            "Thank you for making [subject] my favourite subject this year. I used to be scared of it, but you explained every step so patiently that I now enjoy solving problems on my own.",
            "",
            "Thank you for believing in me.",
            "",
            "With love and respect,",
            "[Your name]",
            "Class [Class and section]",
          ],
          CARD,
        ),
      ],
    },
    {
      heading: "Sample 2: a farewell letter",
      blocks: [
        sample(
          "farewell",
          "Farewell letter",
          [
            "Dear [Teacher's name] Sir,",
            "",
            "As I leave school this year, I wanted to thank you for everything you have taught me, in class and outside it.",
            "",
            "You never gave up on me, even when my marks did. The extra classes before the board exams and your advice to “practise one question more” are the reasons I did well.",
            "",
            "I will miss your classes. I hope to make you proud.",
            "",
            "Gratefully,",
            "[Your name]",
            "Class [Class and section], Batch of [Year]",
          ],
          CARD,
        ),
      ],
    },
    {
      heading: "Sample 3: a note from a parent",
      blocks: [
        sample(
          "parent",
          "Note from a parent",
          [
            "Dear [Teacher's name] Ma'am,",
            "",
            "Thank you for all the care you have given [Child's name] this year. [He / She] used to be very shy, and now [he / she] happily talks about school every evening and reads aloud at home.",
            "",
            "We know how much of that is because of your patience and encouragement. We are truly grateful.",
            "",
            "Warm regards,",
            "[Parent's name]",
            "Parent of [Child's name], Class [Class and section]",
          ],
          CARD,
        ),
      ],
    },
    {
      heading: "Sample 4: short messages for a card",
      blocks: [
        p("Pick one, add your teacher's name, and sign it:"),
        sample(
          "short",
          "Short messages",
          [
            "- Thank you for making every class something to look forward to.",
            "- You taught me more than [subject]. You taught me to keep trying. Thank you!",
            "- Thank you for your patience, your jokes and your red pen. I learnt from all three.",
            "- Happy Teachers' Day to the teacher who always had time for one more question.",
            "- Thank you for believing in me before I believed in myself.",
          ],
          CARD,
        ),
      ],
    },
  ],
  faqs: [
    {
      q: "How long should a thank-you note to a teacher be?",
      a: "Four to six lines is plenty for a card. A farewell letter can be a little longer, but a page at most.",
    },
    {
      q: "What should I write if I'm not close to the teacher?",
      a: "Mention one thing from their class you liked or learnt, and thank them for it. It still sounds sincere.",
    },
    {
      q: "Should it be handwritten?",
      a: "Yes, if you can. A handwritten note feels personal. For many cards at once, Truehand can write the text in a realistic hand for you to print.",
    },
  ],
  related: ["informal-letter-format", "apology-letter-to-teacher", "diary-entry-format"],
};

export default post;
