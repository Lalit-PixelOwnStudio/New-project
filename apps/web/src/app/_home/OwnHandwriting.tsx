import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import s from "./home.module.css";

/** The way into making a handwriting from your own writing. */
export function OwnHandwriting() {
  return (
    <Section label="Your own handwriting" title="Or write in your own hand">
      <div className={s.mineRow}>
        <ol className={s.mineSteps}>
          <li>
            <strong>Write one page</strong>
            <span>Fill in a printable template with a pen, or draw the letters on your phone.</span>
          </li>
          <li>
            <strong>Take a photo</strong>
            <span>Truehand reads every letter on your device. Nothing is uploaded.</span>
          </li>
          <li>
            <strong>Type anything</strong>
            <span>It comes out in your handwriting, every letter a little different, like the real thing.</span>
          </li>
        </ol>
        <ButtonLink href="/my-handwriting">
          Make your handwriting <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </div>
    </Section>
  );
}
