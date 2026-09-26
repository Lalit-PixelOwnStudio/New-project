import { PAPERS, PENS, STYLES } from "@truehand/catalog";
import type { PaidPlan } from "@/lib/plans";
import { priceFor, yearlyPerMonth, type Currency, type Price, type ProductId } from "@/lib/pricing";

export const freeStyles = STYLES.filter((st) => st.tier === "free").length;
export const freePapers = PAPERS.filter((p) => p.tier === "free").length;
export const freePens = PENS.filter((p) => p.tier === "free").length;
export const pages = (n: number | null) => (n === null ? "Unlimited" : n.toLocaleString("en-US"));

export const PLAN_CARDS: { plan: PaidPlan; product: ProductId; per: string; badge?: string; features: string[] }[] = [
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

/** Prices for one visitor: their region, and the currency they chose if they're in India. */
export interface PriceBook {
  price: (p: ProductId) => Price;
  currency: Currency;
  /** The currency picked on the page, passed on to checkout. */
  pay: Currency | null;
  /** The Year plan's price per month, for its card. */
  perMonthOfYear: string;
}

export function priceBook(country: string | null, pay: Currency | null): PriceBook {
  const price = (p: ProductId) => priceFor(p, country, pay);
  return { price, currency: price("pass_month").currency, pay, perMonthOfYear: yearlyPerMonth(country, pay) };
}
