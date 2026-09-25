"use client";
import { PenLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { rememberStyle } from "@/editor/useSettings";
import { MINE_PREFIX, removeHand, useHands } from "./store";
import s from "./myhand.module.css";

/** Handwritings already made in this browser (or on the account). */
export function YourHands() {
  const hands = useHands();
  const router = useRouter();
  if (!hands.length) return null;
  return (
    <div className={s.yours}>
      <h2>Your handwritings</h2>
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
