"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import s from "./Dropdown.module.css";

/**
 * A button that opens a floating panel. Closes on outside click, Escape, or
 * when the panel calls `close`.
 */
export function Dropdown({
  trigger,
  label,
  children,
  align = "start",
  width,
}: {
  trigger: ReactNode;
  label: string;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={s.root} ref={root}>
      <button type="button" className={s.trigger} aria-expanded={open} aria-controls={id} aria-label={label} onClick={() => setOpen((o) => !o)}>
        {trigger}
      </button>
      {open && (
        <div id={id} className={s.panel} data-align={align} style={width ? { width } : undefined} role="dialog" aria-label={label}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
