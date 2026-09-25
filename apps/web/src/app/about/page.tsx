import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <Prose eyebrow="About" title="Why Truehand exists">
      <p>
        Plenty of sites will put your text in a handwriting font. The trouble is that a font writes every “e” the same way, every line perfectly level, and
        people notice. Truehand was built to fix exactly that: to take a handwriting style and give it back the small inconsistencies that make writing look
        written.
      </p>
      <p>
        Under the hood it is a rendering engine that shapes text like a word processor, lays it out on real paper sizes, and then varies every word the way a
        hand does, from the slant of a letter to the pressure of the pen. New here? Start with the <Link href="/guides/getting-started">two-minute guide</Link>.
      </p>
      <h2>What we care about</h2>
      <ul>
        <li>
          <strong>Your words stay yours.</strong> The handwriting is drawn on your device. We don&rsquo;t upload what you write.
        </li>
        <li>
          <strong>Free should be useful.</strong> The free version has real limits, not a watermark, and it is paid for by a few quiet ads.
        </li>
        <li>
          <strong>Fair prices everywhere.</strong> Pro costs less where incomes are lower, and nothing renews behind your back.
        </li>
      </ul>
      <p>
        Questions, ideas or a hand you&rsquo;d like to see? <Link href="/contact">Get in touch</Link>.
      </p>
    </Prose>
  );
}
