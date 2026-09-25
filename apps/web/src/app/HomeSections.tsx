import { STYLES } from "@truehand/catalog";
import { ArrowRight, Droplet, FileSpreadsheet, Shuffle, Timer, Waves } from "lucide-react";
import Link from "next/link";
import { AdBand } from "@/components/AdBand";
import { Faq } from "@/components/Faq";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ProTag } from "@/components/ui/ProTag";
import { USE_CASES } from "@/content/use-cases";
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

export function HomeSections() {
  const featured = ["mira", "zoe", "celeste", "theo", "doc", "vivian", "kit", "rosa", "poppy", "hugo", "lily", "grace"]
    .map((id) => STYLES.find((st) => st.id === id)!)
    .filter(Boolean);

  return (
    <>
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
      <AdBand />

      <Section
        label={`${STYLES.length} hands`}
        title="From tidy print to a doctor's scrawl"
        lede="Neat hands for lab records, joined cursive for letters, and messy everyday hands for notes that shouldn't look too perfect."
      >
        <ul className={s.hands}>
          {featured.map((st) => (
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

      <Section tone="page">
        <div className={s.business}>
          <div>
            <p className={s.kicker}>Truehand for business</p>
            <h2 className={s.businessTitle}>Hundreds of handwritten letters from one spreadsheet</h2>
            <p className={s.businessText}>
              Write a template once, with fields like <code>{"{{first_name}}"}</code>, upload a CSV, and download one handwritten letter, note or envelope per
              row. Transparent PNGs drop straight into print designs.
            </p>
            <div className={s.row}>
              <ButtonLink href="/business">For business</ButtonLink>
              <ButtonLink href="/batch" variant="secondary">
                <FileSpreadsheet aria-hidden="true" />
                Try batch letters
              </ButtonLink>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={s.businessImg}
            src="/specimens/use-letters.webp"
            alt="A handwritten thank-you letter generated by Truehand."
            width={794}
            height={617}
            loading="lazy"
          />
        </div>
      </Section>
      <AdBand />

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
              a: "That's coming: you'll write a sheet of letters, take a photo, and Truehand will learn your hand. Until then, choose the closest style and adjust size, slant and messiness.",
            },
            {
              q: "What can I download?",
              a: "A multi-page PDF, PNG images, or a ZIP of all pages. Free downloads are Full HD; the Week plan adds 2K, and Month or Year add 4K and a transparent background option.",
            },
          ]}
        />
      </Section>
    </>
  );
}
