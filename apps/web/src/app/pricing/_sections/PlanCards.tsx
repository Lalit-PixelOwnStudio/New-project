import { BuyButton } from "@/components/BuyButton";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { LIMITS, PLANS } from "@/lib/plans";
import { resolutionName } from "@/lib/resolution";
import { PlanRow } from "../PlanRow";
import s from "../pricing.module.css";
import { freePapers, freePens, freeStyles, pages, PLAN_CARDS, type PriceBook } from "./data";

/** Free and the three plans, side by side (a swipeable row on phones). */
export function PlanCards({ book }: { book: PriceBook }) {
  const free = LIMITS.free;
  return (
    <Section tone="page">
      <p className={s.swipe} aria-hidden="true">
        Swipe to see every plan →
      </p>
      <PlanRow className={s.plans}>
        <div className={s.plan}>
          <header>
            <h2 className={s.planName}>Free</h2>
            <p className={s.price}>
              <span>{book.currency === "INR" ? "₹0" : "$0"}</span>
            </p>
            <p className={s.planNote}>For trying it out and short pages. Paid for by a few quiet ads.</p>
          </header>
          <dl className={s.stats}>
            <div>
              <dt>Pages</dt>
              <dd>{free.pagesPerDay} a day</dd>
            </div>
            <div>
              <dt>Quality</dt>
              <dd>{resolutionName(free.maxDpi)}</dd>
            </div>
          </dl>
          <ul className={s.list}>
            <li>{freeStyles} handwritings, including messy everyday ones</li>
            <li>
              {freePapers} papers and {freePens} ballpoint pens
            </li>
            <li>PDF, PNG and ZIP, no watermark</li>
            <li>No account needed</li>
          </ul>
          <ButtonLink href="/" variant="secondary" wide>
            Start writing
          </ButtonLink>
        </div>

        {PLAN_CARDS.map((c) => {
          const plan = PLANS[c.plan];
          const p = book.price(c.product);
          return (
            <div key={c.plan} className={s.plan} data-highlight={c.plan === "month" || undefined}>
              <header>
                <h2 className={s.planName}>
                  {plan.name}
                  {c.badge && <span className={s.badge}>{c.badge}</span>}
                </h2>
                <p className={s.price}>
                  <span>{p.display}</span>
                  <small>{c.per}</small>
                </p>
                <p className={s.planNote}>
                  {plan.bestFor} {c.plan === "year" ? `About ${book.perMonthOfYear} a month, paid once.` : "Paid once, doesn't renew."}
                </p>
              </header>
              <dl className={s.stats}>
                <div>
                  <dt>Pages</dt>
                  <dd>{pages(plan.pages)}</dd>
                </div>
                <div>
                  <dt>Quality</dt>
                  <dd>{resolutionName(LIMITS[c.plan].maxDpi)}</dd>
                </div>
              </dl>
              <ul className={s.list}>
                {c.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <BuyButton product={c.product} currency={book.pay ?? undefined} variant={c.plan === "month" ? "primary" : "secondary"} wide size="l">
                Get {plan.name} · {p.display}
              </BuyButton>
            </div>
          );
        })}
      </PlanRow>
      <p className={s.footnote}>
        Anything marked Pro in the editor comes with every plan; 4K, the scanned and photo looks, batch letters and transparent PNGs come with Month and Year.
        Week and Month keep the free {free.pagesPerDay} pages a day on top of their own, and pages you don&rsquo;t use stay on your account after the plan ends.
      </p>
    </Section>
  );
}
