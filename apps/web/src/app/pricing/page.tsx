import { PAPERS, PENS, STYLES } from "@truehand/catalog";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { Faq } from "@/components/Faq";
import { PageHero, Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { LIMITS, PLANS, type PaidPlan } from "@/lib/plans";
import { countryFromHeaders, priceFor, PRODUCTS, RAZORPAY_ABROAD, regionFor, USD_METHODS, yearlyPerMonth, type Currency, type ProductId } from "@/lib/pricing";
import { resolutionName } from "@/lib/resolution";
import { PlanRow } from "./PlanRow";
import s from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Pricing: free text to handwriting, paid plans",
  description: `Truehand is free with ads. Three one-time plans add pages, every hand, paper and pen, and up to 4K quality: Week, Month or Year. Nothing renews.`,
  alternates: { canonical: "/pricing" },
};

const freeStyles = STYLES.filter((st) => st.tier === "free").length;
const freePapers = PAPERS.filter((p) => p.tier === "free").length;
const freePens = PENS.filter((p) => p.tier === "free").length;
const pages = (n: number | null) => (n === null ? "Unlimited" : n.toLocaleString("en-US"));

const PLAN_CARDS: { plan: PaidPlan; product: ProductId; per: string; badge?: string; features: string[] }[] = [
  {
    plan: "week",
    product: "pass_week",
    per: "for 7 days",
    features: [`Every handwriting (all ${STYLES.length})`, `Every paper and pen, any ink colour`, "No ads, no waiting after downloads"],
  },
  {
    plan: "month",
    product: "pass_month",
    per: "for a month",
    badge: "Most popular",
    features: ["Everything in Week", "Scanned and phone-photo looks", "Batch letters from a spreadsheet", "Transparent PNGs for cards and designs"],
  },
  {
    plan: "year",
    product: "pass_year",
    per: "for a year",
    badge: "Best value",
    features: ["Everything in Month", "No page limit, all year", "The lowest price per month"],
  },
];

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ country?: string; currency?: string }> }) {
  const params = await searchParams;
  const country = (process.env.NODE_ENV !== "production" && params.country) || countryFromHeaders(await headers());
  const india = regionFor(country) === "IN";
  // India can see and pay the US price in dollars; everyone else pays their own regional price.
  const pay: Currency | null = india && params.currency?.toLowerCase() === "usd" ? "USD" : null;
  const price = (p: ProductId) => priceFor(p, country, pay);
  const currency = price("pass_month").currency;
  const free = LIMITS.free;

  return (
    <main>
      <PageHero
        eyebrow="Pricing"
        title="Free to use. Pick a plan when you need more."
        lede="Three one-time plans. Nothing renews: pay once, and when it ends you're back on Free. Pages you don't use never expire."
      >
        <div className={s.where}>
          {india ? (
            <>
              <span>Show prices in</span>
              <span className={s.currency} role="group" aria-label="Currency">
                <Link href="/pricing" aria-current={currency === "INR" ? "true" : undefined} scroll={false}>
                  ₹ INR
                </Link>
                <Link href="/pricing?currency=usd" aria-current={currency === "USD" ? "true" : undefined} scroll={false}>
                  $ USD
                </Link>
              </span>
              <span>{currency === "INR" ? "UPI, cards, net banking" : USD_METHODS}</span>
            </>
          ) : (
            <span>Prices for your region · USD · {USD_METHODS}</span>
          )}
        </div>
      </PageHero>

      <Section tone="page">
        <p className={s.swipe} aria-hidden="true">
          Swipe to see every plan →
        </p>
        <PlanRow className={s.plans}>
          <div className={s.plan}>
            <header>
              <h2 className={s.planName}>Free</h2>
              <p className={s.price}>
                <span>{currency === "INR" ? "₹0" : "$0"}</span>
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
            const p = price(c.product);
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
                    {plan.bestFor} {c.plan === "year" ? `About ${yearlyPerMonth(country, pay)} a month, paid once.` : "Paid once, doesn't renew."}
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
                <BuyButton product={c.product} currency={pay ?? undefined} variant={c.plan === "month" ? "primary" : "secondary"} wide size="l">
                  Get {plan.name} · {p.display}
                </BuyButton>
              </div>
            );
          })}
        </PlanRow>
        <p className={s.footnote}>
          Anything marked Pro in the editor comes with every plan; 4K, the scanned and photo looks, batch letters and transparent PNGs come with Month and Year.
          Week and Month keep the free {free.pagesPerDay} pages a day on top of their own, and pages you don&rsquo;t use stay on your account after the plan
          ends.
        </p>
      </Section>

      <Section label="Add-ons" title="Just need a little more?" lede="One-time extras, without a plan.">
        <div className={s.addons}>
          <div className={s.addon}>
            <h3>{PRODUCTS.pages_100.name}</h3>
            <p>{PRODUCTS.pages_100.description} Used only for pages past the free limits.</p>
            <BuyButton product="pages_100" currency={pay ?? undefined} variant="secondary">
              Buy for {price("pages_100").display}
            </BuyButton>
          </div>
          <div className={s.addon}>
            <h3>{PRODUCTS.my_hand.name}</h3>
            <p>
              Write one page by hand (or draw the letters on your phone) and Truehand turns it into your own handwriting. Making it and trying it is free; this
              lets you download pages in it, for good. Every plan includes it too.
            </p>
            <div className={s.addonActions}>
              <ButtonLink href="/my-handwriting" variant="secondary">
                Make yours free
              </ButtonLink>
              <BuyButton product="my_hand" currency={pay ?? undefined}>
                Buy for {price("my_hand").display}
              </BuyButton>
            </div>
          </div>
        </div>
      </Section>

      <Section label="Compare" title="Every plan, side by side" tone="page">
        <div className={s.tableWrap} tabIndex={0} role="region" aria-label="Plan comparison">
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">
                  <span className="visually-hidden">Feature</span>
                </th>
                <th scope="col">Free</th>
                <th scope="col">Week</th>
                <th scope="col">Month</th>
                <th scope="col">Year</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", currency === "INR" ? "₹0" : "$0", price("pass_week").display, price("pass_month").display, price("pass_year").display],
                ["Lasts", "Always", "7 days", "1 month", "1 year"],
                ["Pages", `${free.pagesPerDay} a day`, pages(PLANS.week.pages), pages(PLANS.month.pages), pages(PLANS.year.pages)],
                [
                  "Quality",
                  resolutionName(LIMITS.free.maxDpi),
                  resolutionName(LIMITS.week.maxDpi),
                  resolutionName(LIMITS.month.maxDpi),
                  resolutionName(LIMITS.year.maxDpi),
                ],
                ["Handwritings", `${freeStyles}`, `${STYLES.length}`, `${STYLES.length}`, `${STYLES.length}`],
                ["Papers", `${freePapers}`, `${PAPERS.length}`, `${PAPERS.length}`, `${PAPERS.length}`],
                ["Pens and ink", `${freePens} ballpoints`, `${PENS.length} + any colour`, `${PENS.length} + any colour`, `${PENS.length} + any colour`],
                ["Scanned and photo finishes", "Preview", "Preview", "Yes", "Yes"],
                ["Your own handwriting", `Make free, ${price("my_hand").display} to download`, "Included", "Included", "Included"],
                ["Batch letters", "—", "—", "Yes", "Yes"],
                ["Transparent PNG", "—", "—", "Yes", "Yes"],
                ["Ads", "Yes", "None", "None", "None"],
                ["Watermark", "None", "None", "None", "None"],
              ].map(([f, ...cells]) => (
                <tr key={f}>
                  <th scope="row">{f}</th>
                  {cells.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section label="Questions" title="Before you buy">
        <Faq
          items={[
            {
              q: "Does anything renew automatically?",
              a: "No. Every plan is a one-time payment. When your week, month or year ends, your account goes back to Free. Buying the same plan again adds time on top of what you have left.",
            },
            {
              q: "Which plan should I pick?",
              a: "One assignment or one busy week: Week. A term of assignments, notes and lab records: Month. The whole school year, or if you don't want to count pages at all: Year.",
            },
            {
              q: "Is Year really unlimited?",
              a: `Yes, for your own work there's no page limit. To stop abuse, one account can download up to ${LIMITS.year.pagesPerExport} pages at a time and ${pages(LIMITS.year.pagesPerDay)} pages a day, far more than any assignment needs.`,
            },
            {
              q: "What counts as a page?",
              a: "One side of paper in your download: a 3-page PDF uses 3 pages. On Week and Month, the free 10 pages a day are used first, then your plan's pages.",
            },
            {
              q: "What do Full HD, 2K and 4K mean here?",
              a: "How sharp your download is. On an A4 page, Full HD is 1240 × 1754 pixels, 2K is 1654 × 2339 and 4K is 2480 × 3508. Full HD is fine for screens and most printing; 4K looks sharpest on paper.",
            },
            {
              q: "What happens to unused pages when my plan ends?",
              a: "They stay on your account and never expire. After the plan ends you can still use them, with the free handwritings and Full HD quality.",
            },
            {
              q: "How can I pay?",
              a: RAZORPAY_ABROAD
                ? "It's picked from where you are. In India, prices are in rupees and you pay through Razorpay: UPI, cards, net banking or wallets (you can also switch to US dollars above). Everywhere else, prices are in US dollars and you pay by card (Visa, Mastercard or Amex), through Razorpay's secure checkout."
                : "It's picked from where you are. In India, prices are in rupees and you pay through Razorpay: UPI, cards, net banking or wallets (you can also switch to US dollars above and use PayPal). Everywhere else, prices are in US dollars and you pay through PayPal, with a PayPal account or a card.",
            },
            {
              q: "Why are prices different in different countries?",
              a: "Prices are adjusted to local purchasing power, so a student in Jakarta and one in Chicago pay a similar share of what things cost where they live.",
            },
            {
              q: "Can I get a refund?",
              a: "If something went wrong, yes: write to us within 7 days of buying. The details are on the refunds page.",
            },
          ]}
        />
      </Section>
    </main>
  );
}
