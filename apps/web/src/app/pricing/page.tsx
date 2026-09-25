import { PAPERS, PENS, STYLES } from "@truehand/catalog";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { BuyButton } from "@/components/BuyButton";
import { Faq } from "@/components/Faq";
import { PageHero, Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ProTag } from "@/components/ui/ProTag";
import { LIMITS } from "@/lib/plans";
import { countryFromHeaders, priceFor, PRODUCTS, regionFor, yearlyPerMonth } from "@/lib/pricing";
import { StyleUnlock } from "./StyleUnlock";
import s from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Truehand is free with ads. Pro removes ads and unlocks every hand, paper and pen, paid once for a week, a month or a year. No subscription.",
};

const freePapers = PAPERS.filter((p) => p.tier === "free").length;
const freePens = PENS.filter((p) => p.tier === "free").length;

const REGION_LABEL = { IN: "India", A: "your region", B: "your region", C: "your region" } as const;

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  const { country: override } = await searchParams;
  const country = (process.env.NODE_ENV !== "production" && override) || countryFromHeaders(await headers());
  const region = regionFor(country);
  const price = (p: Parameters<typeof priceFor>[0]) => priceFor(p, country);
  const proStyles = STYLES.filter((st) => st.tier === "pro").map((st) => ({ id: st.id, name: st.name }));
  const free = LIMITS.free;

  return (
    <main>
      <PageHero
        eyebrow="Pricing"
        title="Free to use. Pro when you need more."
        lede="No subscription and nothing auto-renews. Buy Pro for a week, a month or a year, pay once, and it simply ends. Prices are set for where you are."
      >
        <p className={s.where}>
          Prices for {REGION_LABEL[region]} · {price("pass_month").currency}
          {region === "IN" ? " · UPI, cards, net banking" : " · PayPal and cards"}
        </p>
      </PageHero>

      <Section tone="page">
        <div className={s.plans}>
          <div className={s.plan}>
            <header>
              <h2 className={s.planName}>Free</h2>
              <p className={s.price}>
                <span>{price("pass_month").currency === "INR" ? "₹0" : "$0"}</span>
              </p>
              <p className={s.planNote}>Paid for by a few quiet ads.</p>
            </header>
            <ul className={s.list}>
              <li>{STYLES.filter((st) => st.tier === "free").length} handwriting styles, including the messy everyday ones</li>
              <li>
                {freePapers} papers and {freePens} ballpoint pens
              </li>
              <li>
                {free.pagesPerExport} pages per download, {free.pagesPerDay} a day
              </li>
              <li>PDF, PNG and ZIP at {free.maxDpi} dpi</li>
              <li>No watermark, no account needed</li>
            </ul>
            <ButtonLink href="/" variant="secondary" wide>
              Start writing
            </ButtonLink>
          </div>

          <div className={s.plan} data-pro>
            <header>
              <h2 className={s.planName}>
                Pro <ProTag label="no ads" />
              </h2>
              <p className={s.price}>
                <span>{price("pass_month").display}</span>
                <small>/ month, paid once</small>
              </p>
              <p className={s.planNote}>
                Or {price("pass_year").display} for a year ({yearlyPerMonth(country)}/month), or {price("pass_week").display} for one week.
              </p>
            </header>
            <ul className={s.list}>
              <li>All {STYLES.length} hands, including joined cursive and elegant scripts</li>
              <li>All papers: legal pad, Cornell, dot grid, engineering, vintage, kraft…</li>
              <li>Gel, fountain, pencil and marker, or any ink colour</li>
              <li>Unlimited pages, 300 dpi print quality</li>
              <li>Scan and phone-photo finishes, fatigue control</li>
              <li>Batch letters from a spreadsheet, transparent PNGs</li>
              <li>No ads, anywhere</li>
            </ul>
            <div className={s.passes}>
              <BuyButton product="pass_month" wide size="l">
                Get Pro for a month · {price("pass_month").display}
              </BuyButton>
              <div className={s.passRow}>
                <BuyButton product="pass_week" variant="secondary" wide>
                  Week · {price("pass_week").display}
                </BuyButton>
                <BuyButton product="pass_year" variant="secondary" wide>
                  Year · {price("pass_year").display}
                </BuyButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section label="Add-ons" title="Just need a little more?" lede="One-time extras for when Pro is more than you need.">
        <div className={s.addons}>
          <div className={s.addon}>
            <h3>{PRODUCTS.pages_100.name}</h3>
            <p>{PRODUCTS.pages_100.description} Spent only on pages past the free limits.</p>
            <BuyButton product="pages_100" variant="secondary">
              Buy for {price("pages_100").display}
            </BuyButton>
          </div>
          <div className={s.addon}>
            <h3>{PRODUCTS.style.name}</h3>
            <p>{PRODUCTS.style.description} Pick the hand you want to keep.</p>
            <StyleUnlock styles={proStyles} priceLabel={price("style").display} />
          </div>
        </div>
      </Section>

      <Section label="Compare" title="Free and Pro, side by side" tone="page">
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Feature</span>
              </th>
              <th scope="col">Free</th>
              <th scope="col">Pro</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Handwriting styles", `${STYLES.filter((st) => st.tier === "free").length}`, `${STYLES.length}`],
              ["Papers", `${freePapers}`, `${PAPERS.length}`],
              ["Pens and ink", `${freePens} ballpoints`, `${PENS.length} pens + any colour`],
              ["Pages per download", `${free.pagesPerExport}`, "Unlimited"],
              ["Pages per day", `${free.pagesPerDay}`, "Unlimited"],
              ["Resolution", "150 dpi", "300 dpi"],
              ["Scan and photo finishes", "Preview", "Yes"],
              ["Batch letters from CSV", "—", "Yes"],
              ["Transparent PNG", "—", "Yes"],
              ["Ads", "Yes", "None"],
              ["Watermark", "None", "None"],
            ].map(([f, a, b]) => (
              <tr key={f}>
                <th scope="row">{f}</th>
                <td>{a}</td>
                <td>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section label="Questions" title="Before you buy">
        <Faq
          items={[
            {
              q: "Does anything renew automatically?",
              a: "No. Every purchase is a one-time payment. When your week, month or year ends, your account goes back to Free. Buy again whenever you need it; new time is added on top of any you have left.",
            },
            {
              q: "How can I pay?",
              a: "In India, through Razorpay: UPI, debit and credit cards, net banking and wallets, in rupees. Everywhere else, through PayPal, with a PayPal account or a card, in US dollars.",
            },
            {
              q: "Why are prices different in different countries?",
              a: "Prices are adjusted to local purchasing power, so a student in Jakarta and one in Chicago pay a similar share of what things cost where they live. The price is set by your location at checkout.",
            },
            {
              q: "Do I need an account?",
              a: "Not for Free. To buy anything you sign in with your email or Google, so what you buy is kept safe on your account and works on any device.",
            },
            {
              q: "Can I get a refund?",
              a: "If something went wrong, yes: write to us within 7 days of buying and we'll refund unused time. The details are on the refunds page.",
            },
            {
              q: "What happens to my pages when Pro ends?",
              a: "Everything you downloaded is yours to keep. Your text and settings stay in your browser; Pro styles simply show a Pro tag again.",
            },
          ]}
        />
      </Section>
    </main>
  );
}
