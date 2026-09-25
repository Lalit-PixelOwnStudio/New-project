"use client";
import Link from "next/link";
import { useState } from "react";
import { BuyButton } from "@/components/BuyButton";
import type { Currency } from "@/lib/pricing";
import s from "./pricing.module.css";

/** Pick a Pro hand by how it looks: every name is written in its own handwriting. */
export function StyleUnlock({ styles, priceLabel, currency }: { styles: { id: string; name: string }[]; priceLabel: string; currency?: Currency }) {
  const [styleId, setStyleId] = useState(styles[0]?.id ?? "");
  const current = styles.find((st) => st.id === styleId) ?? styles[0]!;
  return (
    <div className={s.unlock}>
      <fieldset className={s.hands}>
        <legend className="visually-hidden">Handwriting to keep</legend>
        {styles.map((st) => (
          <label key={st.id} className={s.hand} data-checked={st.id === styleId || undefined}>
            <input type="radio" name="unlock-style" value={st.id} checked={st.id === styleId} onChange={() => setStyleId(st.id)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/specimens/name-${st.id}.webp`} alt={st.name} width={250} height={62} loading="lazy" decoding="async" />
          </label>
        ))}
      </fieldset>
      <figure className={s.sample}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/specimens/style-${current.id}.webp`} alt={`A sample of the ${current.name} handwriting`} width={930} height={225} />
        <figcaption>
          {current.name} · <Link href={`/styles/${current.id}`}>See it on a full page</Link>
        </figcaption>
      </figure>
      <BuyButton product="style" styleId={current.id} currency={currency} variant="secondary">
        Keep {current.name} for {priceLabel}
      </BuyButton>
    </div>
  );
}
