"use client";
import { Lock, PenLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BuyButton } from "@/components/BuyButton";
import { Button } from "@/components/ui/Button";
import { rememberStyle } from "@/editor/useSettings";
import { canUseStyle, useEntitlements } from "@/lib/entitlements-client";
import { MINE_PREFIX, removeHand, useHands } from "./store";
import s from "./myhand.module.css";

/** Handwritings already made in this browser (or on the account). */
export function YourHands({ priceLabel }: { priceLabel: string }) {
  const hands = useHands();
  const router = useRouter();
  const { entitlements, loading } = useEntitlements();
  if (!hands.length) return null;
  const locked = !loading && !canUseStyle(entitlements, MINE_PREFIX, "pro");
  return (
    <div className={s.yours}>
      <h2>Your handwritings</h2>
      {locked && (
        <div className={s.yoursLocked}>
          <span>
            <Lock aria-hidden="true" /> Downloads in your handwriting are locked.
          </span>
          <BuyButton product="my_hand" size="s">
            Unlock for {priceLabel}
          </BuyButton>
        </div>
      )}
      <ul>
        {hands.map((h) => (
          <li key={h.id}>
            <PenLine aria-hidden="true" />
            <span>{h.name}</span>
            <Button
              type="button"
              size="s"
              onClick={() => {
                rememberStyle(MINE_PREFIX + h.id);
                router.push("/");
              }}
            >
              Write with it
            </Button>
            <Button
              type="button"
              size="s"
              variant="secondary"
              aria-label={`Delete ${h.name}`}
              onClick={() => {
                if (confirm(`Delete "${h.name}"? This can't be undone.`)) removeHand(h.id);
              }}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
