import { STYLES } from "@truehand/catalog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ProTag } from "@/components/ui/ProTag";
import s from "./home.module.css";

/** A dozen hands that show the range, from tidy to messy. */
const FEATURED = ["mira", "zoe", "celeste", "theo", "doc", "vivian", "kit", "rosa", "poppy", "hugo", "lily", "grace"]
  .map((id) => STYLES.find((st) => st.id === id)!)
  .filter(Boolean);

/** A sample of the handwriting styles. */
export function Hands() {
  return (
    <Section
      label={`${STYLES.length} hands`}
      title="From tidy print to a doctor's scrawl"
      lede="Neat hands for lab records, joined cursive for letters, and messy everyday hands for notes that shouldn't look too perfect."
    >
      <ul className={s.hands}>
        {FEATURED.map((st) => (
          <li key={st.id}>
            <Link href={`/styles/${st.id}`} className={s.handCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/specimens/name-${st.id}.webp`} alt={st.name} width={250} height={62} loading="lazy" />
              <span className={s.handMeta}>
                <span>{st.category === "casual" ? "Everyday" : st.category[0]!.toUpperCase() + st.category.slice(1)}</span>
                {st.tier === "pro" && <ProTag />}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href="/styles" variant="secondary">
        See all {STYLES.length} handwriting styles <ArrowRight aria-hidden="true" />
      </ButtonLink>
    </Section>
  );
}
