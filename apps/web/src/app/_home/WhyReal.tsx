import { ArrowRight, Droplet, Shuffle, Timer, Waves } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/Section";
import s from "./home.module.css";

const POINTS = [
  {
    icon: Shuffle,
    title: "No two letters alike",
    body: "Each word gets its own slight slant, size and shape from a smooth random field, so letters vary without breaking joined-up writing.",
  },
  {
    icon: Waves,
    title: "Lines that drift",
    body: "Words sit on the ruled line but wander a little above and below it, and a whole line can tilt by a fraction of a degree.",
  },
  {
    icon: Droplet,
    title: "Ink, not pixels",
    body: "Ballpoint skips, gel saturates, pencil catches the grain. Ink is layered into textured paper instead of being stamped on top.",
  },
  {
    icon: Timer,
    title: "It gets tired",
    body: "Toward the bottom of a long page the writing loosens slightly, the way it does after twenty minutes of writing by hand.",
  },
];

/** Why Truehand looks handwritten: a font against the real engine, and what varies. */
export function WhyReal() {
  return (
    <Section
      label="Why it looks real"
      title="A font writes the same line the same way. People don't."
      lede="Handwriting fonts repeat every letter perfectly, and that is exactly what gives them away. Truehand redraws each word as it places it on the page."
    >
      <div className={s.compare}>
        <figure className={s.compareCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/specimens/compare-font.webp"
            alt="The same sentence written three times by a handwriting font: every copy is identical."
            width={720}
            height={176}
            loading="lazy"
          />
          <figcaption>
            <strong>A handwriting font.</strong> Three lines, three identical copies.
          </figcaption>
        </figure>
        <figure className={s.compareCard} data-good>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/specimens/compare-hand.webp"
            alt="The same sentence written three times by Truehand: every copy differs slightly, like real handwriting."
            width={720}
            height={176}
            loading="lazy"
          />
          <figcaption>
            <strong>The same hand in Truehand.</strong> Same text, three slightly different lines.
          </figcaption>
        </figure>
      </div>
      <ul className={s.points}>
        {POINTS.map((p) => (
          <li key={p.title}>
            <span className={s.pointIcon}>
              <p.icon aria-hidden="true" />
            </span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>
      <Link href="/guides/getting-started" className={s.textLink}>
        New here? Read the starter guide <ArrowRight aria-hidden="true" />
      </Link>
    </Section>
  );
}
