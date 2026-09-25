"use client";
import { useId, type ReactNode } from "react";
import s from "./Segmented.module.css";

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

/** A row of mutually exclusive choices, built on native radio inputs. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className={s.group}>
      <legend className="visually-hidden">{label}</legend>
      {options.map((o) => (
        <label key={o.value} className={s.option} data-checked={o.value === value || undefined}>
          <input type="radio" name={name} value={o.value} checked={o.value === value} disabled={o.disabled} onChange={() => onChange(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
