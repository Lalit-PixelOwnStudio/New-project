import { list, note, p, shot, steps, UPDATED } from "../blocks";
import type { Guide } from "../types";

const guide: Guide = {
  slug: "make-your-own-handwriting-font",
  title: "How do I turn my own handwriting into a font?",
  description:
    "Write one page by hand, or draw the letters on your phone, and Truehand writes anything you type in your own handwriting. Step by step, with screenshots.",
  answer:
    "Sign in, print the one-page template, write one letter in each box and upload a photo of it. Truehand reads every letter and writes whatever you type in your own hand. No printer? Draw the letters on your phone instead.",
  minutes: 3,
  updated: UPDATED,
  related: ["getting-started", "make-it-look-real", "typed-assignment-to-handwriting"],
  cta: { href: "/my-handwriting", label: "Make my handwriting" },
  sections: [
    {
      heading: "Step 1: Sign in and pick how to write",
      blocks: [
        p(
          "Open Your own handwriting and sign in with Google or your email (1). The account keeps your handwriting safe and lets you use it on any device. Then download the template (2) to print, and upload a photo of it (3) once it's filled in. No printer? Choose Start drawing (4) and skip to the last part of this guide.",
        ),
        shot("mine-start", "The Your own handwriting page with sign-in, the template, photo upload and drawing marked"),
      ],
    },
    {
      heading: "Step 2: Fill in the template",
      blocks: [
        steps(
          "Print the template on A4 at Actual size.",
          "Use a dark pen. Black or blue gel pens work best; pencil is too faint.",
          "Write one character in each box, sitting on the small marks at the sides of the box.",
          "Write the way you normally do. The small letters appear twice, so the same letter doesn't look identical every time.",
        ),
      ],
    },
    {
      heading: "Step 3: Take the photo",
      blocks: [
        list(
          "Lay the page flat in good, even light, with no shadow across it.",
          "Get the whole page in the photo, with all four black squares in view.",
          "Hold the phone above the page. A slight angle is fine; Truehand straightens it.",
        ),
        shot(
          "mine-photo",
          "A photo of a filled-in template, taken at a slight angle",
          "A good photo: the whole page, all four black squares, even light.",
          true,
        ),
      ],
    },
    {
      heading: "Step 4: Check what was read",
      blocks: [
        p(
          "Your photo is read on your own device and never uploaded. You'll see how many characters were read (1), every letter as it was read (2), and a page written in your new handwriting (3).",
        ),
        shot("mine-review", "The results: characters read, each letter, and a sample page in the new handwriting"),
      ],
    },
    {
      heading: "Step 5: Name it and save",
      blocks: [
        p("Give it a name (1) and press Save (2)."),
        shot("mine-save", "The name field and the Save button"),
        p(
          "Saving asks for a one-time payment that unlocks downloads in your handwriting for good (1). It's ₹49 in India, and every plan includes it. Not ready to pay? Choose Not now (2) to try it in the editor first.",
        ),
        shot("mine-unlock", "The unlock step, with the payment button and the Not now link"),
      ],
    },
    {
      heading: "Step 6: Write with it",
      blocks: [
        p(
          "In the editor, open the Hand picker: your handwriting is at the top (1). Type anything and it comes out in your hand, every letter a little different.",
        ),
        shot("mine-in-editor", "The Hand picker with your own handwriting at the top"),
      ],
    },
    {
      heading: "No printer? Draw the letters on your phone",
      blocks: [
        p(
          "Choose Start drawing and write each character on the pad (1), sitting on the dotted line. Tap Next (2) for the next one. Small letters come first, since they fill most of a page. Finish now (3) works once you've drawn 10.",
        ),
        shot("phone-mine-draw", "The drawing pad on a phone, with the pad, Next and Finish now marked"),
        note(
          "Draw all 26 small letters for a page that looks fully like yours. Letters you skip are written in the default hand, and a capital you drew stands in for its small letter.",
        ),
      ],
    },
  ],
  faqs: [
    {
      q: "Some letters weren't found. What do I do?",
      a: "Retake the photo in brighter, even light, with the page flat and all four black squares in view. Boxes left empty or written too faintly are skipped and written in the default hand.",
    },
    {
      q: "It says it can't find the four black squares.",
      a: "Get the whole page in the photo with a little space around it, and make sure nothing covers the corners. Move away from strong shadows and try again.",
    },
    {
      q: "Is my photo uploaded?",
      a: "No. The photo is read on your device. Only the shapes of your letters are saved, to your account, so your handwriting works on your other devices too.",
    },
    {
      q: "What does it cost?",
      a: "Making your handwriting and trying it in the editor is free. Downloading pages written in it is a one-time payment (₹49 in India, $1.99 in the US), and every plan includes it. One payment covers every handwriting you make.",
    },
    { q: "Can I make more than one?", a: "Yes, up to 20. Each one appears at the top of the Hand picker." },
  ],
};

export default guide;
