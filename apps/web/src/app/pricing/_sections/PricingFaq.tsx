import { Faq } from "@/components/Faq";
import { Section } from "@/components/Section";
import { LIMITS } from "@/lib/plans";
import { RAZORPAY_ABROAD } from "@/lib/pricing";
import { pages } from "./data";

/** What people ask before paying. */
export function PricingFaq() {
  return (
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
  );
}
