"use client";
import { useState } from "react";
import { BuyButton } from "@/components/BuyButton";
import s from "./pricing.module.css";

export function StyleUnlock({ styles, priceLabel }: { styles: { id: string; name: string }[]; priceLabel: string }) {
  const [styleId, setStyleId] = useState(styles[0]?.id ?? "");
  return (
    <div className={s.unlock}>
      <label className="visually-hidden" htmlFor="unlock-style">
        Handwriting to unlock
      </label>
      <select id="unlock-style" className={s.select} value={styleId} onChange={(e) => setStyleId(e.target.value)}>
        {styles.map((st) => (
          <option key={st.id} value={st.id}>
            {st.name}
          </option>
        ))}
      </select>
      <BuyButton product="style" styleId={styleId} variant="secondary">
        Keep it for {priceLabel}
      </BuyButton>
    </div>
  );
}
