import { p, PUBLISHED, sample, steps } from "../blocks";
import type { BlogPost } from "../types";

const post: BlogPost = {
  slug: "how-to-improve-handwriting",
  title: "How to improve your handwriting: 12 tips that work",
  seoTitle: "How to Improve Your Handwriting: 12 Tips",
  description:
    "Twelve practical ways to make your handwriting neater and faster, from pen grip and posture to daily drills, plus a free practice sheet to copy.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 6,
  intro:
    "Neat handwriting comes from a relaxed grip, even letter sizes and steady spacing, and it improves with ten minutes of practice a day. These tips work at any age, and the practice sheet at the end gives you a model to copy.",
  sections: [
    {
      heading: "Get the basics right",
      blocks: [
        steps(
          "Hold the pen loosely, about 2 to 3 cm from the tip. A tight grip makes letters shaky and your hand tired.",
          "Sit straight with both feet on the floor, and rest your forearm on the desk.",
          "Tilt the page slightly: to the left if you're right-handed, to the right if you're left-handed.",
          "Use a pen that glides: a gel or fine ballpoint pen is easier to control than a scratchy one.",
        ),
      ],
    },
    {
      heading: "Make every letter consistent",
      blocks: [
        steps(
          "Slow down. Neat first, fast later; speed comes on its own with practice.",
          "Keep small letters the same height, sitting on the line. Ruled paper helps.",
          "Make tall letters (b, d, h, k, l) about twice the height of small ones.",
          "Leave the width of one small letter o between words.",
          "Keep the same slant, straight up or slightly forward, but not mixed.",
        ),
      ],
    },
    {
      heading: "Practise a little every day",
      blocks: [
        steps(
          "Warm up with rows of loops, zigzags and circles to loosen your hand.",
          "Write a pangram, a sentence with every letter, three times a day. The practice sheet below has five.",
          "Pick the three letters you write worst and fill a line with each.",
        ),
        p(
          "Copying a neat model is the fastest way to improve. Open the practice sheet below in Truehand, pick a neat hand like Theo, print it, and copy it line by line underneath.",
        ),
        sample(
          "practice",
          "Handwriting practice sheet",
          [
            "# Handwriting practice",
            "The quick brown fox jumps over the lazy dog.",
            "Pack my box with five dozen liquor jugs.",
            "How vexingly quick daft zebras jump!",
            "Sphinx of black quartz, judge my vow.",
            "The five boxing wizards jump quickly.",
            "a b c d e f g h i j k l m n o p q r s t u v w x y z",
            "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
            "0 1 2 3 4 5 6 7 8 9",
          ],
          { styleId: "theo", paperId: "wide", fontSize: 1.15 },
        ),
      ],
    },
  ],
  faqs: [
    {
      q: "How long does it take to improve handwriting?",
      a: "Most people see a clear difference in two to three weeks with ten to fifteen minutes of practice a day.",
    },
    {
      q: "Should I write in cursive or print?",
      a: "Whichever you can keep neat and consistent. Many people write fastest in a mix: print letters that join where it's natural.",
    },
    {
      q: "Which pen is best for neat handwriting?",
      a: "A smooth gel pen or a fine ballpoint with a comfortable grip. Avoid pens that skip or scratch; they make you press harder.",
    },
  ],
  related: ["text-to-handwriting-converter", "acknowledgement-for-project-file", "informal-letter-format"],
};

export default post;
