/**
 * What we sell and what it costs where. Prices are purchasing-power adjusted:
 * India pays in rupees through Razorpay (UPI, cards, net banking); everyone
 * else pays in US dollars through PayPal, in one of three regional tiers.
 *
 * Everything is a one-time payment. There is no subscription to cancel.
 */
import { PLANS, type PaidPlan } from "./plans";

export type ProductId = "pass_week" | "pass_month" | "pass_year" | "pages_100" | "style";
export type Region = "IN" | "A" | "B" | "C";
export type Provider = "razorpay" | "paypal";
export type Currency = "INR" | "USD";

export interface Product {
  id: ProductId;
  name: string;
  short: string;
  description: string;
  /** A plan (for its days, with its pages as credits), page credits, or one style. */
  grant: { plan?: PaidPlan; credits?: number; style?: true };
}

export const PRODUCTS: Record<ProductId, Product> = {
  pass_week: {
    id: "pass_week",
    name: "Week plan",
    short: "Week",
    description: `${PLANS.week.pages} pages, every hand, paper and pen, 2K quality and no ads, for seven days.`,
    grant: { plan: "week", credits: PLANS.week.pages! },
  },
  pass_month: {
    id: "pass_month",
    name: "Month plan",
    short: "Month",
    description: `${PLANS.month.pages} pages, everything unlocked, 4K quality and no ads, for a month.`,
    grant: { plan: "month", credits: PLANS.month.pages! },
  },
  pass_year: {
    id: "pass_year",
    name: "Year plan",
    short: "Year",
    description: "Unlimited pages, everything unlocked, 4K quality and no ads, for a year.",
    grant: { plan: "year" },
  },
  pages_100: {
    id: "pages_100",
    name: "100 extra pages",
    short: "Pages",
    description: "Download past the free limits. Credits never expire.",
    grant: { credits: 100 },
  },
  style: {
    id: "style",
    name: "One handwriting, forever",
    short: "Style",
    description: "Keep a single Pro hand for good, without a plan.",
    grant: { style: true },
  },
};

/** Minor units: paise for INR, cents for USD. */
export const PRICES: Record<Region, { currency: Currency; amounts: Record<ProductId, number> }> = {
  IN: { currency: "INR", amounts: { pass_week: 4900, pass_month: 14900, pass_year: 99900, pages_100: 7900, style: 4900 } },
  A: { currency: "USD", amounts: { pass_week: 299, pass_month: 599, pass_year: 3900, pages_100: 299, style: 199 } },
  B: { currency: "USD", amounts: { pass_week: 199, pass_month: 349, pass_year: 2400, pages_100: 199, style: 129 } },
  C: { currency: "USD", amounts: { pass_week: 99, pass_month: 199, pass_year: 1200, pages_100: 99, style: 99 } },
};

const TIER_B = new Set(
  "AL AM AR AZ BA BG BR BY CL CN CO CR CU DO DZ EC GE GT HU IQ IR JM JO KZ LB MA MD ME MK MX MY PA PE PL PY RO RS RU TH TN TR UA UY ZA".split(" "),
);
const TIER_C = new Set("AF BD BO CI CM EG ET GH HN HT ID KE KG KH LA LK MG MM MN MW MZ NG NI NP PH PK RW SD SN SV TJ TZ UG UZ VE VN YE ZM ZW".split(" "));

export function regionFor(country: string | null | undefined): Region {
  const c = (country ?? "").toUpperCase();
  if (c === "IN") return "IN";
  if (TIER_B.has(c)) return "B";
  if (TIER_C.has(c)) return "C";
  return "A";
}

export const providerFor = (region: Region): Provider => (region === "IN" ? "razorpay" : "paypal");

export function formatMoney(amount: number, currency: Currency): string {
  const major = amount / 100;
  if (currency === "INR") return `₹${Number.isInteger(major) ? major.toLocaleString("en-IN") : major.toFixed(2)}`;
  return `$${major.toFixed(2).replace(/\.00$/, "")}`;
}

export interface Price {
  product: ProductId;
  amount: number;
  currency: Currency;
  display: string;
  provider: Provider;
  region: Region;
}

/**
 * Visitors from India can also choose to pay in dollars (through PayPal), at
 * the US price. Nobody else can switch to rupees, so the Indian price stays
 * for India.
 */
export function regionForCheckout(country: string | null | undefined, currency?: Currency | null): Region {
  const region = regionFor(country);
  return region === "IN" && currency === "USD" ? "A" : region;
}

export function priceFor(product: ProductId, country: string | null | undefined, pay?: Currency | null): Price {
  const region = regionForCheckout(country, pay);
  const { currency, amounts } = PRICES[region];
  const amount = amounts[product];
  return { product, amount, currency, display: formatMoney(amount, currency), provider: providerFor(region), region };
}

/** Month-equivalent of the yearly pass, for the "per month" line. */
export function yearlyPerMonth(country: string | null | undefined, pay?: Currency | null): string {
  const p = priceFor("pass_year", country, pay);
  const monthly = p.currency === "INR" ? Math.round(p.amount / 12 / 100) * 100 : Math.round(p.amount / 12);
  return formatMoney(monthly, p.currency);
}

/** Visitor country from the hosting platform's geolocation headers. */
export function countryFromHeaders(h: Headers): string | null {
  return h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? h.get("x-country") ?? null;
}
