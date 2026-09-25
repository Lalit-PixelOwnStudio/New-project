import s from "./ProTag.module.css";

/** The yellow "Pro" marker, styled like a stroke of highlighter. */
export function ProTag({ label = "Pro" }: { label?: string }) {
  return (
    <span className={s.tag} aria-label="Pro feature">
      {label}
    </span>
  );
}
