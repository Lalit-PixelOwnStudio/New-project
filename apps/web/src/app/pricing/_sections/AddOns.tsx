import { BuyButton } from "@/components/BuyButton";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PRODUCTS } from "@/lib/pricing";
import s from "../pricing.module.css";
import type { PriceBook } from "./data";

/** One-time extras for people who don't need a plan. */
export function AddOns({ book }: { book: PriceBook }) {
  return (
    <Section label="Add-ons" title="Just need a little more?" lede="One-time extras, without a plan.">
      <div className={s.addons}>
        <div className={s.addon}>
          <h3>{PRODUCTS.pages_100.name}</h3>
          <p>{PRODUCTS.pages_100.description} Used only for pages past the free limits.</p>
          <BuyButton product="pages_100" currency={book.pay ?? undefined} variant="secondary">
            Buy for {book.price("pages_100").display}
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
            <BuyButton product="my_hand" currency={book.pay ?? undefined}>
              Buy for {book.price("my_hand").display}
            </BuyButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
