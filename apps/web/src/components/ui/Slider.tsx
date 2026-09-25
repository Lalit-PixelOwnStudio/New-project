"use client";
import { useId, type ReactNode } from "react";
import s from "./Slider.module.css";

/** A labelled range input that shows its value in mono. */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  hint,
  disabled,
  after,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
  disabled?: boolean;
  after?: ReactNode;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={s.slider} data-disabled={disabled || undefined}>
      <div className={s.head}>
        <label htmlFor={id}>
          {label}
          {after}
        </label>
        <output htmlFor={id}>{format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-describedby={hint ? `${id}-hint` : undefined}
        style={{ ["--pct" as string]: `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && (
        <p id={`${id}-hint`} className={s.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
