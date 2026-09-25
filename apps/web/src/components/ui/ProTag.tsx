import s from "./ProTag.module.css";

/** Marks a Pro-only choice. */
export function ProTag({ label = "Pro" }: { label?: string }) {
  return (
    <span className={s.tag}>{label}</span>
  );
}
