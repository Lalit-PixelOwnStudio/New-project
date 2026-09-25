import { Crown } from "lucide-react";
import s from "./ProTag.module.css";

/** Marks a Pro-only choice. */
export function ProTag({ label = "Pro" }: { label?: string }) {
  return (
    <span className={s.tag}>
      <Crown aria-hidden="true" strokeWidth={2.4} />
      {label}
    </span>
  );
}
