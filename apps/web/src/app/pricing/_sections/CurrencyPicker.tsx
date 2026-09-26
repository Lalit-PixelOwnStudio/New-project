import Link from "next/link";
import { USD_METHODS, type Currency } from "@/lib/pricing";
import s from "../pricing.module.css";

/** Where prices come from: India can switch between rupees and dollars; everyone else sees dollars. */
export function CurrencyPicker({ india, currency }: { india: boolean; currency: Currency }) {
  return (
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
  );
}
