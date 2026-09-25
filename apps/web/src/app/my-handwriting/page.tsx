import type { Metadata } from "next";
import { headers } from "next/headers";
import { Faq } from "@/components/Faq";
import { PageHero, Section } from "@/components/Section";
import { countryFromHeaders, priceFor } from "@/lib/pricing";
import { MyHandTool } from "@/myhand/MyHandTool";
import { YourHands } from "@/myhand/YourHands";
import { googleEnabled } from "@/server/auth";

export const metadata: Metadata = {
  title: "Turn your handwriting into a font",
  description: "Write one page by hand, take a photo, and Truehand turns it into your own handwriting for any text, with every letter a little different.",
  alternates: { canonical: "/my-handwriting" },
};

export default async function MyHandwritingPage() {
  const price = priceFor("my_hand", countryFromHeaders(await headers())).display;
  return (
    <main>
      <PageHero
        eyebrow="Your own handwriting"
        title="Write one page. Get your own handwriting."
        lede={`Fill in a one-page template by hand, take a photo, and Truehand turns it into your handwriting for any text you type. Sign up free, then ${price} once to download pages in it.`}
      />
      <Section tone="page">
        <YourHands priceLabel={price} />
        <MyHandTool priceLabel={price} google={googleEnabled} />
      </Section>
      <Section label="Questions" title="Good to know">
        <Faq
          items={[
            {
              q: "What do I need?",
              a: "A free account (sign in with Google or your email), a printer, a dark pen and a phone camera. No printer? Choose Draw on screen and write each letter with your finger or a stylus instead.",
            },
            {
              q: "Why write the small letters twice?",
              a: "Truehand uses both versions and switches between them, so the same letter doesn't look identical every time, the way real handwriting doesn't.",
            },
            {
              q: "Is my photo uploaded?",
              a: "No. The photo is read on your own device. What's kept is the shape of each letter, in this browser, and on your account if you're signed in, so it works on your other devices too.",
            },
            {
              q: "What does it cost?",
              a: `Signing up and making your handwriting is free. When you save it, ${price} once unlocks downloads in it for good, for every handwriting you make. Every plan includes it too.`,
            },
            {
              q: "Some characters weren't found.",
              a: "They're written in the default hand for now. Retake the photo in good light with the whole page flat and all four black squares in view, or fill in the missing boxes and photograph the page again.",
            },
          ]}
        />
      </Section>
    </main>
  );
}
