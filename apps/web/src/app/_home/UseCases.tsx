import Link from "next/link";
import { Section } from "@/components/Section";
import { USE_CASES } from "@/content/use-cases";
import s from "./home.module.css";

/** What people write with it, each linking to its landing page. */
export function UseCases() {
  return (
    <Section label="Made for" title="Whatever you need written" tone="page">
      <ul className={s.uses}>
        {USE_CASES.map((u) => (
          <li key={u.slug}>
            <Link href={`/use/${u.slug}`} className={s.use}>
              <span className={s.useThumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/specimens/use-${u.slug}.webp`} alt="" width={794} height={617} loading="lazy" />
              </span>
              <span className={s.useText}>
                <strong>{u.name}</strong>
                <span>{u.lede}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
