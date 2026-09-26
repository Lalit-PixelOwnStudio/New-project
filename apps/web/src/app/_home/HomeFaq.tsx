import { Faq } from "@/components/Faq";
import { Section } from "@/components/Section";

/** Questions people ask before trying it. */
export function HomeFaq() {
  return (
    <Section label="Questions" title="Good to know">
      <Faq
        items={[
          {
            q: "Is Truehand free?",
            a: "Yes. The free version has 16 handwriting styles, 5 papers and 3 pens, with up to 10 pages a day to download and no watermark. It is paid for by a few ads. The Week, Month and Year plans add pages, every hand and up to 4K quality, with no ads.",
          },
          {
            q: "Is my text uploaded anywhere?",
            a: "No. The handwriting is drawn by your own browser, so your text never leaves your device. It is only stored online if you choose to save a document to your account.",
          },
          {
            q: "Can people tell it isn't real handwriting?",
            a: "It is designed to look natural: letters vary, lines drift, and ink behaves like ink. It is still a typed text rendered as handwriting, though, so if something must be written by you personally, write it yourself.",
          },
          {
            q: "Which languages can it write?",
            a: "Any language written in the Latin alphabet, including accented letters for most European languages. Several hands also write Cyrillic, Greek or Vietnamese.",
          },
          {
            q: "Can I use my own handwriting?",
            a: "Yes. Write one page of letters by hand (or draw them on your phone), and Truehand turns it into your own handwriting for anything you type. Making it is free; downloading pages in it is a one-time unlock, and every plan includes it.",
          },
          {
            q: "What can I download?",
            a: "A multi-page PDF, PNG images, or a ZIP of all pages. Free downloads are Full HD; the Week plan adds 2K, and Month or Year add 4K and a transparent background option.",
          },
        ]}
      />
    </Section>
  );
}
