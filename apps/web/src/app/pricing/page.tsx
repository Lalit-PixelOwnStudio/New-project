import type { Metadata } from "next";
import { headers } from "next/headers";
import { PageHero } from "@/components/Section";
import { countryFromHeaders, regionFor, type Currency } from "@/lib/pricing";
import { AddOns } from "./_sections/AddOns";
import { CompareTable } from "./_sections/CompareTable";
import { CurrencyPicker } from "./_sections/CurrencyPicker";
import { priceBook } from "./_sections/data";
import { PlanCards } from "./_sections/PlanCards";
import { PricingFaq } from "./_sections/PricingFaq";

export const metadata: Metadata = {
  title: "Pricing: free text to handwriting, paid plans",
  description: `Truehand is free with ads. Three one-time plans add pages, every hand, paper and pen, and up to 4K quality: Week, Month or Year. Nothing renews.`,
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ country?: string; currency?: string }> }) {
  const params = await searchParams;
  const country = (process.env.NODE_ENV !== "production" && params.country) || countryFromHeaders(await headers());
  const india = regionFor(country) === "IN";
  // India can see and pay the US price in dollars; everyone else pays their own regional price.
  const pay: Currency | null = india && params.currency?.toLowerCase() === "usd" ? "USD" : null;
  const book = priceBook(country, pay);

  return (
    <main>
      <PageHero
        eyebrow="Pricing"
        title="Free to use. Pick a plan when you need more."
        lede="Three one-time plans. Nothing renews: pay once, and when it ends you're back on Free. Pages you don't use never expire."
      >
        <CurrencyPicker india={india} currency={book.currency} />
      </PageHero>
      <PlanCards book={book} />
      <AddOns book={book} />
      <CompareTable book={book} />
      <PricingFaq />
    </main>
  );
}
