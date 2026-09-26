import { PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "informal-letter-format",
  category: "letters",
  title: "Informal letter format, with examples",
  seoTitle: "Informal Letter Format with Examples",
  description:
    "The informal letter format for school, with three full examples: congratulating a friend, advising a younger brother, and writing to grandparents.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 5,
  intro:
    "An informal letter is a personal letter to a friend or relative. It has fewer parts than a formal letter: your address, the date, a warm greeting, the body, and a friendly closing. There's no subject line and no receiver's address.",
  sections: [
    {
      heading: "The parts of an informal letter",
      blocks: [
        steps(
          "Your address.",
          "The date.",
          "Salutation: Dear [name], or My dear [name].",
          "Body: ask how they are, the main news or advice, and a warm ending.",
          "Complimentary close: Your loving friend, Yours affectionately, or With love, then your name.",
        ),
      ],
    },
    {
      heading: "Example 1: congratulating a friend",
      blocks: [
        sample("congratulate", "Congratulating a friend", [
          "[Your address]",
          "[City]",
          "",
          "26 September 2026",
          "",
          "Dear [Friend's name],",
          "I hope you are doing well. I was so happy to hear from Aunty that you won first prize in the inter-school debate competition. Congratulations!",
          "All the practice you did in the evenings has really paid off. I remember how nervous you were before your first debate last year, and now you've beaten the best speakers in the city.",
          "Please share the video of your speech with me. Give my regards to Uncle and Aunty.",
          "Your loving friend,",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Example 2: advising a younger brother",
      blocks: [
        sample("advice", "Advising a younger brother", [
          "[Your address]",
          "[City]",
          "",
          "26 September 2026",
          "",
          "Dear [Brother's name],",
          "I hope you have settled into the hostel. Mummy told me that you have been spending a lot of time on your phone and your exams are only a month away.",
          "I know the phone is fun, but it's easy to lose hours on it. Try keeping it away while you study, and use it only after you finish your day's revision. Make a timetable and stick to it; you will feel much less stressed.",
          "I know you can do really well. Write to me about how your preparation is going.",
          "Your loving sister,",
          "[Your name]",
        ]),
      ],
    },
    {
      heading: "Example 3: writing to grandparents",
      blocks: [
        sample("grandparents", "Writing to grandparents", [
          "[Your address]",
          "[City]",
          "",
          "26 September 2026",
          "",
          "Dear Dadi and Dadaji,",
          "I hope you are both keeping well. We reached home safely after our holiday with you, and I already miss your stories and Dadi's cooking.",
          "School has started again, and I've joined the art club. I'm painting the view from your terrace from the photo I took.",
          "Please take care of your health, and come and stay with us soon.",
          "With lots of love,",
          "[Your name]",
        ]),
      ],
    },
  ],
  faqs: [
    { q: "Does an informal letter have a subject?", a: "No. Subject lines are only for formal letters." },
    {
      q: "How do I end an informal letter?",
      a: "With a friendly close that fits the person: Your loving friend, Yours affectionately, With love, or Your loving son or daughter, followed by your name.",
    },
  ],
  related: ["formal-letter-format", "diary-entry-format", "thank-you-note-for-teacher"],
};

export default post;
